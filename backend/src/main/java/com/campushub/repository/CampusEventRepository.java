package com.campushub.repository;

import com.campushub.model.CampusEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CampusEventRepository extends JpaRepository<CampusEvent,Long>{
    List<CampusEvent> findByStatusOrderByStartsAtAsc(String status);
    List<CampusEvent> findAllByOrderByStartsAtAsc();
}