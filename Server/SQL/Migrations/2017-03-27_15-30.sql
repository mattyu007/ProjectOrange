USE Cue;
START TRANSACTION;
-- BEGIN MIGRATION --

SET foreign_key_checks = 0;

ALTER DATABASE Cue CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

ALTER TABLE User CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE Deck CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE Card CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE Library CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE NeedReview CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE Rating CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE User CHANGE uuid uuid VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE User CHANGE fb_user_id fb_user_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE User CHANGE access_token access_token VARCHAR(160) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE User CHANGE name name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE Deck CHANGE uuid uuid VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE Deck CHANGE name name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE Deck CHANGE owner owner VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE Deck CHANGE tags_delimited tags_delimited VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE Deck CHANGE share_code share_code VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE Card CHANGE uuid uuid VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE Card CHANGE deck_id deck_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE Card CHANGE front front VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE Card CHANGE back back VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE Library CHANGE user_id user_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE Library CHANGE deck_id deck_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE Library CHANGE last_update_device last_update_device VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE Library CHANGE accession accession VARCHAR(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE NeedReview CHANGE card_id card_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE NeedReview CHANGE user_id user_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE Rating CHANGE user_id user_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE Rating CHANGE deck_id deck_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

SET foreign_key_checks = 1;

-- END MIGRATION --
COMMIT;
