
package com.tuition.smarttuition.repository;

import com.tuition.smarttuition.entity.Fee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {
    Page<Fee> findByStudentId(Long studentId, Pageable pageable);
    List<Fee> findByStudentId(Long studentId);
    List<Fee> findByStatus(String status);
}
