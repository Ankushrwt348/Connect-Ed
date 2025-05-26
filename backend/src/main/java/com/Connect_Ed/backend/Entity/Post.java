package com.Connect_Ed.backend.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    private String imageUrl;

    private LocalDateTime createdAt;

    private String createdByEmail;


    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonManagedReference
    private UserPost user;


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
