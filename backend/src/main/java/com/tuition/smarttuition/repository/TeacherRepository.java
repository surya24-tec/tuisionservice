
package com.tuition.smarttuition.repository;

import com.tuition.smarttuition.entity.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Page<Teacher> findByTeachingSubjectContaining(String subject, Pageable pageable);
    Page<Teacher> findByExperienceGreaterThanEqual(Integer experience, Pageable pageable);
    @Query("SELECT t FROM Teacher t WHERE " +
           "(:subject IS NULL OR t.teachingSubject LIKE %:subject%) AND " +
           "(:experience IS NULL OR t.experience >= :experience)")
    Page<Teacher> searchTeachers(@Param("subject") String subject, 
                                  @Param("experience") Integer experience, 
                                  Pageable pageable);
    Optional<Teacher> findByUserId(Long userId);
}
