package com.Connect_Ed.backend.Entity;
import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "likes")
@Data
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private UserPost user;

    @ManyToOne
    private Post post;

    private boolean liked;
}

