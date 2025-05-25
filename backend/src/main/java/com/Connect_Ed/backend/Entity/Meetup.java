package com.Connect_Ed.backend.Entity;

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


    private String createdByName;
    private String createdByEmail;
    private String createdByProfilePic;

}
