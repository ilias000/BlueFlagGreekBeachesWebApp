package com.BlueFlagGreekBeaches.controller;

import java.util.List;

import com.BlueFlagGreekBeaches.dto.user.AddUserDto;
import com.BlueFlagGreekBeaches.dto.user.GetUserDto;
import com.BlueFlagGreekBeaches.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public GetUserDto addUser(@RequestBody AddUserDto addUserDto)
    {
        return userService.addUser(addUserDto);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping(path="/all")
    public List<GetUserDto> getAllUsers() {
        return userService.getAllUsers();
    }
}
