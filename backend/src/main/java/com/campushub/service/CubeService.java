package com.campushub.service;

import com.campushub.model.*;
import com.campushub.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class CubeService {
    private static final String DEFAULT_USER = "demo-atharv";
    private static final long MONTHLY_UPLOAD_REWARD = 10;
    private static final long SPENDABLE_UPLOAD_REWARD = 10;
    private static final long HELPER_MONTHLY_REWARD = 15;

    private final UserRepository users;
    private final ResourceRepository resources;
    private final CampusRequestRepository requests;
    private final CredTransactionRepository transactions;

    public CubeService(UserRepository users, ResourceRepository resources,
                       CampusRequestRepository requests, CredTransactionRepository transactions) {
        this.users = users;
        this.resources = resources;
        this.requests = requests;
        this.transactions = transactions;
    }

    public User ensureUser(String externalId) {
        String id = externalId == null || externalId.isBlank() ? DEFAULT_USER : externalId.trim();
        return users.findByExternalId(id).orElseGet(() -> {
            User user = new User(id, id.equals(DEFAULT_USER) ? "Atharv" : id);
            user.addMonthly(72);
            user.addSpendable(148);
            user.addConduct(36);
            return users.save(user);
        });
    }

    public List<Resource> listResources(String query) {
        List<Resource> list = resources.findAllByOrderByCreatedAtDesc();
        if (query == null || query.isBlank()) return list;
        String q = query.trim().toLowerCase();
        return list.stream().filter(r ->
                contains(r.getTitle(), q) ||
                contains(r.getSubject(), q) ||
                contains(r.getTag(), q) ||
                contains(r.getTeacher(), q)
        ).toList();
    }

    @Transactional
    public Resource createResource(String userId, String title, String subject, String tag,
                                   String teacher, String setName, String fileHash, String fileName) {
        ensureUser(userId);
        if (resources.findByFileHash(fileHash).isPresent()) {
            throw new IllegalStateException("Duplicate PDF detected: this SHA-256 already exists.");
        }
        Resource resource = resources.save(new Resource(
                title.trim(), subject.trim(), tag.trim(),
                teacher == null ? null : teacher.trim(),
                setName == null || setName.isBlank() ? "A" : setName.trim(),
                fileHash.trim(), fileName.trim(), userId
        ));
        User user = ensureUser(userId);
        user.addMonthly(MONTHLY_UPLOAD_REWARD);
        user.addSpendable(SPENDABLE_UPLOAD_REWARD);
        users.save(user);
        transactions.save(new CredTransaction(userId, MONTHLY_UPLOAD_REWARD, SPENDABLE_UPLOAD_REWARD, 0,
                "RESOURCE_UPLOAD", String.valueOf(resource.getId()), "Valid academic resource contribution"));
        return resource;
    }

    @Transactional
    public CampusRequest createRequest(String userId, String title, String detail, long bounty) {
        User user = ensureUser(userId);
        if (bounty <= 0) throw new IllegalArgumentException("Bounty must be greater than zero.");
        if (user.getSpendableCred() < bounty) throw new IllegalStateException("Not enough Spendable Cred.");
        user.addSpendable(-bounty);
        users.save(user);
        CampusRequest request = requests.save(new CampusRequest(title.trim(), detail.trim(), bounty, userId));
        transactions.save(new CredTransaction(userId, 0, -bounty, 0, "ESCROW_LOCK",
                String.valueOf(request.getId()), "Bounty locked for campus request"));
        return request;
    }

    @Transactional
    public CampusRequest acceptRequest(String userId, long requestId) {
        User user = ensureUser(userId);
        CampusRequest request = getRequest(requestId);
        if (request.getState() != RequestState.OPEN) throw new IllegalStateException("Request is not open.");
        if (request.getRequesterExternalId().equals(user.getExternalId())) throw new IllegalStateException("You cannot accept your own request.");
        request.accept(user.getExternalId());
        return requests.save(request);
    }

    @Transactional
    public CampusRequest deliverRequest(String userId, long requestId) {
        User user = ensureUser(userId);
        CampusRequest request = getRequest(requestId);
        if (request.getState() != RequestState.ACCEPTED) throw new IllegalStateException("Request must be accepted first.");
        if (!user.getExternalId().equals(request.getHelperExternalId())) throw new IllegalStateException("Only the assigned helper can deliver.");
        request.deliver(Instant.now());
        return requests.save(request);
    }

    @Transactional
    public CampusRequest completeRequest(String userId, long requestId) {
        User user = ensureUser(userId);
        CampusRequest request = getRequest(requestId);
        if (request.getState() != RequestState.DELIVERED) throw new IllegalStateException("Only delivered requests can be completed.");
        if (!user.getExternalId().equals(request.getRequesterExternalId())) throw new IllegalStateException("Only the requester can accept delivery.");
        settlePayout(request, false);
        return requests.save(request);
    }

    @Transactional
    public CampusRequest disputeRequest(String userId, long requestId) {
        User user = ensureUser(userId);
        CampusRequest request = getRequest(requestId);
        if (!user.getExternalId().equals(request.getRequesterExternalId())) throw new IllegalStateException("Only the requester can dispute.");
        if (request.getState() != RequestState.DELIVERED) throw new IllegalStateException("Only delivered requests can be disputed.");
        request.dispute();
        return requests.save(request);
    }

    @Transactional
    public CampusRequest cancelRequest(String userId, long requestId) {
        User user = ensureUser(userId);
        CampusRequest request = getRequest(requestId);
        if (!user.getExternalId().equals(request.getRequesterExternalId())) throw new IllegalStateException("Only the requester can cancel.");
        if (request.getState() != RequestState.OPEN) throw new IllegalStateException("Only open requests can be cancelled.");
        user.addSpendable(request.getBounty());
        users.save(user);
        request.cancel();
        transactions.save(new CredTransaction(userId, 0, request.getBounty(), 0, "ESCROW_REFUND",
                String.valueOf(request.getId()), "Requester cancelled before delivery"));
        return requests.save(request);
    }

    @Transactional
    public CampusRequest resolveDispute(String adminUserId, long requestId, String outcome) {
        if (!"true-admin".equals(adminUserId)) throw new IllegalStateException("Admin access required.");
        CampusRequest request = getRequest(requestId);
        if (request.getState() != RequestState.DISPUTED) throw new IllegalStateException("Request is not disputed.");

        switch (outcome.toUpperCase()) {
            case "COMPLETED" -> settlePayout(request, false);
            case "REFUNDED" -> {
                User requester = ensureUser(request.getRequesterExternalId());
                requester.addSpendable(request.getBounty());
                users.save(requester);
                request.refund();
                transactions.save(new CredTransaction(requester.getExternalId(), 0, request.getBounty(), 0,
                        "ESCROW_REFUND", String.valueOf(request.getId()), "Admin resolved dispute in requester favor"));
            }
            case "FORFEITED" -> {
                request.forfeit();
                transactions.save(new CredTransaction(request.getRequesterExternalId(), 0, 0, 0,
                        "ESCROW_BURN", String.valueOf(request.getId()), "Admin forfeited disputed escrow"));
            }
            default -> throw new IllegalArgumentException("Outcome must be COMPLETED, REFUNDED, or FORFEITED.");
        }
        return requests.save(request);
    }

    @Transactional
    public long voteResource(String userId, long resourceId) {
        ensureUser(userId);
        Resource resource = resources.findById(resourceId).orElseThrow(() -> new IllegalArgumentException("Resource not found."));
        resource.vote();
        resources.save(resource);
        return resource.getVotes();
    }

    public User wallet(String userId) { return ensureUser(userId); }

    public List<CredTransaction> transactions(String userId) {
        ensureUser(userId);
        return transactions.findTop20ByUserExternalIdOrderByCreatedAtDesc(userId);
    }

    @Scheduled(fixedDelay = 60_000)
    @Transactional
    public void autoReleaseDueRequests() {
        for (CampusRequest request : requests.findByStateAndAutoReleaseAtLessThanEqual(RequestState.DELIVERED, Instant.now())) {
            settlePayout(request, true);
            requests.save(request);
        }
    }

    private CampusRequest getRequest(long requestId) {
        return requests.findById(requestId).orElseThrow(() -> new IllegalArgumentException("Request not found."));
    }

    private void settlePayout(CampusRequest request, boolean auto) {
        String helperId = request.getHelperExternalId();
        if (helperId == null || helperId.isBlank()) throw new IllegalStateException("Request has no helper.");
        User helper = ensureUser(helperId);
        long payout = Math.floorDiv(request.getBounty() * 9, 10);
        long fee = request.getBounty() - payout;

        helper.addSpendable(payout);
        helper.addMonthly(HELPER_MONTHLY_REWARD);
        users.save(helper);

        transactions.save(new CredTransaction(helperId, HELPER_MONTHLY_REWARD, payout, 0,
                auto ? "ESCROW_AUTO_RELEASE" : "ESCROW_PAYOUT",
                String.valueOf(request.getId()),
                auto ? "48-hour automatic release" : "Requester accepted delivery"));
        if (fee > 0) {
            transactions.save(new CredTransaction(helperId, 0, 0, 0,
                    "ESCROW_BURN", String.valueOf(request.getId()),
                    "Platform fee burned from request bounty: " + fee + " Cred"));
        }

        if (auto) request.autoRelease();
        else request.complete();
    }

    private boolean contains(String value, String query) {
        return value != null && value.toLowerCase().contains(query);
    }
}