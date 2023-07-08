package com.BlueFlagGreekBeaches.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import com.BlueFlagGreekBeaches.dto.user.AddUserResponseDto;
import com.BlueFlagGreekBeaches.repository.UserRepository;
import com.BlueFlagGreekBeaches.dto.user.AddUserDto;
import com.BlueFlagGreekBeaches.dto.user.GetUserDto;
import com.BlueFlagGreekBeaches.entity.User;
import com.BlueFlagGreekBeaches.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService
{
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    // Adds a new user to the database.
    @Override
    public ResponseEntity<AddUserResponseDto> addUser(AddUserDto addUserDto)
    {
        if(userRepository.existsUserByEmail(addUserDto.email()))
        {
            return ResponseEntity.badRequest().body(new AddUserResponseDto(null, "User already exists."));
        }

        User user = new User(addUserDto.email(), addUserDto.password());
        User response = userRepository.save(user);
        GetUserDto getUserDto = new GetUserDto(response.getEmail(), response.getIsAdmin());
        String message = "User with email " + response.getEmail() + " was successfully added.";
        return ResponseEntity.ok().body(new AddUserResponseDto(getUserDto, message));
    }

    // Returns all users from the database.
    @Override
    public ResponseEntity<List<GetUserDto>> getAllUsers()
    {
        List<User> users = userRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(users.stream().map(user -> new GetUserDto(user.getEmail(), user.getIsAdmin())).collect(Collectors.toList()));
    }
}
