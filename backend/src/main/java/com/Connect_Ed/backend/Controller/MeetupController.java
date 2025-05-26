package com.Connect_Ed.backend.Controller;

import com.Connect_Ed.backend.Entity.Meetup;
import com.Connect_Ed.backend.Entity.User;
import com.Connect_Ed.backend.Repository.MeetupRepository;
import com.Connect_Ed.backend.Services.MeetupService;
import com.Connect_Ed.backend.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/meetups")
@CrossOrigin(origins = "http://localhost:3000")
public class MeetupController {

    @Autowired
    private MeetupService meetupService;

    @Autowired
    private MeetupRepository meetupRepository;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<Meetup> getAllMeetups() {
        List<Meetup> all = meetupService.getAllMeetups();
        System.out.println("Fetched meetups: " + all.size());
        return all;
    }



    @PostMapping
    public ResponseEntity<Meetup> createMeetup(@RequestBody Meetup meetup,
                                               @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String userEmail = principal.getAttribute("email");

        Optional<User> userOptional = userService.findByEmail(userEmail);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userOptional.get();

        meetup.setCreatedByName(user.getFullName());
        meetup.setCreatedByEmail(user.getEmail());
        meetup.setCreatedByProfilePic(user.getProfilePic());

        Meetup savedMeetup = meetupRepository.save(meetup);
        return ResponseEntity.ok(savedMeetup);
    }
    @GetMapping("/mine")
    public ResponseEntity<?> getMyMeetups(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        String userEmail = principal.getAttribute("email");

        List<Meetup> myMeetups = meetupService.findMeetupsByCreatorEmail(userEmail);

        return ResponseEntity.ok(myMeetups);
    }
}
