
package com.tuition.smarttuition.service.impl;

import com.tuition.smarttuition.entity.Student;
import com.tuition.smarttuition.exception.ResourceNotFoundException;
import com.tuition.smarttuition.repository.StudentRepository;
import com.tuition.smarttuition.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    @Override
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    @Override
    public Student updateStudent(Long id, Student studentDetails) {
        Student student = getStudentById(id);
        student.setName(studentDetails.getName());
        student.setStudentClass(studentDetails.getStudentClass());
        student.setParentName(studentDetails.getParentName());
        student.setParentMobileNumber(studentDetails.getParentMobileNumber());
        student.setEmail(studentDetails.getEmail());
        student.setAddress(studentDetails.getAddress());
        student.setBatch(studentDetails.getBatch());
        student.setAdmissionDate(studentDetails.getAdmissionDate());
        student.setStatus(studentDetails.getStatus());
        return studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
    }

    @Override
    public Page<Student> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    @Override
    public Page<Student> searchStudents(String studentClass, Long batchId, Pageable pageable) {
        return studentRepository.searchStudents(studentClass, batchId, pageable);
    }

    @Override
    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user id: " + userId));
    }
}
