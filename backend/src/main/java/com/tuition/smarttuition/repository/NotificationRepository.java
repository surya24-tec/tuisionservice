
package com.tuition.smarttuition.repository;

import com.tuition.smarttuition.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByRecipientTypeOrRecipientId(String recipientType, Long recipientId, Pageable pageable);
}
