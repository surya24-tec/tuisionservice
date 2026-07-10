
package com.tuition.smarttuition.service;

import com.tuition.smarttuition.entity.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TeacherService {
    Teacher createTeacher(Teacher teacher);
    Teacher getTeacherById(Long id);
    Teacher updateTeacher(Long id, Teacher teacherDetails);
    void deleteTeacher(Long id);
    Page<Teacher> getAllTeachers(Pageable pageable);
    Page<Teacher> searchTeachers(String subject, Integer experience, Pageable pageable);
    Teacher getTeacherByUserId(Long userId);
}
