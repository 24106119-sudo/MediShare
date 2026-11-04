-- =======================================================
-- MediShare Medicine Redistribution Platform Schema
-- Target Database: MySQL 8.0+
-- =======================================================

CREATE DATABASE IF NOT EXISTS medishare_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE medishare_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'ROLE_DONOR',
    phone VARCHAR(20),
    address VARCHAR(255),
    organization_name VARCHAR(150),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Medicine Donations Table
CREATE TABLE IF NOT EXISTS medicine_donations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    donor_id BIGINT NOT NULL,
    medicine_name VARCHAR(150) NOT NULL,
    generic_name VARCHAR(150),
    category VARCHAR(100),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit VARCHAR(30) NOT NULL DEFAULT 'tablets',
    expiry_date DATE NOT NULL,
    batch_number VARCHAR(50),
    manufacturer VARCHAR(100),
    storage_condition VARCHAR(100),
    condition_notes TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    pickup_address VARCHAR(255),
    image_proof_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_donations_donor FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_donations_donor (donor_id),
    INDEX idx_donations_status (status),
    INDEX idx_donations_expiry (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Medicine Requests Table
CREATE TABLE IF NOT EXISTS medicine_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    beneficiary_id BIGINT NOT NULL,
    medicine_name VARCHAR(150) NOT NULL,
    quantity_requested INT NOT NULL CHECK (quantity_requested > 0),
    urgency_level VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    prescription_proof_url VARCHAR(500),
    reason TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    matched_donation_id BIGINT NULL,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_requests_beneficiary FOREIGN KEY (beneficiary_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_requests_matched_donation FOREIGN KEY (matched_donation_id) REFERENCES medicine_donations(id) ON DELETE SET NULL,
    INDEX idx_requests_beneficiary (beneficiary_id),
    INDEX idx_requests_status (status),
    INDEX idx_requests_urgency (urgency_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Audit & Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
