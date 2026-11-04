package com.medishare.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import javax.sql.DataSource

@RestController
@RequestMapping("/api")
class HealthController(
    private val dataSource: DataSource
) {

    @GetMapping("/health")
    fun healthCheck(): ResponseEntity<Map<String, Any>> {
        var dbStatus = "UP"
        try {
            dataSource.connection.use { conn ->
                val stmt = conn.createStatement()
                stmt.executeQuery("SELECT 1")
            }
        } catch (e: Exception) {
            dbStatus = "DOWN: ${e.message}"
        }

        return ResponseEntity.ok(
            mapOf(
                "status" to "UP",
                "service" to "MediShare Backend",
                "database" to dbStatus,
                "timestamp" to Instant.now().toString()
            )
        )
    }
}
