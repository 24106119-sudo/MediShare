package com.medishare.controller

import com.medishare.dto.AdminDashboardDTO
import com.medishare.dto.BeneficiaryDashboardDTO
import com.medishare.dto.DonorDashboardDTO
import com.medishare.service.AuthService
import com.medishare.service.DashboardService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/dashboard")
class DashboardController(
    private val dashboardService: DashboardService,
    private val authService: AuthService
) {

    @GetMapping("/donor")
    @PreAuthorize("hasAnyAuthority('ROLE_DONOR', 'ROLE_ADMIN')")
    fun getDonorDashboard(): ResponseEntity<DonorDashboardDTO> {
        val currentUser = authService.getCurrentUser()
        val stats = dashboardService.getDonorDashboard(currentUser)
        return ResponseEntity.ok(stats)
    }

    @GetMapping("/beneficiary")
    @PreAuthorize("hasAnyAuthority('ROLE_BENEFICIARY', 'ROLE_NGO', 'ROLE_ADMIN')")
    fun getBeneficiaryDashboard(): ResponseEntity<BeneficiaryDashboardDTO> {
        val currentUser = authService.getCurrentUser()
        val stats = dashboardService.getBeneficiaryDashboard(currentUser)
        return ResponseEntity.ok(stats)
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    fun getAdminDashboard(): ResponseEntity<AdminDashboardDTO> {
        val stats = dashboardService.getAdminDashboard()
        return ResponseEntity.ok(stats)
    }
}
