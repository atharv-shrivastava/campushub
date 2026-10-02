package com.campushub.controller;

import com.campushub.model.*;
import com.campushub.repository.UserRepository;
import com.campushub.service.ClubEventService;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ClubEventController {
    private final ClubEventService service;
    public ClubEventController(ClubEventService service){this.service=service;}

    @PostMapping("/clubs")
    public Club registerClub(@RequestHeader("X-User-Id") String userId,@RequestBody CreateClub body){
        return service.registerClub(userId,body.name);
    }

    @GetMapping("/clubs/me")
    public Club myClub(@RequestHeader("X-User-Id") String userId){return service.myClub(userId);}

    @GetMapping("/clubs/pending")
    public List<Club> pendingClubs(){return service.pendingClubs();}

    @PostMapping("/clubs/{id}/moderate")
    public Club moderateClub(@RequestHeader("X-Admin-Id") String adminId,@PathVariable long id,@RequestParam boolean approve){
        return service.moderateClub(adminId,id,approve);
    }

    @PostMapping("/events")
    public CampusEvent submitEvent(@RequestHeader("X-User-Id") String userId,@RequestBody CreateEvent body){
        return service.submitEvent(userId,body.title,body.kind,body.venue,Instant.parse(body.startsAt));
    }

    @GetMapping("/events")
    public List<CampusEvent> events(){return service.publishedEvents();}

    @GetMapping("/events/pending")
    public List<CampusEvent> pendingEvents(){return service.pendingEvents();}

    @PostMapping("/events/{id}/moderate")
    public CampusEvent moderateEvent(@RequestHeader("X-Admin-Id") String adminId,@PathVariable long id,@RequestParam boolean approve){
        return service.moderateEvent(adminId,id,approve);
    }

    public record CreateClub(String name){}
    public record CreateEvent(String title,String kind,String venue,String startsAt){}
}