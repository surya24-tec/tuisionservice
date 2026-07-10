
package com.tuition.smarttuition.controller;

import com.tuition.smarttuition.entity.Teacher;
import com.tuition.smarttuition.service.TeacherService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Teacher> createTeacher(@Valid @RequestBody Teacher teacher) {
        Teacher createdTeacher = teacherService.createTeacher(teacher);
        return ResponseEntity.ok(createdTeacher);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable Long id) {
        Teacher teacher = teacherService.getTeacherById(id);
        return ResponseEntity.ok(teacher);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Teacher> getTeacherByUserId(@PathVariable Long userId) {
        Teacher teacher = teacherService.getTeacherByUserId(userId);
        return ResponseEntity.ok(teacher);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Teacher> updateTeacher(@PathVariable Long id, @Valid @RequestBody Teacher teacherDetails) {
        Teacher updatedTeacher = teacherService.updateTeacher(id, teacherDetails);
        return ResponseEntity.ok(updatedTeacher);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Map<String, Object>> getAllTeachers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) Integer experience) {
        
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Teacher> pageTeachers;
        if (subject != null || experience != null) {
            pageTeachers = teacherService.searchTeachers(subject, experience, pageable);
        } else {
            pageTeachers = teacherService.getAllTeachers(pageable);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("teachers", pageTeachers.getContent());
        response.put("currentPage", pageTeachers.getNumber());
        response.put("totalItems", pageTeachers.getTotalElements());
        response.put("totalPages", pageTeachers.getTotalPages());
        
        return ResponseEntity.ok(response);
    }
}
