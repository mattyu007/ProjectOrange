USE Cue;
START TRANSACTION;
DELETE FROM mysql.proc WHERE db LIKE 'Cue' AND type='PROCEDURE';
DELIMITER $$


-- Retrieve a user's credentials by their Facebook user ID.
CREATE PROCEDURE GET_CREDENTIALS_BY_FACEBOOK_ID(IN fbuid VARCHAR(36))
BEGIN
    SELECT uuid, access_token FROM User WHERE fb_user_id = fbuid;
END$$


-- Retrieve a user's access token with their user ID.
CREATE PROCEDURE GET_ACCESS_TOKEN(IN u VARCHAR(36))
BEGIN
    SELECT access_token FROM User WHERE uuid=u;
END$$


-- Create a user with a uuid, access token, and Facebook ID.
CREATE PROCEDURE CREATE_USER(IN u VARCHAR(36), IN at VARCHAR(160), IN fbuid VARCHAR(36))
BEGIN
    INSERT INTO User (uuid, access_token, fb_user_id) VALUES (u, at, fbuid);
END$$


-- Set the name of a user with their UUID.
CREATE PROCEDURE SET_USER_NAME(IN u VARCHAR(255), IN n VARCHAR(36))
BEGIN
    UPDATE User SET name=n WHERE uuid=u;
END$$


-- Retrieve the name of a user with their UUID.
CREATE PROCEDURE GET_USER(IN u VARCHAR(36))
BEGIN
    SELECT uuid, fb_user_id, access_token, name FROM User WHERE uuid=u;
END$$


-- Create a deck with a uuid, name, owner, and the current time.
CREATE PROCEDURE CREATE_DECK (
    IN u VARCHAR(36),
    IN n VARCHAR(255),
    IN o VARCHAR(36),
    IN device VARCHAR(255),
    IN tags VARCHAR(500)
)
BEGIN
    DECLARE d DATETIME;
    SELECT NOW() INTO d;

    INSERT INTO Deck (uuid, name, owner, created, last_update, tags_delimited)
        VALUES (u, n, o, d, d, tags);
    CALL LIBRARY_ADD(o, u, device, 'private');
END$$


-- Clear all tags associated with a deck.
CREATE PROCEDURE SET_DELIMITED_TAGS(IN did VARCHAR(36), IN tags VARCHAR(500))
BEGIN
    UPDATE Deck SET tags_delimited=tags WHERE uuid=did;
END$$


-- Get all delimited tags associated with a deck.
CREATE PROCEDURE GET_DELIMITED_TAGS(IN did VARCHAR(36))
BEGIN
    SELECT tags_delimited FROM Deck WHERE uuid=did;
END$$


-- Create a card with a uuid, deck_id, front, back, and position.
CREATE PROCEDURE CREATE_CARD
(
    IN u VARCHAR(36), IN d VARCHAR(36), IN f VARCHAR(255), IN b VARCHAR(255), IN p INTEGER
)
BEGIN
    INSERT INTO Card (uuid, deck_id, front, back, position) VALUES (u, d, f, b, p);
END$$


-- Create a card with a uuid, deck_id, front, back, and position. Update card positions.
CREATE PROCEDURE CREATE_CARD_AND_UPDATE_POSITIONS
(
    IN u VARCHAR(36), IN d VARCHAR(36), IN f VARCHAR(255), IN b VARCHAR(255), IN p INTEGER
)
BEGIN
    CALL CREATE_CARD(u, d, f, b, p);
    UPDATE Card SET position=(position + 1) WHERE deck_id=d AND uuid <> u AND position >= p;
END$$


-- Move a card to a new position in a deck.
CREATE PROCEDURE MOVE_CARD(IN u VARCHAR(36), IN d VARCHAR(36), IN p INTEGER)
BEGIN
    DECLARE old_p INTEGER;
    SELECT position INTO old_p FROM Card WHERE uuid=u AND deck_id=d;

    -- If the card doesn't exist, raise an error.
    IF old_p IS NULL THEN
        SIGNAL SQLSTATE 'ERROR';
    END IF;

    UPDATE Card SET position=p WHERE uuid=u AND deck_id=d;
    IF old_p > p THEN
        UPDATE Card SET position=(position + 1)
        WHERE uuid <> u AND deck_id=d AND position < old_p AND position >= p;
    ELSE
        UPDATE Card SET position=(position - 1)
        WHERE uuid <> u AND deck_id=d AND position > old_p AND position <= p;
    END IF;
END$$


-- Delete a card by uuid and deck_id.
-- We don't need the deck_id but it ensures that we don't delete a card from a different deck.
CREATE PROCEDURE DELETE_CARD_AND_UPDATE_POSITIONS(IN u VARCHAR(36), IN d VARCHAR(36))
BEGIN
    DECLARE p INTEGER;
    SELECT position INTO p FROM Card WHERE uuid=u and deck_id=d;
    DELETE FROM Card WHERE uuid=u and deck_id=d;
    UPDATE Card SET position=(position - 1) WHERE deck_id=d AND position > p;
END$$

-- Delete a card by uuid and deck_id without changing positions.
CREATE PROCEDURE DELETE_CARD(IN u VARCHAR(36), IN d VARCHAR(36))
BEGIN
    DELETE FROM Card WHERE uuid=u and deck_id=d;
END$$


-- Flag a card for a specific user.
CREATE PROCEDURE FLAG_CARD(IN cid VARCHAR(36), IN uid VARCHAR(36))
BEGIN
    INSERT IGNORE INTO NeedReview (card_id, user_id) VALUES (cid, uid);
END$$


-- Unflag a card for a specific user.
CREATE PROCEDURE UNFLAG_CARD(IN cid VARCHAR(36), IN uid VARCHAR(36))
BEGIN
    DELETE FROM NeedReview WHERE card_id=cid AND user_id=uid;
END$$


-- Increment user data version number.
CREATE PROCEDURE INCREMENT_USER_DATA_VERSION(IN uid VARCHAR(36), IN did VARCHAR(36), IN device VARCHAR(255))
BEGIN
    UPDATE Library SET version=(version + 1), last_update_device=device WHERE user_id=uid AND deck_id=did;
    SELECT version FROM Library WHERE user_id=uid AND deck_id=did;
END$$


-- Increment deck version number.
CREATE PROCEDURE INCREMENT_DECK_VERSION(IN did VARCHAR(36))
BEGIN
    UPDATE Deck SET version=(version + 1), last_update=NOW() WHERE uuid=did;
    SELECT version FROM Deck WHERE uuid=did;
END$$


-- Retrieve a deck's existing share code
CREATE PROCEDURE GET_SHARE_CODE(IN did VARCHAR(36))
BEGIN
    SELECT share_code FROM Deck WHERE uuid=did;
END$$


-- Add share code if code doesn't already exist.
CREATE PROCEDURE SET_SHARE_CODE(IN did VARCHAR(36), IN code VARCHAR(8))
BEGIN
	DECLARE s_code VARCHAR(8) DEFAULT NULL;
    SELECT share_code INTO s_code FROM Deck WHERE share_code=code;

    IF (s_code IS NULL) THEN
        UPDATE Deck SET share_code=code WHERE uuid=did;
    END IF;

    SELECT share_code FROM Deck WHERE uuid=did;
END$$


-- Get the user data version and deck version numbers for a specific deck and user.
CREATE PROCEDURE GET_VERSIONS(IN uid VARCHAR(36), IN did VARCHAR(36))
BEGIN
    SELECT
        Deck.version as deck_version,
        L.version as user_data_version
    FROM Deck LEFT JOIN (
        SELECT version, deck_id FROM Library WHERE user_id=uid AND deck_id=did
    ) AS L ON Deck.uuid=L.deck_id
    WHERE Deck.uuid=did AND (Deck.owner=uid OR public=TRUE);
END$$


-- Remove a rating on a remote deck.
CREATE PROCEDURE UNRATE_DECK(IN uid VARCHAR(36), IN did VARCHAR(36))
BEGIN
    DECLARE old_rating INTEGER;
    SELECT rating INTO old_rating FROM Rating WHERE user_id=uid AND deck_id=did;
    DELETE FROM Rating WHERE user_id=uid AND deck_id=did;
    IF old_rating IS NOT NULL THEN
        UPDATE Deck SET rating=(rating - old_rating) WHERE uuid=did;
    END IF;
END$$


-- Rate a remote deck.
CREATE PROCEDURE RATE_DECK(IN uid VARCHAR(36), IN did VARCHAR(36), IN r INTEGER)
BEGIN
    UPDATE Deck SET rating=(rating + r) WHERE uuid=did;
    INSERT INTO Rating (user_id, deck_id, rating) VALUES (uid, did, r);
END$$


-- Remove a deck from the user's library.
-- Remove the cards and mark as deleted if the deck is owned by the user.
CREATE PROCEDURE REMOVE_DECK(IN uid VARCHAR(36), IN did VARCHAR(36))
BEGIN
    DECLARE o VARCHAR(36);
    DELETE FROM Library WHERE user_id=uid AND deck_id=did;
    SELECT owner INTO o FROM Deck WHERE uuid=did;
    IF o = uid THEN
        UPDATE Deck SET deleted=TRUE WHERE uuid=did;
        DELETE FROM Card WHERE deck_id=did;
    END IF;
END$$


-- Fetch all cards for a given deck.
CREATE PROCEDURE FETCH_CARDS(IN uid VARCHAR(36), IN did VARCHAR(36))
BEGIN
    SELECT
        uuid,
        front,
        back,
        position,
        (SELECT COUNT(*) FROM NeedReview WHERE card_id=Card.uuid AND user_id=uid) AS needs_review
    FROM Card
    WHERE Card.deck_id=did ORDER BY Card.position ASC;
END$$


-- Fetch a deck's metadata.
CREATE PROCEDURE FETCH_DECK(IN uid VARCHAR(36), IN did VARCHAR(36))
BEGIN
    SELECT
        Deck.uuid,
        Deck.name,
        Deck.rating,
        (SELECT COUNT(*) FROM Rating WHERE deck_id=did) AS num_ratings,
        (SELECT COUNT(*) FROM Card WHERE deck_id=did) AS num_cards,
        (SELECT rating FROM Rating WHERE deck_id=did AND user_id=uid) as user_rating,
        Deck.owner,
        Deck.public,
        Deck.version AS deck_version,
        L.version AS user_data_version,
        Deck.created,
        Deck.last_update,
        L.last_update_device,
        Deck.share_code,
        User.name AS author,
        L.accession,
        Deck.deleted
    FROM Deck LEFT JOIN (
        SELECT version, last_update_device, deck_id, accession
        FROM Library WHERE user_id=uid and deck_id=did
    ) AS L ON L.deck_id=Deck.uuid
    LEFT JOIN User ON User.uuid=Deck.owner
    WHERE Deck.uuid=did;
END$$


-- Fetch metadata for a page of decks
CREATE PROCEDURE FETCH_DECK_UUIDS(IN type VARCHAR(10), IN page Integer)
BEGIN
    DECLARE sort_criteria VARCHAR(20);
    DECLARE page_size INTEGER DEFAULT 50;
    DECLARE page_offset INTEGER;

    SET page = IFNULL(page, 1);

    IF (type = 'top') THEN
        SET sort_criteria = 'Deck.rating';
    ELSEIF (type = 'new') THEN
        SET sort_criteria = 'Deck.created';
    ELSE
        SET sort_criteria = 'Deck.rating';
    END IF;

    SET page_offset = (page - 1) * page_size;

    SET @sql_statement = CONCAT('SELECT
        Deck.uuid
    FROM Deck
    WHERE Deck.public=TRUE AND Deck.deleted=FALSE
    ORDER BY ', sort_criteria, ' DESC ',
    'LIMIT ', CAST(page_offset AS CHAR), ', ', page_size);

    PREPARE stmt FROM @sql_statement;
    EXECUTE stmt;

END$$


CREATE PROCEDURE SEARCH_DECKS(IN query_string VARCHAR(255), IN page Integer)
BEGIN
    DECLARE page_size INTEGER DEFAULT 50;
    DECLARE page_offset INTEGER;

    SET page = IFNULL(page, 1);

    SET page_offset = (page - 1) * page_size;

    SELECT
        Deck.uuid
    FROM Deck
    WHERE Deck.public=TRUE AND Deck.deleted=FALSE
    AND MATCH(Deck.name, Deck.tags_delimited) AGAINST(query_string IN NATURAL LANGUAGE MODE)
    LIMIT page_offset, page_size;
END$$

-- Fetch metadata for user library
CREATE PROCEDURE FETCH_LIBRARY(IN uid VARCHAR(36))
BEGIN
    SELECT
        Library.deck_id
    FROM Library
        LEFT JOIN (SELECT uuid, name FROM Deck) as D
        ON D.uuid = Library.deck_id
    WHERE Library.user_id=uid
    ORDER BY D.name ASC;
END$$

-- Add deck to user library
CREATE PROCEDURE LIBRARY_ADD(
    IN uid VARCHAR(36),
    IN did VARCHAR(36),
    IN dev VARCHAR(255),
    IN acc VARCHAR(7))
BEGIN
    INSERT INTO Library (user_id, deck_id, last_update_device, accession)
    VALUES (uid, did, dev, acc);
END$$

-- Remove deck from user library
CREATE PROCEDURE LIBRARY_REMOVE(IN uid VARCHAR(36), IN did VARCHAR(36))
BEGIN
    DELETE FROM Library WHERE user_id=uid AND deck_id=did;

    SELECT Deck.owner INTO @owner FROM Deck
    WHERE Deck.uuid = did;

    IF (@owner=uid) THEN
        UPDATE Deck SET deleted=true WHERE Deck.uuid=did;
        DELETE FROM Card WHERE deck_id=did;
    END IF;
END$$

DELIMITER ;
COMMIT;
