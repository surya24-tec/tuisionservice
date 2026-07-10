
package com.tuition.smarttuition.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @NotNull
    private BigDecimal amount;

    @NotNull
    private LocalDate dueDate;

    private String status; // PAID, PENDING, OVERDUE

    private String description;
}
