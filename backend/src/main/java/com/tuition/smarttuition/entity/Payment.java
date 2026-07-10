
package com.tuition.smarttuition.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "fee_id")
    private Fee fee;

    @NotNull
    private BigDecimal amount;

    @NotNull
    private LocalDate paymentDate;

    private String paymentMethod;

    private String transactionId;

    private String receiptNumber;
}
