package com.campushub.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "resources", uniqueConstraints = @UniqueConstraint(name = "uk_resource_file_hash", columnNames = "file_hash"))
public class Resource {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(nullable = false, length = 120)
    private String subject;

    @Column(nullable = false, length = 40)
    private String tag;

    @Column(length = 100)
    private String teacher;

    @Column(name = "set_name", nullable = false, length = 10)
    private String setName = "A";

    @Column(name = "file_hash", nullable = false, unique = true, length = 64)
    private String fileHash;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(nullable = false)
    private Long votes = 0L;

    @Column(name = "created_by", nullable = false, length = 120)
    private String createdBy;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected Resource() {}

    public Resource(String title, String subject, String tag, String teacher, String setName,
                    String fileHash, String fileName, String createdBy) {
        this.title = title;
        this.subject = subject;
        this.tag = tag;
        this.teacher = teacher;
        this.setName = setName;
        this.fileHash = fileHash;
        this.fileName = fileName;
        this.createdBy = createdBy;
    }

    public Long getId(){ return id; }
    public String getTitle(){ return title; }
    public String getSubject(){ return subject; }
    public String getTag(){ return tag; }
    public String getTeacher(){ return teacher; }
    public String getSetName(){ return setName; }
    public String getFileHash(){ return fileHash; }
    public String getFileName(){ return fileName; }
    public Long getVotes(){ return votes; }
    public String getCreatedBy(){ return createdBy; }
    public Instant getCreatedAt(){ return createdAt; }
    public void vote(){ votes++; }
}