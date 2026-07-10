
package com.tuition.smarttuition.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "teachers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    @Column(unique = true)
    private String email;

    @NotBlank
    private String mobileNumber;

    @NotBlank
    private String teachingSubject;

    private Integer experience;

    @NotNull
    private BigDecimal salary;

    private String address;

    @NotNull
    private LocalDate joiningDate;

    private String status;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
