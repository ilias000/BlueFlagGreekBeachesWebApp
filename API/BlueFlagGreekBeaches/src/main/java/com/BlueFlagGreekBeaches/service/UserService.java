package com.BlueFlagGreekBeaches.service;

import java.util.List;

import com.BlueFlagGreekBeaches.dto.AddUserDto;
import com.BlueFlagGreekBeaches.dto.GetUserDto;

public interface UserService
{

    // Adds a new User to the database.
    GetUserDto addUser(AddUserDto addUserDto);

    // Returns a list of all Users in the database.
    List<GetUserDto> getAllUsers();
}
