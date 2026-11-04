package com.medishare.controller

import com.medishare.dto.RequestCreateRequest
import com.medishare.dto.RequestResponseDTO
import com.medishare.dto.RequestStatusUpdateRequest
import com.medishare.service.AuthService
import com.medishare.service.RequestService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/requests")
class RequestController(
    private val requestService: RequestService,
    private val authService: AuthService
) {

    @PostMapping
    fun createRequest(@Valid @RequestBody req: RequestCreateRequest): ResponseEntity<RequestResponseDTO> {
        val currentUser = authService.getCurrentUser()
        val created = requestService.createRequest(currentUser, req)
        return ResponseEntity.status(HttpStatus.CREATED).body(created)
    }

    @GetMapping("/my")
    fun getMyRequests(): ResponseEntity<List<RequestResponseDTO>> {
        val currentUser = authService.getCurrentUser()
        val list = requestService.getRequestsByBeneficiary(currentUser)
        return ResponseEntity.ok(list)
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    fun getAllRequests(): ResponseEntity<List<RequestResponseDTO>> {
        val list = requestService.getAllRequests()
        return ResponseEntity.ok(list)
    }

    @GetMapping("/{id}")
    fun getRequestById(@PathVariable id: Long): ResponseEntity<RequestResponseDTO> {
        val req = requestService.getRequestById(id)
        return ResponseEntity.ok(req)
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    fun updateStatus(
        @PathVariable id: Long,
        @RequestBody req: RequestStatusUpdateRequest
    ): ResponseEntity<RequestResponseDTO> {
        val currentUser = authService.getCurrentUser()
        val updated = requestService.updateStatus(id, req, currentUser.email)
        return ResponseEntity.ok(updated)
    }
}
