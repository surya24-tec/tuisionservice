
package com.tuition.smarttuition.repository;

import com.tuition.smarttuition.entity.StudyMaterial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
    Page<StudyMaterial> findByBatchId(Long batchId, Pageable pageable);
    List<StudyMaterial> findByBatchId(Long batchId);
}
