package com.Connect_Ed.backend.Entity.DTO;

import com.Connect_Ed.backend.Entity.User;
import lombok.Data;

@Data
public class UserNetworkDto {
    private Long id;
    private String name;
    private String role;
    private String profilePic;

    public static UserNetworkDto fromEntity(User user) {
        UserNetworkDto dto = new UserNetworkDto();
        dto.setId(user.getId());
        dto.setName(user.getFullName());
        dto.setRole(user.getRole().name());
        dto.setProfilePic(user.getProfilePic());
        return dto;
    }
}
