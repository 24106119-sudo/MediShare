package com.medishare.controller

import com.medishare.dto.DonationCreateRequest
import com.medishare.dto.DonationResponseDTO
import com.medishare.dto.DonationStatusUpdateRequest
import com.medishare.dto.MessageResponse
import com.medishare.service.AuthService
import com.medishare.service.DonationService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/donations")
class DonationController(
    private val donationService: DonationService,
    private val authService: AuthService
) {

    @PostMapping
    fun createDonation(@Valid @RequestBody req: DonationCreateRequest): ResponseEntity<DonationResponseDTO> {
        val currentUser = authService.getCurrentUser()
        val created = donationService.createDonation(currentUser, req)
        return ResponseEntity.status(HttpStatus.CREATED).body(created)
    }

    @GetMapping("/my")
    fun getMyDonations(): ResponseEntity<List<DonationResponseDTO>> {
        val currentUser = authService.getCurrentUser()
        val list = donationService.getDonationsByDonor(currentUser)
        return ResponseEntity.ok(list)
    }

    @GetMapping("/available")
    fun getAvailableDonations(): ResponseEntity<List<DonationResponseDTO>> {
        val list = donationService.getAvailableDonations()
        return ResponseEntity.ok(list)
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    fun getAllDonations(): ResponseEntity<List<DonationResponseDTO>> {
        val list = donationService.getAllDonations()
        return ResponseEntity.ok(list)
    }

    @GetMapping("/{id}")
    fun getDonationById(@PathVariable id: Long): ResponseEntity<DonationResponseDTO> {
        val donation = donationService.getDonationById(id)
        return ResponseEntity.ok(donation)
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    fun updateStatus(
        @PathVariable id: Long,
        @RequestBody req: DonationStatusUpdateRequest
    ): ResponseEntity<DonationResponseDTO> {
        val currentUser = authService.getCurrentUser()
        val updated = donationService.updateStatus(id, req, currentUser.email)
        return ResponseEntity.ok(updated)
    }

    @DeleteMapping("/{id}")
    fun deleteDonation(@PathVariable id: Long): ResponseEntity<MessageResponse> {
        val currentUser = authService.getCurrentUser()
        donationService.deleteDonation(id, currentUser)
        return ResponseEntity.ok(MessageResponse("Donation deleted successfully"))
    }
}
