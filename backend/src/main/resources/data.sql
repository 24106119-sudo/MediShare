-- =======================================================
-- MediShare Seed Data for Testing & Demonstration
-- Passwords below are BCrypt-hashed for default test logins:
-- 'admin123' -> $2a$10$wK1RkM3Zk0Jg5zD9K0R3eubB5B6g0iA3Fk9P6d1h8sJ8j7h6f5d4e
-- We also implement Kotlin DataInitializer to ensure verified hashing.
-- =======================================================

USE medishare_db;

-- 1. Insert Initial Users
INSERT INTO users (id, full_name, email, password, role, phone, address, organization_name, is_verified, created_at)
VALUES 
(1, 'System Administrator', 'admin@medishare.org', '$2a$10$wK1RkM3Zk0Jg5zD9K0R3eubB5B6g0iA3Fk9P6d1h8sJ8j7h6f5d4e', 'ROLE_ADMIN', '+1-555-0100', '100 Health Blvd, Suite 400', 'MediShare Core', TRUE, NOW()),
(2, 'Sarah Jenkins (Donor)', 'donor@medishare.org', '$2a$10$wK1RkM3Zk0Jg5zD9K0R3eubB5B6g0iA3Fk9P6d1h8sJ8j7h6f5d4e', 'ROLE_DONOR', '+1-555-0101', '742 Evergreen Terrace', NULL, TRUE, NOW()),
(3, 'Robert Martinez (Beneficiary)', 'beneficiary@medishare.org', '$2a$10$wK1RkM3Zk0Jg5zD9K0R3eubB5B6g0iA3Fk9P6d1h8sJ8j7h6f5d4e', 'ROLE_BENEFICIARY', '+1-555-0102', '12 Oak Ridge Lane', NULL, TRUE, NOW()),
(4, 'Care & Hope Health Foundation', 'ngo@carehope.org', '$2a$10$wK1RkM3Zk0Jg5zD9K0R3eubB5B6g0iA3Fk9P6d1h8sJ8j7h6f5d4e', 'ROLE_NGO', '+1-555-0103', '500 Charity Way', 'Care & Hope Foundation', TRUE, NOW()),
(5, 'Sunrise Community Clinic', 'pending@sunriseclinic.org', '$2a$10$wK1RkM3Zk0Jg5zD9K0R3eubB5B6g0iA3Fk9P6d1h8sJ8j7h6f5d4e', 'ROLE_NGO', '+1-555-0104', '88 Relief Road', 'Sunrise Clinic NGO', FALSE, NOW())
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 2. Insert Sample Medicine Donations
INSERT INTO medicine_donations (id, donor_id, medicine_name, generic_name, category, quantity, unit, expiry_date, batch_number, manufacturer, storage_condition, condition_notes, status, pickup_address, image_proof_url, created_at, updated_at)
VALUES
(1, 2, 'Paracetamol 500mg', 'Acetaminophen', 'Analgesic', 150, 'tablets', '2027-08-30', 'BATCH-PCM-2024', 'GSK Health', 'Store below 25C', 'Sealed blister packs in original box', 'APPROVED', '742 Evergreen Terrace', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', NOW(), NOW()),
(2, 2, 'Amoxicillin 500mg', 'Amoxicillin Trihydrate', 'Antibiotic', 60, 'capsules', '2027-10-15', 'BATCH-AMX-8821', 'Pfizer Inc.', 'Keep in dry cool place', 'Unopened bottles', 'PENDING', '742 Evergreen Terrace', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500', NOW(), NOW()),
(3, 2, 'Metformin 850mg', 'Metformin Hydrochloride', 'Antidiabetic', 120, 'tablets', '2027-12-01', 'BATCH-MET-4412', 'Merck KGaA', 'Room temperature', 'Factory sealed foil', 'APPROVED', '742 Evergreen Terrace', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500', NOW(), NOW()),
(4, 2, 'Expired Cetirizine 10mg', 'Cetirizine HCl', 'Antihistamine', 50, 'tablets', '2024-01-10', 'BATCH-EXP-001', 'Sun Pharma', 'Cool dry storage', 'Expired lot for testing quarantine count', 'REJECTED', '742 Evergreen Terrace', 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500', NOW(), NOW()),
(5, 2, 'Omeprazole 20mg', 'Omeprazole', 'Antacid', 90, 'capsules', '2027-05-20', 'BATCH-OMP-9903', 'AstraZeneca', 'Below 30C', 'Distributed to Community Clinic', 'COMPLETED', '742 Evergreen Terrace', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500', NOW(), NOW())
ON DUPLICATE KEY UPDATE medicine_name=VALUES(medicine_name);

-- 3. Insert Sample Medicine Requests
INSERT INTO medicine_requests (id, beneficiary_id, medicine_name, quantity_requested, urgency_level, prescription_proof_url, reason, status, matched_donation_id, admin_notes, created_at, updated_at)
VALUES
(1, 3, 'Paracetamol 500mg', 30, 'MEDIUM', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500', 'Fever relief for elder family member', 'PENDING', NULL, 'Under review by pharmacist', NOW(), NOW()),
(2, 3, 'Metformin 850mg', 60, 'HIGH', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500', 'Monthly diabetes management medication', 'APPROVED', 3, 'Approved for dispatch via NGO courier', NOW(), NOW()),
(3, 3, 'Amoxicillin 500mg', 20, 'CRITICAL', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500', 'Severe respiratory infection treatment', 'FULFILLED', 2, 'Successfully delivered to beneficiary', NOW(), NOW()),
(4, 3, 'Atorvastatin 20mg', 45, 'LOW', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500', 'Cholesterol maintenance', 'PENDING', NULL, 'Awaiting donation match', NOW(), NOW())
ON DUPLICATE KEY UPDATE medicine_name=VALUES(medicine_name);

-- 4. Initial Activity Logs
INSERT INTO activity_logs (action, performed_by, details, created_at)
VALUES
('SYSTEM_INITIALIZE', 'System', 'MediShare database initialized with seed records', NOW()),
('DONATION_SUBMITTED', 'donor@medishare.org', 'Donation of Paracetamol 500mg (150 tablets) submitted', NOW()),
('REQUEST_SUBMITTED', 'beneficiary@medishare.org', 'Request for Metformin 850mg submitted', NOW());
