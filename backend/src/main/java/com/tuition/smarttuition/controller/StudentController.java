
package com.tuition.smarttuition.controller;

import com.tuition.smarttuition.entity.Student;
import com.tuition.smarttuition.service.StudentService;
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
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        Student createdStudent = studentService.createStudent(student);
        return ResponseEntity.ok(createdStudent);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Student> getStudentByUserId(@PathVariable Long userId) {
        Student student = studentService.getStudentByUserId(userId);
        return ResponseEntity.ok(student);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @Valid @RequestBody Student studentDetails) {
        Student updatedStudent = studentService.updateStudent(id, studentDetails);
        return ResponseEntity.ok(updatedStudent);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Map<String, Boolean>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Map<String, Object>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String studentClass,
            @RequestParam(required = false) String className,
            @RequestParam(required = false) Long batchId,
            @RequestParam(required = false) String batch) {

        String resolvedStudentClass = studentClass != null ? studentClass : className;
        
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Student> pageStudents;
        if (search != null && !search.isBlank()) {
            pageStudents = studentService.searchStudents(search, batchId, pageable);
        } else if (resolvedStudentClass != null || batchId != null) {
            pageStudents = studentService.searchStudents(resolvedStudentClass, batchId, pageable);
        } else {
            pageStudents = studentService.getAllStudents(pageable);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("students", pageStudents.getContent());
        response.put("content", pageStudents.getContent());
        response.put("currentPage", pageStudents.getNumber());
        response.put("totalItems", pageStudents.getTotalElements());
        response.put("totalElements", pageStudents.getTotalElements());
        response.put("totalPages", pageStudents.getTotalPages());
        
        return ResponseEntity.ok(response);
    }
}
