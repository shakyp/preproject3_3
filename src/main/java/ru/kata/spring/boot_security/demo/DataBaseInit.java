package ru.kata.spring.boot_security.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import javax.annotation.PostConstruct;
import java.util.Set;

@Component
public class DataBaseInit {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public DataBaseInit(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    @Transactional
    public void initializeDatabase() {
        Role adminRole = new Role("ROLE_ADMIN");
        Role userRole = new Role("ROLE_USER");

        roleRepository.save(adminRole);
        roleRepository.save(userRole);

        User userFirst = new User("admin", "admin", 23, "admin@mail.ru", passwordEncoder.encode("admin"), Set.of(adminRole, userRole));
        User userSecond = new User("user", "user", 17, "user@mail.ru", passwordEncoder.encode("user"), Set.of(userRole));

        userRepository.save(userFirst);
        userRepository.save(userSecond);
    }
}
