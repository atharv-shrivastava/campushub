package com.campushub.controller;

import com.campushub.model.*;
import com.campushub.repository.CampusRequestRepository;
import com.campushub.service.CubeService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class CubeController {
    private final CubeService service;
    private final CampusRequestRepository requests;

    public CubeController(CubeService service, CampusRequestRepository requests) {
        this.service = service;
        this.requests = requests;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("ok", true, "service", "cube-backend");
    }

    @GetMapping("/resources")
    public List<ResourceResponse> resources(@RequestParam(required = false) String q) {
        return service.listResources(q).stream().map(ResourceResponse::from).toList();
    }

    @PostMapping(value = "/resources", consumes = "application/json")
    public ResponseEntity<ResourceResponse> createResource(
            @RequestHeader(value = "X-User-Id", defaultValue = "demo-atharv") String userId,
            @Valid @RequestBody CreateResourceRequest body) {
        Resource saved = service.createResource(userId, body.title, body.subject, body.tag,
                body.teacher, body.setName, body.fileHash, body.fileName);
        return ResponseEntity.ok(ResourceResponse.from(saved));
    }

    @PostMapping(value = "/resources/upload", consumes = "multipart/form-data")
    public ResponseEntity<ResourceResponse> uploadResourcePdf(
            @RequestHeader(value = "X-User-Id", defaultValue = "demo-atharv") String userId,
            @RequestPart("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam String title,
            @RequestParam String subject,
            @RequestParam(defaultValue = "Notes") String tag,
            @RequestParam(required = false) String teacher,
            @RequestParam(defaultValue = "A") String setName) {
        Resource saved = service.createResourceFromPdf(userId, title, subject, tag, teacher, setName, file);
        return ResponseEntity.ok(ResourceResponse.from(saved));
    }

    @PostMapping("/resources/{id}/vote")
    public Map<String, Long> voteResource(
            @RequestHeader(value = "X-User-Id", defaultValue = "demo-atharv") String userId,
            @PathVariable long id) {
        return Map.of("votes", service.voteResource(userId, id));
    }

    @GetMapping("/requests")
    public List<RequestResponse> requests() {
        return requests.findAllByOrderByCreatedAtDesc().stream().map(RequestResponse::from).toList();
    }

    @PostMapping("/requests")
    public ResponseEntity<RequestResponse> createRequest(
            @RequestHeader(value = "X-User-Id", defaultValue = "demo-atharv") String userId,
            @Valid @RequestBody CreateRequest body) {
        return ResponseEntity.ok(RequestResponse.from(service.createRequest(userId, body.title, body.detail, body.bounty)));
    }

    @PostMapping("/requests/{id}/accept")
    public RequestResponse accept(
            @RequestHeader(value = "X-User-Id", defaultValue = "demo-atharv") String userId,
            @PathVariable long id) {
        return RequestResponse.from(service.acceptRequest(userId, id));
    }

    @PostMapping("/requests/{id}/deliver")
    public RequestResponse deliver(
            @RequestHeader(value = "X-User-Id", defaultValue = "demo-atharv") String userId,
            @PathVariable long id) {
        return RequestResponse.from(service.deliverRequest(userId, id));
    }

    @PostMapping("/requests/{id}/complete")
    public RequestResponse complete(
            @RequestHeader(value = "X-User-Id", defaultValue = "demo-atharv") String userId,
            @PathVariable long id) {
        return RequestResponse.from(service.completeRequest(userId, id));
    }

    @PostMapping("/requests/{id}/dispute")
    public RequestResponse dispute(
            @RequestHeader(value = "X-User-Id", defaultValue = "demo-atharv") String userId,
            @PathVariable long id) {
        return RequestResponse.from(service.disputeRequest(userId, id));
    }

    @PostMapping("/requests/{id}/cancel")
    public RequestResponse cancel(
            @RequestHeader(value = "X-User-Id", defaultValue = "demo-atharv") String userId,
            @PathVariable long id) {
        return RequestResponse.from(service.cancelRequest(userId, id));
    }

    @PostMapping("/requests/{id}/resolve")
    public RequestResponse resolve(
            @RequestHeader(value = "X-Admin-Id") String adminId,
            @PathVariable long id,
            @RequestParam String outcome) {
        return RequestResponse.from(service.resolveDispute(adminId, id, outcome));
    }

    @PostMapping("/me/role")
    public WalletResponse setRole(@RequestHeader(value = "X-User-Id", defaultValue = "demo-atharv") String userId,
                                   @RequestParam User.Role role) {
        return WalletResponse.from(service.setRole(userId, role));
    }

    @GetMapping("/wallet")
    public WalletResponse wallet(@RequestHeader(value = "X-User-Id", defaultValue = "demo-atharv") String userId) {
        User user = service.wallet(userId);
        return WalletResponse.from(user);
    }

    @GetMapping("/wallet/transactions")
    public List<TransactionResponse> walletTransactions(
            @RequestHeader(value = "X-User-Id", defaultValue = "demo-atharv") String userId) {
        return service.transactions(userId).stream().map(TransactionResponse::from).toList();
    }

    public record CreateResourceRequest(
            @NotBlank String title, @NotBlank String subject, @NotBlank String tag,
            String teacher, String setName, @NotBlank @Size(min=64,max=64) String fileHash, @NotBlank String fileName) {}

    public record CreateRequest(@NotBlank String title, @NotBlank @Size(max=1000) String detail, @Positive long bounty) {}

    public record ResourceResponse(Long id, String title, String subject, String tag, String teacher,
                                   String setName, String fileName, Long votes, String createdBy, String createdAt) {
        static ResourceResponse from(Resource r) {
            return new ResourceResponse(r.getId(), r.getTitle(), r.getSubject(), r.getTag(), r.getTeacher(),
                    r.getSetName(), r.getFileName(), r.getVotes(), r.getCreatedBy(), r.getCreatedAt().toString());
        }
    }

    public record RequestResponse(Long id, String title, String detail, Long bounty, String state,
                                   String requesterExternalId, String helperExternalId,
                                   String createdAt, String deliveredAt, String autoReleaseAt) {
        static RequestResponse from(CampusRequest r) {
            return new RequestResponse(r.getId(), r.getTitle(), r.getDetail(), r.getBounty(), r.getState().name(),
                    r.getRequesterExternalId(), r.getHelperExternalId(),
                    r.getCreatedAt().toString(),
                    r.getDeliveredAt() == null ? null : r.getDeliveredAt().toString(),
                    r.getAutoReleaseAt() == null ? null : r.getAutoReleaseAt().toString());
        }
    }

    public record WalletResponse(String userId, String name, Long monthly, Long spendable, Long conduct, User.Role role, Integer validPdfUploads, boolean unlocked) {
        static WalletResponse from(User u) {
            return new WalletResponse(u.getExternalId(), u.getName(), u.getMonthlyCred(), u.getSpendableCred(), u.getConductCred(), u.getRole(), u.getValidPdfUploads(), u.getValidPdfUploads() >= 2);
        }
    }

    public record TransactionResponse(Long id, Long monthlyAmount, Long spendableAmount, Long conductAmount,
                                      String source, String referenceId, String description, String createdAt) {
        static TransactionResponse from(CredTransaction t) {
            return new TransactionResponse(t.getId(), t.getMonthlyAmount(), t.getSpendableAmount(),
                    t.getConductAmount(), t.getSource(), t.getReferenceId(), t.getDescription(), t.getCreatedAt().toString());
        }
    }
}