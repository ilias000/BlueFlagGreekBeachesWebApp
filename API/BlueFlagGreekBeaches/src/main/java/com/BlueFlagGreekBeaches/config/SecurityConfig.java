package com.BlueFlagGreekBeaches.config;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * RSA key pair used to sign and verify the JWTs.
     * It is generated in memory every time the application starts, so no private key is ever stored in the repository.
     * Consequence: tokens issued before a restart stop being valid and users log in again.
     * A deployment with several instances, or one that must keep tokens across restarts, should instead load the key pair
     * from a secret store (for example an environment variable or a mounted secret).
     */
    @Bean
    KeyPair jwtKeyPair() {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            return generator.generateKeyPair();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("RSA is not available in this JVM", e);
        }
    }

    @Bean
    JwtDecoder jwtDecoder(KeyPair jwtKeyPair) {
        return NimbusJwtDecoder.withPublicKey((RSAPublicKey) jwtKeyPair.getPublic()).build();
    }

    @Bean
    JwtEncoder jwtEncoder(KeyPair jwtKeyPair) {
        JWK jwk = new RSAKey.Builder((RSAPublicKey) jwtKeyPair.getPublic())
                .privateKey((RSAPrivateKey) jwtKeyPair.getPrivate())
                .build();
        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception
    {
        return http
                .csrf().disable() // Disable Cross-Site Request Forgery (CSRF).
                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/**").permitAll()
                        // .requestMatchers("/poi/search").permitAll()
                        // .requestMatchers("/category/all").permitAll()
                        // .requestMatchers("/user/login").permitAll()
                        // .requestMatchers("/user/add").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Spring Security will never create an HttpSession, and it will never use it to obtain the Security Context.
                .httpBasic(Customizer.withDefaults())
                .build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
