package com.campushub.model;

import jakarta.persistence.*;

@Entity
@Table(name="clubs", uniqueConstraints=@UniqueConstraint(name="uk_club_name", columnNames="name"))
public class Club {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false,length=120) private String name;
    @Column(nullable=false,length=120) private String ownerExternalId;
    @Column(nullable=false,length=20) private String status = "PENDING";

    protected Club(){}
    public Club(String name,String ownerExternalId){this.name=name;this.ownerExternalId=ownerExternalId;}
    public Long getId(){return id;}
    public String getName(){return name;}
    public String getOwnerExternalId(){return ownerExternalId;}
    public String getStatus(){return status;}
    public void approve(){status="APPROVED";}
    public void reject(){status="REJECTED";}
}