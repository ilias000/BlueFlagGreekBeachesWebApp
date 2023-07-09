package com.BlueFlagGreekBeaches.service;

import com.BlueFlagGreekBeaches.entity.User;

public interface TokenService
{
    String generateToken(User user);
}
