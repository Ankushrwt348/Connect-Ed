package com.Connect_Ed.backend.Entity;

import com.Connect_Ed.backend.Entity.DTO.Role;
import com.Connect_Ed.backend.Entity.DTO.Status;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true)
    private String email;

    private String password;


    @Enumerated(EnumType.STRING)
    private Role role = Role.STUDENT;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING_APPROVAL;

    @JsonProperty("profileImage")
    private String profilePic;  // URL or path to profile image

    // connections where this user is connected with others
    @ManyToMany
    @JoinTable(
            name = "connections",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "connected_user_id")
    )
    private Set<User> connections = new HashSet<>();


}
