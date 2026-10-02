package com.campushub.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "campus_requests")
public class CampusRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(nullable = false, length = 1000)
    private String detail;

    @Column(nullable = false)
    private Long bounty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private RequestState state = RequestState.OPEN;

    @Column(name = "requester_external_id", nullable = false, length = 120)
    private String requesterExternalId;

    @Column(name = "helper_external_id", length = 120)
    private String helperExternalId;

    private Instant createdAt = Instant.now();
    private Instant deliveredAt;
    private Instant autoReleaseAt;

    protected CampusRequest() {}

    public CampusRequest(String title, String detail, long bounty, String requesterExternalId) {
        this.title = title;
        this.detail = detail;
        this.bounty = bounty;
        this.requesterExternalId = requesterExternalId;
    }

    public Long getId(){ return id; }
    public String getTitle(){ return title; }
    public String getDetail(){ return detail; }
    public Long getBounty(){ return bounty; }
    public RequestState getState(){ return state; }
    public String getRequesterExternalId(){ return requesterExternalId; }
    public String getHelperExternalId(){ return helperExternalId; }
    public Instant getCreatedAt(){ return createdAt; }
    public Instant getDeliveredAt(){ return deliveredAt; }
    public Instant getAutoReleaseAt(){ return autoReleaseAt; }

    public void accept(String helper){ this.helperExternalId = helper; this.state = RequestState.ACCEPTED; }
    public void deliver(Instant at){ this.deliveredAt = at; this.autoReleaseAt = at.plusSeconds(48 * 60 * 60L); this.state = RequestState.DELIVERED; }
    public void complete(){ this.state = RequestState.COMPLETED; }
    public void autoRelease(){ this.state = RequestState.AUTO_RELEASED; }
    public void dispute(){ this.state = RequestState.DISPUTED; }
    public void cancel(){ this.state = RequestState.CANCELLED; }
    public void refund(){ this.state = RequestState.REFUNDED; }
    public void forfeit(){ this.state = RequestState.FORFEITED; }
}