package com.campushub.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name="campus_events")
public class CampusEvent {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false,length=180) private String title;
    @Column(nullable=false,length=60) private String kind;
    @Column(nullable=false,length=180) private String venue;
    @Column(nullable=false) private Instant startsAt;
    @Column(nullable=false,length=20) private String status = "PENDING";
    @Column(nullable=false) private Long clubId;
    @Column(nullable=false,length=120) private String submittedBy;

    protected CampusEvent(){}
    public CampusEvent(String title,String kind,String venue,Instant startsAt,Long clubId,String submittedBy){
        this.title=title;this.kind=kind;this.venue=venue;this.startsAt=startsAt;this.clubId=clubId;this.submittedBy=submittedBy;
    }
    public Long getId(){return id;}
    public String getTitle(){return title;}
    public String getKind(){return kind;}
    public String getVenue(){return venue;}
    public Instant getStartsAt(){return startsAt;}
    public String getStatus(){return status;}
    public Long getClubId(){return clubId;}
    public String getSubmittedBy(){return submittedBy;}
    public void approve(){status="PUBLISHED";}
    public void reject(){status="REJECTED";}
}