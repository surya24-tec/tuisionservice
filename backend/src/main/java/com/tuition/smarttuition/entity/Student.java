
package com.tuition.smarttuition.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String studentClass;

    @NotBlank
    private String parentName;

    @NotBlank
    private String parentMobileNumber;

    @NotBlank
    @Column(unique = true)
    private String email;

    private String address;

    @ManyToOne
    @JoinColumn(name = "batch_id")
    private Batch batch;

    @NotNull
    private LocalDate admissionDate;

    private String status;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
