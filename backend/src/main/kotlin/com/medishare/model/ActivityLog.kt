package com.medishare.model

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "activity_logs")
data class ActivityLog(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "action", nullable = false, length = 100)
    val action: String = "",

    @Column(name = "performed_by", nullable = false, length = 100)
    val performedBy: String = "",

    @Column(name = "details", columnDefinition = "TEXT")
    val details: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now()
)
