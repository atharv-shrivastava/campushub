package com.campushub.config;

import com.campushub.model.Resource;
import com.campushub.model.User;
import com.campushub.repository.ResourceRepository;
import com.campushub.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seed(UserRepository users, ResourceRepository resources) {
        return args -> {
            User demo = users.findByExternalId("demo-atharv").orElseGet(() -> {
                User u = new User("demo-atharv", "Atharv");
                u.addMonthly(72);
                u.addSpendable(148);
                u.addConduct(36);
                return users.save(u);
            });

            if (resources.count() == 0) {
                resources.save(new Resource("OOP in Java — complete notes", "Object Oriented Programming", "Notes",
                        "Dr. Mehta", "A", "seed-oop", "oop-notes.pdf", demo.getExternalId()));
                resources.save(new Resource("DBMS Normalisation Cheat Sheet", "Database Management", "Cheat sheet",
                        "Prof. Shah", "A", "seed-dbms", "dbms-normalisation.pdf", demo.getExternalId()));
                resources.save(new Resource("Data Structures PYQ Pack", "Data Structures", "PYQs",
                        "Dr. Rao", "B", "seed-dsa", "dsa-pyq.pdf", demo.getExternalId()));
            }
        };
    }
}