package com.campushub.repository;

import com.campushub.model.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ClubRepository extends JpaRepository<Club,Long>{
    Optional<Club> findByOwnerExternalId(String ownerExternalId);
    List<Club> findByStatusOrderByNameAsc(String status);
}