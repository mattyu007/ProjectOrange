USE Cue;
START TRANSACTION;
-- BEGIN MIGRATION --


-- Overwrite tags_delimited with content from Tag and DeckTag
UPDATE Deck
SET tags_delimited=(
    SELECT GROUP_CONCAT(Tag.tag)
    FROM DeckTag
        LEFT JOIN Tag
        ON Tag.id = DeckTag.tag_id
        WHERE DeckTag.deck_id=Deck.uuid
        GROUP BY DeckTag.deck_id
);

-- Drop DeckTag and Tag tables
DROP TABLE DeckTag;
DROP TABLE Tag;


-- END MIGRATION --
COMMIT;
