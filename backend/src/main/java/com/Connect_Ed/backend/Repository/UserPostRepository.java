package com.Connect_Ed.backend.Repository;

import com.Connect_Ed.backend.Entity.UserPost;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.print.Pageable;
import java.util.Optional;

public interface UserPostRepository extends JpaRepository<UserPost, Long> {
    Optional<UserPost> findByEmail(String email);
}