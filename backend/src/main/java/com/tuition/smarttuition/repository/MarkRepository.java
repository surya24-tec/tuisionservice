
package com.tuition.smarttuition.repository;

import com.tuition.smarttuition.entity.Mark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarkRepository extends JpaRepository<Mark, Long> {
    Page<Mark> findByStudentId(Long studentId, Pageable pageable);
    List<Mark> findByStudentId(Long studentId);
    Page<Mark> findByBatchId(Long batchId, Pageable pageable);
}
