package com.BlueFlagGreekBeaches.controller;

import java.util.List;

import com.BlueFlagGreekBeaches.dto.user.AddUserDto;
import com.BlueFlagGreekBeaches.dto.user.AddUserResponseDto;
import com.BlueFlagGreekBeaches.dto.user.DeleteUserDto;
import com.BlueFlagGreekBeaches.dto.user.GetUserDto;
import com.BlueFlagGreekBeaches.dto.user.LoginUserDto;
import com.BlueFlagGreekBeaches.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginUserDto loginUserDto)
    {
        return userService.login(loginUserDto);
    }

    @PostMapping("/add")
    public ResponseEntity<AddUserResponseDto> addUser(@RequestBody AddUserDto addUserDto)
    {
        return userService.addUser(addUserDto);
    }

    @GetMapping("/all")
    public ResponseEntity<List<GetUserDto>> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestBody DeleteUserDto deleteUserDto)
    {
        return userService.deleteUser(deleteUserDto);
    }
}
