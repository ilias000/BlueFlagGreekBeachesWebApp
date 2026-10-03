package com.BlueFlagGreekBeaches.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.security.KeyPair;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;

class SecurityConfigTests
{
    private final SecurityConfig config = new SecurityConfig();

    private static String tokenFor(JwtEncoder encoder, String subject)
    {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(1, ChronoUnit.HOURS))
                .subject(subject)
                .build();
        return encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    @Test
    void tokenSignedWithTheGeneratedKeyIsAccepted()
    {
        KeyPair keyPair = config.jwtKeyPair();
        String token = tokenFor(config.jwtEncoder(keyPair), "user@example.com");

        assertEquals("user@example.com", config.jwtDecoder(keyPair).decode(token).getSubject());
    }

    @Test
    void everyStartGeneratesANewKeyPair()
    {
        assertNotEquals(config.jwtKeyPair().getPublic(), config.jwtKeyPair().getPublic());
    }

    @Test
    void tokenSignedWithAnotherKeyIsRejected()
    {
        String token = tokenFor(config.jwtEncoder(config.jwtKeyPair()), "user@example.com");
        JwtDecoder decoderWithDifferentKey = config.jwtDecoder(config.jwtKeyPair());

        assertThrows(JwtException.class, () -> decoderWithDifferentKey.decode(token));
    }
}
