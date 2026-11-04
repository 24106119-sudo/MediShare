package com.medishare.repository

import com.medishare.model.ActivityLog
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ActivityLogRepository : JpaRepository<ActivityLog, Long> {
    fun findTop15ByOrderByCreatedAtDesc(): List<ActivityLog>
}
