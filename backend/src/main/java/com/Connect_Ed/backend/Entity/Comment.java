package com.Connect_Ed.backend.Entity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    private LocalDateTime createdAt;

    @ManyToOne
    private UserPost user;

    @ManyToOne
    private Post post;

    @ManyToOne
    private Comment parentComment;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

