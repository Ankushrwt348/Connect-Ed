package com.Connect_Ed.backend.Repository;


import com.Connect_Ed.backend.Entity.DTO.Status;
import com.Connect_Ed.backend.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.id IN :ids")
    List<User> findAllByIdIn(@Param("ids") List<Long> ids);

    @Query("SELECT u FROM User u WHERE u.id <> :userId AND u.id NOT IN :connectedIds")
    List<User> findRecommendedUsers(@Param("userId") Long userId,
                                    @Param("connectedIds") List<Long> connectedIds);

    List<User> findByStatus(Status status);
}
