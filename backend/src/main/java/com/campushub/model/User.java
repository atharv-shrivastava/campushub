package com.campushub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cube_users", uniqueConstraints = @UniqueConstraint(name = "uk_user_external_id", columnNames = "external_id"))
public class User {
    public enum Role { STUDENT, CLUB, ADMIN }
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "external_id", nullable = false, unique = true, length = 120)
    private String externalId;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, length = 40)
    private String branch = "CSE";

    @Column(nullable = false)
    private Integer year = 2;

    @Column(nullable = false)
    private Integer semester = 3;

    @Column(name = "set_name", nullable = false, length = 10)
    private String setName = "A";

    @Column(name = "monthly_cred", nullable = false)
    private Long monthlyCred = 0L;

    @Column(name = "spendable_cred", nullable = false)
    private Long spendableCred = 0L;

    @Column(name = "conduct_cred", nullable = false)
    private Long conductCred = 0L;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.STUDENT;

    @Column(name = "valid_pdf_uploads", nullable = false)
    private Integer validPdfUploads = 0;

    protected User() {}

    public User(String externalId, String name) {
        this.externalId = externalId;
        this.name = name;
    }

    public Long getId(){ return id; }
    public String getExternalId(){ return externalId; }
    public String getName(){ return name; }
    public String getBranch(){ return branch; }
    public Integer getYear(){ return year; }
    public Integer getSemester(){ return semester; }
    public String getSetName(){ return setName; }
    public Long getMonthlyCred(){ return monthlyCred; }
    public Long getSpendableCred(){ return spendableCred; }
    public Long getConductCred(){ return conductCred; }
    public Role getRole(){ return role; }
    public Integer getValidPdfUploads(){ return validPdfUploads; }
    public void setRole(Role role){ this.role = role; }
    public void incrementValidPdfUploads(){ this.validPdfUploads++; }

    public void addMonthly(long amount){ monthlyCred += amount; }
    public void addSpendable(long amount){ spendableCred += amount; }
    public void addConduct(long amount){ conductCred += amount; }
}