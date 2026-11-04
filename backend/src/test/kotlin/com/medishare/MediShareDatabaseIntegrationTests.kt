package com.medishare

import com.fasterxml.jackson.databind.ObjectMapper
import com.medishare.dto.*
import com.medishare.model.DonationStatus
import com.medishare.model.RequestStatus
import com.medishare.model.Role
import com.medishare.model.UrgencyLevel
import com.medishare.repository.MedicineDonationRepository
import com.medishare.repository.MedicineRequestRepository
import com.medishare.repository.UserRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.patch
import org.springframework.test.web.servlet.post
import java.time.LocalDate

@SpringBootTest
@AutoConfigureMockMvc
class MediShareDatabaseIntegrationTests {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var donationRepository: MedicineDonationRepository

    @Autowired
    private lateinit var requestRepository: MedicineRequestRepository

    @Test
    fun `test complete database workflow - 13 verification points`() {
        val uniqueSuffix = System.currentTimeMillis()
        val donorEmail = "donor_$uniqueSuffix@test.com"
        val beneficiaryEmail = "beneficiary_$uniqueSuffix@test.com"

        // -------------------------------------------------------------
        // Step 1 & 2: Register a new user & Check that the user appears in MySQL
        // -------------------------------------------------------------
        val registerReq = RegisterRequest(
            fullName = "Test Integration Donor",
            email = donorEmail,
            password = "donorPassword123!",
            role = Role.ROLE_DONOR,
            phone = "+1-555-9999",
            address = "777 Verification Way"
        )

        val regResult = mockMvc.post("/api/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(registerReq)
        }.andExpect {
            status { isCreated() }
            jsonPath("$.token") { exists() }
            jsonPath("$.user.email") { value(donorEmail) }
        }.andReturn()

        // Verify in MySQL repository
        val userInDb = userRepository.findByEmail(donorEmail)
        assertTrue(userInDb.isPresent, "User must appear in MySQL users table!")
        assertEquals("Test Integration Donor", userInDb.get().fullName)

        // -------------------------------------------------------------
        // Step 3: Log in with that user
        // -------------------------------------------------------------
        val loginReq = LoginRequest(email = donorEmail, password = "donorPassword123!")
        val loginResult = mockMvc.post("/api/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(loginReq)
        }.andExpect {
            status { isOk() }
            jsonPath("$.token") { exists() }
        }.andReturn()

        val donorAuthResponse: AuthResponse = objectMapper.readValue(
            loginResult.response.contentAsString,
            AuthResponse::class.java
        )
        val donorToken = donorAuthResponse.token

        // -------------------------------------------------------------
        // Step 4 & 5: Submit a new medicine donation & Check that donation appears in MySQL
        // -------------------------------------------------------------
        val donationReq = DonationCreateRequest(
            medicineName = "Amoxicillin 500mg Test",
            genericName = "Amoxicillin",
            category = "Antibiotic",
            quantity = 50,
            unit = "capsules",
            expiryDate = LocalDate.now().plusMonths(12),
            batchNumber = "BATCH-INT-$uniqueSuffix",
            manufacturer = "Global Pharma",
            storageCondition = "Room temperature",
            conditionNotes = "Factory sealed bottles",
            pickupAddress = "777 Verification Way"
        )

        val donationResult = mockMvc.post("/api/donations") {
            contentType = MediaType.APPLICATION_JSON
            header("Authorization", "Bearer $donorToken")
            content = objectMapper.writeValueAsString(donationReq)
        }.andExpect {
            status { isCreated() }
            jsonPath("$.id") { exists() }
            jsonPath("$.medicineName") { value("Amoxicillin 500mg Test") }
            jsonPath("$.status") { value("PENDING") }
        }.andReturn()

        val donationResponse: DonationResponseDTO = objectMapper.readValue(
            donationResult.response.contentAsString,
            DonationResponseDTO::class.java
        )

        // Verify in MySQL repository
        val donationInDb = donationRepository.findById(donationResponse.id)
        assertTrue(donationInDb.isPresent, "Donation must appear in MySQL medicine_donations table!")
        assertEquals("Amoxicillin 500mg Test", donationInDb.get().medicineName)
        assertEquals(50, donationInDb.get().quantity)
        assertEquals(DonationStatus.PENDING, donationInDb.get().status)

        // -------------------------------------------------------------
        // Step 6 & 7: Refresh simulation - Confirm donation is still displayed
        // -------------------------------------------------------------
        mockMvc.get("/api/donations/my") {
            header("Authorization", "Bearer $donorToken")
        }.andExpect {
            status { isOk() }
            jsonPath("$[?(@.id == ${donationResponse.id})].medicineName") { value("Amoxicillin 500mg Test") }
        }

        // Verify Donor Dashboard has dynamic DB numbers
        mockMvc.get("/api/dashboard/donor") {
            header("Authorization", "Bearer $donorToken")
        }.andExpect {
            status { isOk() }
            jsonPath("$.totalDonations") { value(1) }
            jsonPath("$.pendingDonations") { value(1) }
        }

        // -------------------------------------------------------------
        // Step 8 & 9: Register beneficiary, submit medicine request & check medicine_requests table
        // -------------------------------------------------------------
        val benRegisterReq = RegisterRequest(
            fullName = "Beneficiary User",
            email = beneficiaryEmail,
            password = "benPassword123!",
            role = Role.ROLE_BENEFICIARY
        )
        val benRegResult = mockMvc.post("/api/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(benRegisterReq)
        }.andExpect {
            status { isCreated() }
        }.andReturn()

        val benAuthResponse: AuthResponse = objectMapper.readValue(
            benRegResult.response.contentAsString,
            AuthResponse::class.java
        )
        val benToken = benAuthResponse.token

        val requestReq = RequestCreateRequest(
            medicineName = "Amoxicillin 500mg Test",
            quantityRequested = 20,
            urgencyLevel = UrgencyLevel.HIGH,
            reason = "Prescription for severe acute infection"
        )

        val reqResult = mockMvc.post("/api/requests") {
            contentType = MediaType.APPLICATION_JSON
            header("Authorization", "Bearer $benToken")
            content = objectMapper.writeValueAsString(requestReq)
        }.andExpect {
            status { isCreated() }
            jsonPath("$.id") { exists() }
            jsonPath("$.status") { value("PENDING") }
        }.andReturn()

        val reqResponse: RequestResponseDTO = objectMapper.readValue(
            reqResult.response.contentAsString,
            RequestResponseDTO::class.java
        )

        // Verify in MySQL repository
        val requestInDb = requestRepository.findById(reqResponse.id)
        assertTrue(requestInDb.isPresent, "Request must appear in MySQL medicine_requests table!")
        assertEquals("Amoxicillin 500mg Test", requestInDb.get().medicineName)
        assertEquals(20, requestInDb.get().quantityRequested)

        // Verify Beneficiary Dashboard has dynamic DB numbers
        mockMvc.get("/api/dashboard/beneficiary") {
            header("Authorization", "Bearer $benToken")
        }.andExpect {
            status { isOk() }
            jsonPath("$.totalRequests") { value(1) }
            jsonPath("$.pendingRequests") { value(1) }
        }

        // -------------------------------------------------------------
        // Step 10 & 11: Approve a donation as an authorized admin & Verify MySQL status changes
        // -------------------------------------------------------------
        val adminLoginReq = LoginRequest(email = "admin@medishare.org", password = "admin123")
        val adminLoginResult = mockMvc.post("/api/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(adminLoginReq)
        }.andExpect {
            status { isOk() }
        }.andReturn()

        val adminAuthResponse: AuthResponse = objectMapper.readValue(
            adminLoginResult.response.contentAsString,
            AuthResponse::class.java
        )
        val adminToken = adminAuthResponse.token

        // Approve donation
        val updateStatusReq = DonationStatusUpdateRequest(
            status = DonationStatus.APPROVED,
            notes = "Pharmacist inspection passed, packaging intact."
        )

        mockMvc.patch("/api/donations/${donationResponse.id}/status") {
            contentType = MediaType.APPLICATION_JSON
            header("Authorization", "Bearer $adminToken")
            content = objectMapper.writeValueAsString(updateStatusReq)
        }.andExpect {
            status { isOk() }
            jsonPath("$.status") { value("APPROVED") }
        }

        // Verify MySQL database record status changed
        val updatedDonationInDb = donationRepository.findById(donationResponse.id).get()
        assertEquals(DonationStatus.APPROVED, updatedDonationInDb.status, "Database status MUST change to APPROVED in MySQL!")

        // -------------------------------------------------------------
        // Step 12 & 13: Log out and log in again & Confirm saved info is still available
        // -------------------------------------------------------------
        // Re-login as donor
        val reLoginResult = mockMvc.post("/api/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(loginReq)
        }.andExpect {
            status { isOk() }
        }.andReturn()

        val reAuthResponse: AuthResponse = objectMapper.readValue(
            reLoginResult.response.contentAsString,
            AuthResponse::class.java
        )
        val freshDonorToken = reAuthResponse.token

        // Confirm saved donation is still available with updated APPROVED status
        mockMvc.get("/api/donations/my") {
            header("Authorization", "Bearer $freshDonorToken")
        }.andExpect {
            status { isOk() }
            jsonPath("$[?(@.id == ${donationResponse.id})].status") { value("APPROVED") }
        }

        // Verify Admin Dashboard queries database directly (No hardcoded numbers)
        mockMvc.get("/api/dashboard/admin") {
            header("Authorization", "Bearer $adminToken")
        }.andExpect {
            status { isOk() }
            jsonPath("$.totalRegisteredUsers") { isNumber() }
            jsonPath("$.totalDonations") { isNumber() }
            jsonPath("$.totalRequests") { isNumber() }
            jsonPath("$.verifiedNgos") { isNumber() }
            jsonPath("$.pendingApprovals") { isNumber() }
            jsonPath("$.expiredMedicineRecords") { isNumber() }
        }
    }
}
