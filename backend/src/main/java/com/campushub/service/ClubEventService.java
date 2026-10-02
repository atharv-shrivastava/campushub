package com.campushub.service;

import com.campushub.model.*;
import com.campushub.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ClubEventService {
    private final UserRepository users;
    private final ClubRepository clubs;
    private final CampusEventRepository events;

    public ClubEventService(UserRepository users, ClubRepository clubs, CampusEventRepository events){
        this.users=users;this.clubs=clubs;this.events=events;
    }

    @Transactional
    public Club registerClub(String userId,String name){
        User user=users.findByExternalId(userId).orElseThrow(()->new IllegalStateException("Login first."));
        if(user.getRole()!=User.Role.CLUB) throw new IllegalStateException("Club accounts only.");
        Club club=clubs.findByOwnerExternalId(userId).orElse(new Club(name.trim(),userId));
        return clubs.save(club);
    }

    @Transactional
    public CampusEvent submitEvent(String userId,String title,String kind,String venue,Instant startsAt){
        User user=users.findByExternalId(userId).orElseThrow(()->new IllegalStateException("Login first."));
        if(user.getRole()!=User.Role.CLUB) throw new IllegalStateException("Club account required.");
        Club club=clubs.findByOwnerExternalId(userId).orElseThrow(()->new IllegalStateException("Create a club first."));
        if(!"APPROVED".equals(club.getStatus())) throw new IllegalStateException("Club must be approved before publishing events.");
        return events.save(new CampusEvent(title.trim(),kind.trim(),venue.trim(),startsAt,club.getId(),userId));
    }

    public Club myClub(String userId) { return clubs.findByOwnerExternalId(userId).orElse(null); }

    public List<CampusEvent> publishedEvents(){ return events.findByStatusOrderByStartsAtAsc("PUBLISHED"); }
    public List<CampusEvent> pendingEvents(){ return events.findByStatusOrderByStartsAtAsc("PENDING"); }

    @Transactional
    public CampusEvent moderateEvent(String adminId,long eventId,boolean approve){
        if(!"true-admin".equals(adminId)) throw new IllegalStateException("Admin access required.");
        CampusEvent event=events.findById(eventId).orElseThrow(()->new IllegalArgumentException("Event not found."));
        if(approve) event.approve(); else event.reject();
        return events.save(event);
    }

    @Transactional
    public Club moderateClub(String adminId,long clubId,boolean approve){
        if(!"true-admin".equals(adminId)) throw new IllegalStateException("Admin access required.");
        Club club=clubs.findById(clubId).orElseThrow(()->new IllegalArgumentException("Club not found."));
        if(approve) club.approve(); else club.reject();
        return clubs.save(club);
    }

    public List<Club> pendingClubs(){ return clubs.findByStatusOrderByNameAsc("PENDING"); }
}