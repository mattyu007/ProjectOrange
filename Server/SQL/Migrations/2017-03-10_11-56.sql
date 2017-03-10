USE Cue;
START TRANSACTION;
-- BEGIN MIGRATION --

ALTER TABLE Library
ADD COLUMN accession VARCHAR(7) DEFAULT NULL;

UPDATE Library
INNER JOIN Deck
    ON Deck.owner=Library.user_id AND Deck.uuid=Library.deck_id
SET Library.accession='private';

UPDATE Library
LEFT JOIN Deck
    ON Deck.uuid=Library.deck_id
SET Library.accession='public'
WHERE Deck.public=TRUE AND Deck.owner <> Library.user_id;

UPDATE Library
LEFT JOIN Deck
    ON Deck.uuid=Library.deck_id
SET Library.accession='shared'
WHERE Deck.share_code IS NOT NULL AND Deck.public <> TRUE AND Deck.owner <> Library.user_id;

ALTER TABLE Library
MODIFY COLUMN accession VARCHAR(7) NOT NULL;

-- ALWAYS require a device name
ALTER TABLE Library
MODIFY COLUMN last_update_device VARCHAR(255) NOT NULL;

-- END MIGRATION --
COMMIT;
