package com.BlueFlagGreekBeaches.service;

import java.util.List;

import com.BlueFlagGreekBeaches.dto.user.AddUserDto;
import com.BlueFlagGreekBeaches.dto.user.AddUserResponseDto;
import com.BlueFlagGreekBeaches.dto.user.DeleteUserDto;
import com.BlueFlagGreekBeaches.dto.user.GetUserDto;
import com.BlueFlagGreekBeaches.dto.user.LoginUserDto;
import org.springframework.http.ResponseEntity;

public interface UserService
{

    // Returns a JWT token if the credentials are valid.
    ResponseEntity<String> login(LoginUserDto loginUserDto);

    // Adds a new User to the database.
    ResponseEntity<AddUserResponseDto> addUser(AddUserDto addUserDto);

    // Returns a list of all Users in the database.
    ResponseEntity<List<GetUserDto>> getAllUsers();

    // Deletes a User from the database.
    ResponseEntity<String> deleteUser(DeleteUserDto deleteUserDto);
}
