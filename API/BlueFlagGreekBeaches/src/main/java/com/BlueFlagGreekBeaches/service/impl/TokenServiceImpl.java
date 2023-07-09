package com.BlueFlagGreekBeaches.service.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.BlueFlagGreekBeaches.entity.User;
import com.BlueFlagGreekBeaches.service.TokenService;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class TokenServiceImpl implements TokenService
{
    private final JwtEncoder encoder;

    public TokenServiceImpl(JwtEncoder encoder) {this.encoder = encoder;}

    @Override
    public String generateToken(User user) {
        List<String> roles = new ArrayList<>();
        roles.add("ROLE_USER");

        Map<String, Object> rolesClaim = new HashMap<>();
        rolesClaim.put("roles", roles);


        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(1, ChronoUnit.HOURS))
                .subject(user.getEmail())
                .claim("roles", rolesClaim)
                .build();
        return this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}