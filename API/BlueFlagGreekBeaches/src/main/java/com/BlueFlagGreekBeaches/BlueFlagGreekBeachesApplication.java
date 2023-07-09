package com.BlueFlagGreekBeaches;

import com.BlueFlagGreekBeaches.config.RsaKeyProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import java.util.Properties;

@SpringBootApplication
@EnableConfigurationProperties(RsaKeyProperties.class)
public class BlueFlagGreekBeachesApplication {

	public static void main(String[] args) {
		SpringApplication.run(BlueFlagGreekBeachesApplication.class, args);
	}
	@Bean
	public JavaMailSender javaMailSender() {
		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setHost("smtp.gmail.com");
		mailSender.setPort(587);
		mailSender.setUsername("katrinbnt@gmail.com");
		mailSender.setPassword("pylbescovxsawyut");
		Properties props = mailSender.getJavaMailProperties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		return mailSender;
	}

}
