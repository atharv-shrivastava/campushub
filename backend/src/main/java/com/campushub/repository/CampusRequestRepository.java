package com.campushub.repository;

import com.campushub.model.CampusRequest;
import com.campushub.model.RequestState;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.List;

public interface CampusRequestRepository extends JpaRepository<CampusRequest, Long> {
    List<CampusRequest> findAllByOrderByCreatedAtDesc();
    List<CampusRequest> findByStateAndAutoReleaseAtLessThanEqual(RequestState state, Instant time);
}