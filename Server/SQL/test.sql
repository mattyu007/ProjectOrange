USE Cue;

INSERT INTO `User`
    (uuid, fb_user_id, access_token, name)
VALUES (
    '30909c51-608c-49a4-b108-3eb293fa2a48',
    '10158431076425085',
    'adeuYLkiULwxnH6U6f1IGgwnkVcwy7gtVIYEk34uCjPyIiJIIxPNl1RpLeFFlosHe8DPZtIJgl/3cZU252qFAN2ZqdDs4nb7cGpnlvRpDWtk3cOJljeRFnPaVWRzCjJPcKh8mFcApvE9pEN3J70ZYzou3g4WHlb2',
    NULL
),
(
    '3e7a9be3-1429-401f-878a-7acce8e9c249',
    '109418406250675',
    'YiJdo/TOK85ox7PTN/fdc2KJ9fzxzwV2i0V/nMdccyksE/Bc8OyN6eykXHpEDctIPpvIhekesbyOF9d502Ebgrom0RXoSZXUQFW6Od4ubZAKpyoBH9/0oZ2oldzwK4TWk4B5JR8B89Gs0p3yiNRPD+rYRI6tWLbm',
    NULL
),
(
    '8229472c-1fb8-4d2c-931a-fdadc5b76c92',
    '10155462234176111',
    'DjHmg+KhbWxKwnW8H6ZZLmflKMKxOXk46vXhg8qDWpDzKnKKAkLL57Nkk60tV81yr5vixo7I1IheeTK3yzDb3Moe1LEtDLZmE9rlaHB/4C6SoehBz8Bsv1VkJth8zG9EUxWYomDmAe4yAzAwb3pltnYuu7n2JJXE',
    NULL
),
(
    'd90168bd-6617-4ef1-af0b-27350cfd515f',
    '10158197915890705',
    '0yiAKp+b+tAgzFsiNVwr9aalEQY3uB3ATGp31G8eCQI7rvZNuQ2YAU1oWeFfGalAKpOFUd74zkPHBJZTaIWX04EBCR6NcTJrR3VUpOohxA01cDtaJBWhPf1dtTCqvc4cSUNILVLxZ5ipP4pY2b3o6VlZintA4jbF',
    NULL
);


INSERT INTO `Deck`
    (uuid, created, last_update, name, owner, rating, public, tags_delimited, deleted, version, share_code)
VALUES (
    '0a9ef729-c87f-4ad8-9b27-24ffd9f6ef1a',
    '2017-03-01 20:01:14',
    '2017-03-01 20:01:14',
    'Ancient Greek Mythology',
    '3e7a9be3-1429-401f-878a-7acce8e9c249',
    0,
    0,
    'ancient,greek,mythology',
    0,
    0,
    NULL
),
(
    '4710da55-0a17-4b0e-9f89-8d9c8b280e35',
    '2017-03-01 20:47:45',
    '2017-03-01 20:47:45',
    'Alternative Facts 101',
    '8229472c-1fb8-4d2c-931a-fdadc5b76c92',
    0,
    1,
    'media,politics',
    0,
    0,
    NULL
),
(
    'a1abcf63-ee50-44dc-8987-d768fb9f263d',
    '2017-03-01 20:58:12',
    '2017-03-01 20:58:12',
    'Computer Security and Privacy',
    '8229472c-1fb8-4d2c-931a-fdadc5b76c92',
    0,
    1,
    'software,programming',
    0,
    0,
    NULL
),
(
    'a398bc4e-5370-47cf-955e-dc5ffe9ef73e',
    '2017-03-01 21:06:15',
    '2017-03-01 21:06:15',
    'CS 446',
    '8229472c-1fb8-4d2c-931a-fdadc5b76c92',
    0,
    0,
    'software,programming,architecture',
    0,
    0,
    'ABCDEF'
),
(
    'd4f5c753-e605-4a06-a4e4-b960b00ef460',
    '2017-03-01 20:09:26',
    '2017-03-01 20:09:26',
    'French 101',
    '3e7a9be3-1429-401f-878a-7acce8e9c249',
    0,
    0,
    'language,beginner',
    0,
    0,
    NULL
),
(
    'e772e6ea-e498-41b2-8bcf-ef6bff71b262',
    '2017-03-01 20:32:58',
    '2017-03-01 20:32:58',
    'Cold War Russia',
    '3e7a9be3-1429-401f-878a-7acce8e9c249',
    0,
    0,
    'history,espionage',
    0,
    0,
    NULL
);


INSERT INTO `Library`
    (user_id, deck_id, version, last_update_device)
VALUES (
    '3e7a9be3-1429-401f-878a-7acce8e9c249',
    '0a9ef729-c87f-4ad8-9b27-24ffd9f6ef1a',
    0,
    NULL
),
(
    '3e7a9be3-1429-401f-878a-7acce8e9c249',
    '4710da55-0a17-4b0e-9f89-8d9c8b280e35',
    0,
    NULL
),
(
    '3e7a9be3-1429-401f-878a-7acce8e9c249',
    'a1abcf63-ee50-44dc-8987-d768fb9f263d',
    0,
    NULL
),
(
    '3e7a9be3-1429-401f-878a-7acce8e9c249',
    'a398bc4e-5370-47cf-955e-dc5ffe9ef73e',
    0,
    NULL
),
(
    '3e7a9be3-1429-401f-878a-7acce8e9c249',
    'd4f5c753-e605-4a06-a4e4-b960b00ef460',
    0,
    NULL
),
(
    '3e7a9be3-1429-401f-878a-7acce8e9c249',
    'e772e6ea-e498-41b2-8bcf-ef6bff71b262',
    0,
    NULL
),
(
    '8229472c-1fb8-4d2c-931a-fdadc5b76c92',
    '4710da55-0a17-4b0e-9f89-8d9c8b280e35',
    0,
    NULL
),
(
    '8229472c-1fb8-4d2c-931a-fdadc5b76c92',
    'a1abcf63-ee50-44dc-8987-d768fb9f263d',
    0,
    NULL
),
(
    '8229472c-1fb8-4d2c-931a-fdadc5b76c92',
    'a398bc4e-5370-47cf-955e-dc5ffe9ef73e',
    0,
    NULL
);

INSERT INTO `Card`
    (uuid, deck_id, front, back, position)
VALUES (
    '13047483-d78d-46ee-8896-70c8ccb9ca60',
    '0a9ef729-c87f-4ad8-9b27-24ffd9f6ef1a',
    'According to the Illiad, which of his sons did Zeus dislike the most?',
    'Ares, god of war.',
    0
),
(
    '16212c98-38b9-45f5-a2bb-235b8afba550',
    'd4f5c753-e605-4a06-a4e4-b960b00ef460',
    'Je suis fatigue','I am tired',
    0
),
(
    '1a23d17b-174e-4fd1-979f-9519b3cd1aed',
    'a1abcf63-ee50-44dc-8987-d768fb9f263d',
    'Tor routers are also called',
    'Onion routers',
    3
),
(
    '2161c3d9-2c0a-4bb3-b259-7a1b7e385408',
    'a398bc4e-5370-47cf-955e-dc5ffe9ef73e',
    'The network stack is a popular example of which architecture style?',
    'Layered architecture',
    2
),
(
    '29534ba5-886c-4ee2-a85f-eddd0f8fe337',
    'd4f5c753-e605-4a06-a4e4-b960b00ef460',
    'Parlez anglais!',
    'Speak English!',
    2
),
(
    '325228e3-dd59-4a16-a101-c574e854015c',
    'd4f5c753-e605-4a06-a4e4-b960b00ef460',
    'Combienne d\'argent?','How much money?',
    1
),
(
    '3c256c08-17f5-46d0-9b5b-aba44cf2873a',
    'd4f5c753-e605-4a06-a4e4-b960b00ef460',
    'Comme un pro',
    'Like a boss',
    4
),
(
    '5d5d894a-de88-4dbd-81ce-da925d6d5b93',
    '0a9ef729-c87f-4ad8-9b27-24ffd9f6ef1a',
    'Who was the god of the underworld?',
    'Hades',
    2
),
(
    '6f32aca8-76ab-4a3e-b947-07c891bfdbef',
    'd4f5c753-e605-4a06-a4e4-b960b00ef460',
    'Qu\'est-ce que tu veux?',
    'What do you want?',
    3
),
(
    '722aa2b8-5464-4268-9ce9-21d03f9f3f36',
    'e772e6ea-e498-41b2-8bcf-ef6bff71b262',
    'Why was the cold war so cold?',
    'Russia, man',
    2
),
(
    '785575a5-097d-4da5-96a3-7ee568adddec',
    'a1abcf63-ee50-44dc-8987-d768fb9f263d',
    'HTTPS utilizes security at which network level?',
    'Transport level',
    1
),
(
    '7b6609db-1a0b-485b-bdf3-b78db1f5765f',
    'a398bc4e-5370-47cf-955e-dc5ffe9ef73e',
    'JavaScript event listeners are an example of which pattern?',
    'Observer pattern',
    3
),
(
    '8b1c94fb-137f-4c2b-9736-463bfb4f04aa',
    '0a9ef729-c87f-4ad8-9b27-24ffd9f6ef1a',
    'How long did the Trojan war supposedly last?',
    '10 years',
    5
),
(
    '95fc483d-3362-4fc2-bf16-d350cdaa9c22',
    '0a9ef729-c87f-4ad8-9b27-24ffd9f6ef1a',
    'Who was Zeus\' father?',
    'Uranus',
    1
),
(
    '9f05671c-a832-46a7-b140-02045c283277',
    'e772e6ea-e498-41b2-8bcf-ef6bff71b262',
    'Describe the term sleeper agent',
    'A soviet agent acting as an American citizen that can be activated with a specific word or phrase',
    1
),
(
    'b2d617d0-5820-4c0d-8937-e67fa74b7504',
    'a1abcf63-ee50-44dc-8987-d768fb9f263d',
    'What does MAC stand for (encryption)?',
    'Message Authentication Code',
    0
),
(
    'c332c660-975f-47fc-ace6-7ce36368c9e1',
    '0a9ef729-c87f-4ad8-9b27-24ffd9f6ef1a',
    'What was Zeus\' favorite weapon?',
    'Lightning bolt',
    4
),
(
    'ca38ae93-a86f-430d-9c22-a80fb16b2582',
    '4710da55-0a17-4b0e-9f89-8d9c8b280e35',
    'How do you identify fake news?',
    'News that reports things that the supreme leader does not like',
    0
),
(
    'd6650c74-42bd-428d-8cdb-b26604260b59',
    'a1abcf63-ee50-44dc-8987-d768fb9f263d',
    'Using filenames instead of file descriptors can lead to which kinda of vulnerability?',
    'TOCTTOU (time of check to time of use)',
    2
),
(
    'db1b3741-5ef7-49ff-acae-5272227b93fb',
    '0a9ef729-c87f-4ad8-9b27-24ffd9f6ef1a',
    'Odysseus was king of which Greek polis?',
    'Ithaca',
    3
),
(
    'dbe8ab1f-5264-4bcc-9e89-29d5e78ccd0a',
    'd4f5c753-e605-4a06-a4e4-b960b00ef460',
    'La poursuite du bonheur',
    'The pursuit of happiness',
    5
),
(
    'dd829b04-9b01-4b86-b158-4ca9f023a99e',
    'a398bc4e-5370-47cf-955e-dc5ffe9ef73e',
    'What is the difference between publish/subscribe and event-based architecture?',
    'Publish/subscribe can have streams of data. Event-based tends to be used within the same system.',
    0
),
(
    'de225664-1b06-45c3-b31d-16ab092e319d',
    'e772e6ea-e498-41b2-8bcf-ef6bff71b262',
    'What was the major event that sparked the cold war?',
    'The Cuban missle crisis',
    0
),
(
    'deb39bf5-65b3-4d0f-83bf-2cf75fcc4f4b',
    'a398bc4e-5370-47cf-955e-dc5ffe9ef73e',
    'What are components and connectors?',
    'Components are the things and connectors connect the things',
    1
),
(
    'f866a50d-cce0-4936-87a2-196e2dcfee54',
    '4710da55-0a17-4b0e-9f89-8d9c8b280e35',
    'The 2017 inauguration was the biggest yet',
    'According to Sean Spicer, yes',
    1
);
