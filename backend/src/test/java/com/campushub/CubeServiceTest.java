package com.campushub;

import com.campushub.model.*;
import com.campushub.repository.*;
import com.campushub.service.CubeService;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CubeServiceTest {
    @Test
    void creatingRequestLocksSpendableCred() {
        UserRepository users = mock(UserRepository.class);
        ResourceRepository resources = mock(ResourceRepository.class);
        CampusRequestRepository requests = mock(CampusRequestRepository.class);
        CredTransactionRepository transactions = mock(CredTransactionRepository.class);

        User user = new User("demo-atharv", "Atharv");
        user.addSpendable(100);
        when(users.findByExternalId("demo-atharv")).thenReturn(Optional.of(user));
        when(requests.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        CubeService service = new CubeService(users, resources, requests, transactions);
        CampusRequest created = service.createRequest("demo-atharv", "Print notes", "20 pages", 20);

        assertEquals(80, user.getSpendableCred());
        assertEquals(20, created.getBounty());
        verify(transactions).save(argThat(t -> "ESCROW_LOCK".equals(t.getSource()) && t.getSpendableAmount() == -20));
    }
}