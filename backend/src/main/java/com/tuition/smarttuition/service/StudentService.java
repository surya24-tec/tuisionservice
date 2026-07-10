
package com.tuition.smarttuition.service;

import com.tuition.smarttuition.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StudentService {
    Student createStudent(Student student);
    Student getStudentById(Long id);
    Student updateStudent(Long id, Student studentDetails);
    void deleteStudent(Long id);
    Page<Student> getAllStudents(Pageable pageable);
    Page<Student> searchStudents(String studentClass, Long batchId, Pageable pageable);
    Student getStudentByUserId(Long userId);
}
