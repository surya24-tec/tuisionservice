
package com.tuition.smarttuition.service.impl;

import com.tuition.smarttuition.entity.Teacher;
import com.tuition.smarttuition.exception.ResourceNotFoundException;
import com.tuition.smarttuition.repository.TeacherRepository;
import com.tuition.smarttuition.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Override
    public Teacher createTeacher(Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    @Override
    public Teacher getTeacherById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
    }

    @Override
    public Teacher updateTeacher(Long id, Teacher teacherDetails) {
        Teacher teacher = getTeacherById(id);
        teacher.setName(teacherDetails.getName());
        teacher.setEmail(teacherDetails.getEmail());
        teacher.setMobileNumber(teacherDetails.getMobileNumber());
        teacher.setTeachingSubject(teacherDetails.getTeachingSubject());
        teacher.setExperience(teacherDetails.getExperience());
        teacher.setSalary(teacherDetails.getSalary());
        teacher.setAddress(teacherDetails.getAddress());
        teacher.setJoiningDate(teacherDetails.getJoiningDate());
        teacher.setStatus(teacherDetails.getStatus());
        return teacherRepository.save(teacher);
    }

    @Override
    public void deleteTeacher(Long id) {
        Teacher teacher = getTeacherById(id);
        teacherRepository.delete(teacher);
    }

    @Override
    public Page<Teacher> getAllTeachers(Pageable pageable) {
        return teacherRepository.findAll(pageable);
    }

    @Override
    public Page<Teacher> searchTeachers(String subject, Integer experience, Pageable pageable) {
        return teacherRepository.searchTeachers(subject, experience, pageable);
    }

    @Override
    public Teacher getTeacherByUserId(Long userId) {
        return teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found for user id: " + userId));
    }
}
