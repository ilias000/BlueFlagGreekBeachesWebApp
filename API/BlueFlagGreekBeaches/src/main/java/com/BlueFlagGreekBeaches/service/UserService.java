package com.BlueFlagGreekBeaches.service;

import java.util.List;

import com.BlueFlagGreekBeaches.dto.user.AddUserDto;
import com.BlueFlagGreekBeaches.dto.user.AddUserResponseDto;
import com.BlueFlagGreekBeaches.dto.user.GetUserDto;
import org.springframework.http.ResponseEntity;

public interface UserService
{

    // Adds a new User to the database.
    ResponseEntity<AddUserResponseDto> addUser(AddUserDto addUserDto);

    // Returns a list of all Users in the database.
    ResponseEntity<List<GetUserDto>> getAllUsers();
}
