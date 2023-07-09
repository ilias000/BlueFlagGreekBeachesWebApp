package com.BlueFlagGreekBeaches;

import com.BlueFlagGreekBeaches.entity.User;
import com.BlueFlagGreekBeaches.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements ApplicationRunner
{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Inserts the admin user into the database if it does not exist.
    public void run(ApplicationArguments args) {
        User user = userRepository.findByEmail("admin");
        if(user == null)
        {
            String password = passwordEncoder.encode("admin");

            User admin = new User("admin", password);
            admin.setIsAdmin(true);
            userRepository.save(admin);
        }
    }
}