USE Cue;
START TRANSACTION;
-- BEGIN MIGRATION --

UPDATE Deck SET tags_delimited = NULL WHERE tags_delimited = '';

-- END MIGRATION --
COMMIT;
