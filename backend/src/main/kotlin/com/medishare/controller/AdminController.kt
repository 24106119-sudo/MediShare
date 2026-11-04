package com.medishare.controller

import com.medishare.dto.ActivityLogDTO
import com.medishare.dto.DonationResponseDTO
import com.medishare.dto.UserDTO
import com.medishare.service.AdminService
import com.medishare.service.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
class AdminController(
    private val adminService: AdminService,
    private val authService: AuthService
) {

    @GetMapping("/users")
    fun getAllUsers(): ResponseEntity<List<UserDTO>> {
        val users = adminService.getAllUsers()
        return ResponseEntity.ok(users)
    }

    @PatchMapping("/users/{id}/verify")
    fun verifyNgo(
        @PathVariable id: Long,
        @RequestParam verified: Boolean
    ): ResponseEntity<UserDTO> {
        val currentUser = authService.getCurrentUser()
        val user = adminService.verifyNgo(id, verified, currentUser.email)
        return ResponseEntity.ok(user)
    }

    @GetMapping("/expired-medicines")
    fun getExpiredMedicines(): ResponseEntity<List<DonationResponseDTO>> {
        val list = adminService.getExpiredMedicines()
        return ResponseEntity.ok(list)
    }

    @GetMapping("/logs")
    fun getActivityLogs(): ResponseEntity<List<ActivityLogDTO>> {
        val logs = adminService.getActivityLogs()
        return ResponseEntity.ok(logs)
    }
}
