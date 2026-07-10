
package com.tuition.smarttuition.controller;

import com.tuition.smarttuition.dto.JwtResponse;
import com.tuition.smarttuition.dto.LoginRequest;
import com.tuition.smarttuition.dto.MessageResponse;
import com.tuition.smarttuition.dto.SignupRequest;
import com.tuition.smarttuition.entity.ERole;
import com.tuition.smarttuition.entity.Role;
import com.tuition.smarttuition.entity.Student;
import com.tuition.smarttuition.entity.Teacher;
import com.tuition.smarttuition.entity.User;
import com.tuition.smarttuition.repository.RoleRepository;
import com.tuition.smarttuition.repository.StudentRepository;
import com.tuition.smarttuition.repository.TeacherRepository;
import com.tuition.smarttuition.repository.UserRepository;
import com.tuition.smarttuition.security.JwtUtils;
import com.tuition.smarttuition.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    TeacherRepository teacherRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                "Bearer",
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getName(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getName(),
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getMobileNumber());

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            roles.add(resolveRole(ERole.ROLE_STUDENT));
        } else {
            strRoles.forEach(role -> roles.add(resolveRole(parseRole(role))));
        }

        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        if (roles.stream().anyMatch(role -> role.getName() == ERole.ROLE_TEACHER)) {
            createTeacherProfile(savedUser);
        }

        if (roles.stream().anyMatch(role -> role.getName() == ERole.ROLE_STUDENT)) {
            createStudentProfile(savedUser);
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    private ERole parseRole(String rawRole) {
        if (rawRole == null || rawRole.isBlank()) {
            return ERole.ROLE_STUDENT;
        }

        String normalizedRole = rawRole.trim().toUpperCase(Locale.ROOT);
        if (!normalizedRole.startsWith("ROLE_")) {
            normalizedRole = "ROLE_" + normalizedRole;
        }

        try {
            return ERole.valueOf(normalizedRole);
        } catch (IllegalArgumentException ex) {
            return ERole.ROLE_STUDENT;
        }
    }

    private Role resolveRole(ERole roleName) {
        return roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
    }

    private void createTeacherProfile(User user) {
        if (teacherRepository.findByUserId(user.getId()).isPresent()) {
            return;
        }

        Teacher teacher = new Teacher();
        teacher.setName(user.getName());
        teacher.setEmail(user.getEmail());
        teacher.setMobileNumber(user.getMobileNumber());
        teacher.setTeachingSubject("Not Assigned");
        teacher.setExperience(0);
        teacher.setSalary(BigDecimal.ZERO);
        teacher.setAddress("");
        teacher.setJoiningDate(LocalDate.now());
        teacher.setStatus("Active");
        teacher.setUser(user);
        teacherRepository.save(teacher);
    }

    private void createStudentProfile(User user) {
        if (studentRepository.findByUserId(user.getId()).isPresent()) {
            return;
        }

        Student student = new Student();
        student.setName(user.getName());
        student.setStudentClass("Not Assigned");
        student.setParentName(user.getName());
        student.setParentMobileNumber(user.getMobileNumber());
        student.setEmail(user.getEmail());
        student.setAddress("");
        student.setAdmissionDate(LocalDate.now());
        student.setStatus("Active");
        student.setUser(user);
        studentRepository.save(student);
    }
}
