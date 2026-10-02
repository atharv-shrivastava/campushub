package com.campushub.repository;

import com.campushub.model.CredTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CredTransactionRepository extends JpaRepository<CredTransaction, Long> {
    List<CredTransaction> findTop20ByUserExternalIdOrderByCreatedAtDesc(String userExternalId);
}