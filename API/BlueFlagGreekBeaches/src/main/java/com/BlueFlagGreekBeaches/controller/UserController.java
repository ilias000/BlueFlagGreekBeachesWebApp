package com.BlueFlagGreekBeaches.controller;

import java.util.List;

import com.BlueFlagGreekBeaches.dto.AddUserDto;
import com.BlueFlagGreekBeaches.dto.GetUserDto;
import com.BlueFlagGreekBeaches.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/user")
public class UserController
{
    private final UserService userService;

    public UserController(UserService userService)
    {
        this.userService = userService;
    }

    @PostMapping("/add")
    public void addUser(@RequestBody AddUserDto addUserDto)
    {
        userService.addUser(addUserDto);
    }

    @GetMapping(path="/all")
    public List<GetUserDto> getAllUsers() {
        return userService.getAllUsers();
    }
}
