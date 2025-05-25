package com.Connect_Ed.backend.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "app_users")
@Data
public class AppUser {

    @Id
    private String email;

    private String name;
    private String pictureUrl;


}
