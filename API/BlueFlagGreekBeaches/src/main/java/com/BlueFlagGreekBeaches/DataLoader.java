package com.BlueFlagGreekBeaches;

import com.BlueFlagGreekBeaches.entity.User;
import com.BlueFlagGreekBeaches.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements ApplicationRunner
{

    private final UserRepository userRepository;

    public DataLoader(UserRepository userRepository) {this.userRepository = userRepository;}

    // Inserts the admin user into the database if it does not exist.
    public void run(ApplicationArguments args) {
        User user = userRepository.findByEmail("admin");
        if(user == null)
        {
            User admin = new User("admin", "admin");
            admin.setIsAdmin(true);
            userRepository.save(admin);
        }
    }
}