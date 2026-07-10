
package com.tuition.smarttuition.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "marks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "batch_id")
    private Batch batch;

    @NotNull
    private String testName;

    @NotNull
    private BigDecimal marksObtained;

    @NotNull
    private BigDecimal totalMarks;

    @NotNull
    private LocalDate testDate;

    private String grade;

    private String remarks;
}
