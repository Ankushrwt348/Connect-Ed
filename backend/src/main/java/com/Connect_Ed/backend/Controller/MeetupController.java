package com.Connect_Ed.backend.Controller;

import com.Connect_Ed.backend.Entity.DTO.Organizer;
import com.Connect_Ed.backend.Entity.Meetup;
import com.Connect_Ed.backend.Services.MeetupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meetups")
@CrossOrigin(origins = "http://localhost:3000")
public class MeetupController {

    @Autowired
    private MeetupService meetupService;


    @GetMapping
    public List<Meetup> getAllMeetups() {
        return meetupService.getAllMeetups();
    }

    @PostMapping
    public ResponseEntity<Meetup> createMeetup(@RequestBody Meetup meetup) {
        Meetup saved = meetupService.createMeetup(meetup);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}

