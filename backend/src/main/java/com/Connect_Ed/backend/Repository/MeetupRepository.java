package com.Connect_Ed.backend.Repository;

import com.Connect_Ed.backend.Entity.Meetup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeetupRepository extends JpaRepository<Meetup, Long> {

    List<Meetup> findByCreatedByEmail(String email);// Optional filtering
}
