package com.BlueFlagGreekBeaches.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import com.BlueFlagGreekBeaches.dto.user.AddUserResponseDto;
import com.BlueFlagGreekBeaches.dto.user.DeleteUserDto;
import com.BlueFlagGreekBeaches.entity.SaveSearch;
import com.BlueFlagGreekBeaches.repository.SaveSearchRepository;
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
    private final SaveSearchRepository saveSearchRepository;

    public UserServiceImpl(UserRepository userRepository, SaveSearchRepository saveSearchRepository)
    {
        this.userRepository = userRepository;
        this.saveSearchRepository = saveSearchRepository;
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

    // Deletes a user from the database.
    @Override
    public ResponseEntity<String> deleteUser(DeleteUserDto deleteUserDto)
    {
        User user = userRepository.findByEmail(deleteUserDto.email());

        if(user == null)
        {
            return ResponseEntity.badRequest().body("User with email " + deleteUserDto.email() + " does not exist.");
        }

        if(user.getIsAdmin())
        {
            return ResponseEntity.badRequest().body("Ths user is an admin and cannot be deleted.");
        }

        // Delete the user from all his save searches. If no other user has this search saved delete the saveSearch
        for(SaveSearch saveSearch : user.getSaveSearches())
        {
            List<User> users = saveSearch.getUsers();
            users.remove(user);
            if(users.isEmpty())
            {
                saveSearchRepository.delete(saveSearch);
            }
            else
            {
                saveSearch.setUsers(users);
                saveSearchRepository.save(saveSearch);
            }
        }
        userRepository.delete(user);
        return ResponseEntity.ok().body("User with email " + deleteUserDto.email() + " was successfully deleted.");
    }
}
