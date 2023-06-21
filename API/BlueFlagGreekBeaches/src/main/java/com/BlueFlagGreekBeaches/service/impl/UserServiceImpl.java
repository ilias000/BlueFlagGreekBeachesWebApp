package com.BlueFlagGreekBeaches.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import com.BlueFlagGreekBeaches.repository.UserRepository;
import com.BlueFlagGreekBeaches.dto.user.AddUserDto;
import com.BlueFlagGreekBeaches.dto.user.GetUserDto;
import com.BlueFlagGreekBeaches.entity.User;
import com.BlueFlagGreekBeaches.service.UserService;
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
    public GetUserDto addUser(AddUserDto addUserDto)
    {
        User user = new User(addUserDto.email(), addUserDto.password());
        User responseUser = userRepository.save(user);
        return new GetUserDto(responseUser.getEmail());
    }

    // Returns all users from the database.
    @Override
    public List<GetUserDto> getAllUsers()
    {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> new GetUserDto(user.getEmail())).collect(Collectors.toList());
    }
}
