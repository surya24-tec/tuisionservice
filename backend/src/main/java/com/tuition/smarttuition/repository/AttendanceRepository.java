
package com.tuition.smarttuition.repository;

import com.tuition.smarttuition.entity.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentIdAndDateBetween(Long studentId, LocalDate startDate, LocalDate endDate);
    Page<Attendance> findByBatchIdAndDate(Long batchId, LocalDate date, Pageable pageable);
    List<Attendance> findByBatchIdAndDate(Long batchId, LocalDate date);
}
