
package com.tuition.smarttuition.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    private String description;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "batch_id")
    private Batch batch;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @NotBlank
    private String fileName;

    @NotBlank
    private String filePath;

    @NotBlank
    private String fileType;

    private Long fileSize;

    @NotNull
    private LocalDateTime uploadedAt;
}
