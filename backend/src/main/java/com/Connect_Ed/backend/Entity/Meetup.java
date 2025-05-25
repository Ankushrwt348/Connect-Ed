package com.Connect_Ed.backend.Entity;

import com.Connect_Ed.backend.Entity.DTO.Organizer;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Meetup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String date;

    @Column(name = "title")
    private String title;
    private String description;
    private String location;

    @Embedded
    private Organizer organizer;
}
