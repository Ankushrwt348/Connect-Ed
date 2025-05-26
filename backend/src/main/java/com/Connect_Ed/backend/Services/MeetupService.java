package com.Connect_Ed.backend.Services;

import com.Connect_Ed.backend.Entity.Meetup;
import com.Connect_Ed.backend.Repository.MeetupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MeetupService {
    @Autowired
    private MeetupRepository meetupRepository;

    public List<Meetup> getAllMeetups() {
        return meetupRepository.findAll();
    }

    public List<Meetup> findMeetupsByCreatorEmail(String email) {
        return meetupRepository.findByCreatedByEmail(email);
    }
}

