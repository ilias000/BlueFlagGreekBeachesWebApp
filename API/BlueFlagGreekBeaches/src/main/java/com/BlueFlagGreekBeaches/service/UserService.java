package com.BlueFlagGreekBeaches.service;

import java.util.List;
import java.util.stream.Collectors;

import com.BlueFlagGreekBeaches.dao.UserRepository;
import com.BlueFlagGreekBeaches.dto.AddUserDto;
import com.BlueFlagGreekBeaches.dto.GetUserDto;
import com.BlueFlagGreekBeaches.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserService
{
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    public void addUser(AddUserDto addUserDto)
    {
        User user = new User(addUserDto.email(), addUserDto.password());
        userRepository.save(user);
    }

    public List<GetUserDto> getAllUsers()
    {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> new GetUserDto(user.getEmail())).collect(Collectors.toList());
    }
}
