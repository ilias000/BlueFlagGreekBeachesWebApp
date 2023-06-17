package com.BlueFlagGreekBeaches.service;

import java.util.List;
import java.util.stream.Collectors;

import com.BlueFlagGreekBeaches.repository.UserRepository;
import com.BlueFlagGreekBeaches.dto.AddUserDto;
import com.BlueFlagGreekBeaches.dto.GetUserDto;
import com.BlueFlagGreekBeaches.entity.User;
import org.springframework.stereotype.Service;

@Service
public class UserService
{
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    public GetUserDto addUser(AddUserDto addUserDto)
    {
        User user = new User(addUserDto.email(), addUserDto.password());
        User responseUser = userRepository.save(user);
        return new GetUserDto(responseUser.getEmail());
    }

    public List<GetUserDto> getAllUsers()
    {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> new GetUserDto(user.getEmail())).collect(Collectors.toList());
    }
}
