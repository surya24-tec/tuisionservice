
package com.tuition.smarttuition.controller;

import com.tuition.smarttuition.entity.Attendance;
import com.tuition.smarttuition.entity.Fee;
import com.tuition.smarttuition.entity.Mark;
import com.tuition.smarttuition.entity.Student;
import com.tuition.smarttuition.entity.Teacher;
import com.tuition.smarttuition.entity.StudyMaterial;
import com.tuition.smarttuition.repository.AttendanceRepository;
import com.tuition.smarttuition.repository.BatchRepository;
import com.tuition.smarttuition.repository.CourseRepository;
import com.tuition.smarttuition.repository.MarkRepository;
import com.tuition.smarttuition.repository.StudyMaterialRepository;
import com.tuition.smarttuition.repository.StudentRepository;
import com.tuition.smarttuition.repository.TeacherRepository;
import com.tuition.smarttuition.repository.FeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private FeeRepository feeRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MarkRepository markRepository;

    @Autowired
    private StudyMaterialRepository studyMaterialRepository;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminDashboard() {
        List<Fee> fees = feeRepository.findAll();
        long presentCount = attendanceRepository.findAll().stream()
                .filter(Attendance::getPresent)
                .count();
        long attendanceCount = attendanceRepository.count();
        BigDecimal totalFeesCollected = fees.stream()
                .filter(fee -> "PAID".equalsIgnoreCase(fee.getStatus()))
                .map(Fee::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal pendingFees = fees.stream()
                .filter(fee -> !"PAID".equalsIgnoreCase(fee.getStatus()))
                .map(Fee::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalStudents", studentRepository.count());
        dashboard.put("totalTeachers", teacherRepository.count());
        dashboard.put("totalCourses", courseRepository.count());
        dashboard.put("totalBatches", batchRepository.count());
        dashboard.put("totalFeesCollected", totalFeesCollected);
        dashboard.put("pendingFees", pendingFees);
        dashboard.put("attendancePercentage", attendanceCount == 0 ? 0 : Math.round((presentCount * 100.0) / attendanceCount));
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/teacher/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Map<String, Object>> getTeacherDashboard(@PathVariable Long userId) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher not found for user id: " + userId));

        long assignedBatches = batchRepository.findByTeacherId(teacher.getId()).size();
        long studentCount = studentRepository.findAll().stream()
                .filter(student -> student.getBatch() != null
                        && student.getBatch().getTeacher() != null
                        && teacher.getId().equals(student.getBatch().getTeacher().getId()))
                .count();
        long materialsCount = studyMaterialRepository.findAll().stream()
                .filter(material -> material.getTeacher() != null && teacher.getId().equals(material.getTeacher().getId()))
                .count();

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("teacherId", teacher.getId());
        dashboard.put("studentCount", studentCount);
        dashboard.put("classesToday", assignedBatches);
        dashboard.put("testsCreated", 0);
        dashboard.put("avgAttendance", 0);
        dashboard.put("materialsCount", materialsCount);
        dashboard.put("pendingReviews", 0);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/student/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Map<String, Object>> getStudentDashboard(@PathVariable Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found for user id: " + userId));

        List<Attendance> attendanceList = attendanceRepository.findByStudentIdAndDateBetween(
                student.getId(),
                student.getAdmissionDate(),
                java.time.LocalDate.now()
        );
        long presentCount = attendanceList.stream().filter(Attendance::getPresent).count();
        int attendancePercentage = attendanceList.isEmpty()
                ? 0
                : (int) Math.round((presentCount * 100.0) / attendanceList.size());

        List<Mark> marks = markRepository.findByStudentId(student.getId());
        BigDecimal totalMarks = marks.stream()
                .map(Mark::getMarksObtained)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Fee> fees = feeRepository.findByStudentId(student.getId());
        BigDecimal pendingFees = fees.stream()
                .filter(fee -> !"PAID".equalsIgnoreCase(fee.getStatus()))
                .map(Fee::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int materialsCount = 0;
        if (student.getBatch() != null) {
            List<StudyMaterial> materials = studyMaterialRepository.findByBatchId(student.getBatch().getId());
            materialsCount = materials.size();
        }

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("studentId", student.getId());
        dashboard.put("attendance", attendancePercentage);
        dashboard.put("totalMarks", totalMarks);
        dashboard.put("pendingFees", pendingFees);
        dashboard.put("materialsCount", materialsCount);
        dashboard.put("upcomingTests", 0);
        dashboard.put("classesToday", student.getBatch() == null ? 0 : 1);
        return ResponseEntity.ok(dashboard);
    }
}
