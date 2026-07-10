
package com.tuition.smarttuition.repository;

import com.tuition.smarttuition.entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {
    List<Batch> findByTeacherId(Long teacherId);
}
