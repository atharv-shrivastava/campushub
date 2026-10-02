package com.campushub.config;

import com.campushub.model.CampusEvent;
import com.campushub.model.CampusRequest;
import com.campushub.model.Club;
import com.campushub.model.Resource;
import com.campushub.model.User;
import com.campushub.repository.CampusEventRepository;
import com.campushub.repository.CampusRequestRepository;
import com.campushub.repository.ClubRepository;
import com.campushub.repository.ResourceRepository;
import com.campushub.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seed(
            UserRepository users,
            ResourceRepository resources,
            CampusRequestRepository requests,
            ClubRepository clubs,
            CampusEventRepository events) {
        return args -> {
            User demo = users.findByExternalId("demo-atharv").orElseGet(() -> {
                User u = new User("demo-atharv", "Atharv");
                u.addMonthly(72);
                u.addSpendable(148);
                u.addConduct(36);
                return users.save(u);
            });

            users.findByExternalId("true-admin").orElseGet(() -> {
                User admin = new User("true-admin", "CUBE Admin");
                admin.setRole(User.Role.ADMIN);
                admin.addConduct(100);
                return users.save(admin);
            });

            if (resources.count() == 0) {
                resources.save(new Resource(
                        "OOP in Java — complete notes",
                        "Object Oriented Programming",
                        "Notes",
                        "Dr. Mehta",
                        "A",
                        "seed-oop",
                        "oop-notes.pdf",
                        demo.getExternalId()));

                resources.save(new Resource(
                        "DBMS Normalisation Cheat Sheet",
                        "Database Management",
                        "Cheat sheet",
                        "Prof. Shah",
                        "A",
                        "seed-dbms",
                        "dbms-normalisation.pdf",
                        demo.getExternalId()));

                resources.save(new Resource(
                        "Data Structures PYQ Pack",
                        "Data Structures",
                        "PYQs",
                        "Dr. Rao",
                        "B",
                        "seed-dsa",
                        "dsa-pyq.pdf",
                        demo.getExternalId()));
            }

            if (requests.count() == 0) {
                requests.save(new CampusRequest(
                        "Print 48 pages near Block B",
                        "Need it before 5 PM today.",
                        20,
                        "classmate-001"));

                requests.save(new CampusRequest(
                        "Find the missing CN practical file",
                        "Looking for the practical PDF before tomorrow's lab.",
                        12,
                        "classmate-002"));

                requests.save(new CampusRequest(
                        "Carry a file to the library",
                        "Small envelope. Pickup after 4 PM.",
                        8,
                        "classmate-003"));
            }

            Club club = clubs.findByOwnerExternalId("demo-atharv").orElseGet(() -> {
                Club created = new Club("CUBE Coding Club", "demo-atharv");
                created.approve();
                return clubs.save(created);
            });
            if (!"APPROVED".equals(club.getStatus())) {
                club.approve();
                club = clubs.save(club);
            }

            if (events.count() == 0) {
                CampusEvent hackSprint = new CampusEvent(
                        "HackSprint 4.0",
                        "Hackathon",
                        "Innovation Lab",
                        Instant.parse("2026-10-12T10:00:00Z"),
                        club.getId(),
                        "demo-atharv");
                hackSprint.approve();
                events.save(hackSprint);

                CampusEvent javaAfterHours = new CampusEvent(
                        "Java After Hours",
                        "Workshop",
                        "Seminar Hall",
                        Instant.parse("2026-10-15T15:30:00Z"),
                        club.getId(),
                        "demo-atharv");
                javaAfterHours.approve();
                events.save(javaAfterHours);

                CampusEvent cultural = new CampusEvent(
                        "Cultural Open Mic",
                        "Cultural",
                        "Amphitheatre",
                        Instant.parse("2026-10-18T17:30:00Z"),
                        club.getId(),
                        "demo-atharv");
                cultural.approve();
                events.save(cultural);
            }
        };
    }
}
