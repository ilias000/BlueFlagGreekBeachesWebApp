package com.BlueFlagGreekBeaches.controller;

import java.util.List;

import com.BlueFlagGreekBeaches.dto.user.AddUserDto;
import com.BlueFlagGreekBeaches.dto.user.AddUserResponseDto;
import com.BlueFlagGreekBeaches.dto.user.GetUserDto;
import com.BlueFlagGreekBeaches.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController
{
    private final UserService userService;

    public UserController(UserService userService)
    {
        this.userService = userService;
    }

    @PostMapping("/add")
    public ResponseEntity<AddUserResponseDto> addUser(@RequestBody AddUserDto addUserDto)
    {
        return userService.addUser(addUserDto);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping(path="/all")
    public ResponseEntity<List<GetUserDto>> getAllUsers() {
        return userService.getAllUsers();
    }
}
