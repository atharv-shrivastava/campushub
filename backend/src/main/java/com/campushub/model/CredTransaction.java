package com.campushub.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "cred_transactions")
public class CredTransaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_external_id", nullable = false, length = 120)
    private String userExternalId;

    @Column(nullable = false)
    private Long monthlyAmount = 0L;

    @Column(nullable = false)
    private Long spendableAmount = 0L;

    @Column(nullable = false)
    private Long conductAmount = 0L;

    @Column(nullable = false, length = 40)
    private String source;

    @Column(length = 120)
    private String referenceId;

    @Column(length = 255)
    private String description;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected CredTransaction() {}

    public CredTransaction(String userExternalId, long monthlyAmount, long spendableAmount,
                           long conductAmount, String source, String referenceId, String description) {
        this.userExternalId = userExternalId;
        this.monthlyAmount = monthlyAmount;
        this.spendableAmount = spendableAmount;
        this.conductAmount = conductAmount;
        this.source = source;
        this.referenceId = referenceId;
        this.description = description;
    }

    public Long getId(){ return id; }
    public String getUserExternalId(){ return userExternalId; }
    public Long getMonthlyAmount(){ return monthlyAmount; }
    public Long getSpendableAmount(){ return spendableAmount; }
    public Long getConductAmount(){ return conductAmount; }
    public String getSource(){ return source; }
    public String getReferenceId(){ return referenceId; }
    public String getDescription(){ return description; }
    public Instant getCreatedAt(){ return createdAt; }
}