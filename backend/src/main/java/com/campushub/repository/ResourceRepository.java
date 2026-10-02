package com.campushub.repository;

import com.campushub.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    Optional<Resource> findByFileHash(String fileHash);
    List<Resource> findAllByOrderByCreatedAtDesc();
}