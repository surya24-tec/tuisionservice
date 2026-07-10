
package com.tuition.smarttuition.repository;

import com.tuition.smarttuition.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Page<Student> findByStudentClassContaining(String studentClass, Pageable pageable);
    Page<Student> findByBatchId(Long batchId, Pageable pageable);
    @Query("SELECT s FROM Student s WHERE " +
           "(:studentClass IS NULL OR " +
           "LOWER(s.studentClass) LIKE LOWER(CONCAT('%', :studentClass, '%')) OR " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :studentClass, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :studentClass, '%'))) AND " +
           "(:batchId IS NULL OR s.batch.id = :batchId)")
    Page<Student> searchStudents(@Param("studentClass") String studentClass, 
                                  @Param("batchId") Long batchId, 
                                  Pageable pageable);
    Optional<Student> findByUserId(Long userId);
    List<Student> findByBatchId(Long batchId);
}
