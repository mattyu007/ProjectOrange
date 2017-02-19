# API
Server-side API routes.
- [User Management](#user-management)
    - [User Creation](#user-creation)
    - [User Authentication](#user-authentication)
    - [User Information](#user-information)
- [Deck Manipulation](#deck-manipulation)
    - [Deck Creation](#deck-creation)
    - [Deck Edits](#deck-edits)
    - [Flagging Cards For Review](#flagging-cards-for-review)
- [Synchronization](#synchronization)
    - [Deck Fetch](#deck-fetch)
- [Library Management](#library-management)
    - [Fetch Library](#fetch-library)
    - [Add Remote Deck](#add-remote-deck)
    - [Copy Remote Deck](#copy-remote-deck)
    - [Remove Deck](#remove-deck)
    - [Rate Remote Deck](#rate-remote-deck)
- [Discoverability](#discoverability)
    - [Top Rated Decks](#top-rated-decks)
    - [New Decks](#new-decks)
    - [Search](#search)
- [Standard Deck Response](#standard-deck-response)
    - [Metadata Response](#metadata-response)
    - [Full Response](#full-response)


## User Management
Account creation and maintenance.

### User Creation
User creation requires that the client has obtained an access token and user ID from Facebook's
JavaScript SDK (or equivalent).

Request:
```
POST /api/v1/auth
{
    "user_id": "<user-id>",
    "access_token": "<access-token>"
}
```

A response with a status of 200 indicates that the request was successful. Note that this route
can be used to update users' access tokens as well (e.g. if they sign in on a new device).

### User Authentication
After registering an access token with the `/api/v1/auth` route, the client can make authenticated
requests using two headers:
```
X-CUE-USER-ID: <user-id>
X-CUE-ACCESS-TOKEN: <access-token>
```

Any unauthorized requests will receive a 403 response. All routes require authentication (with a
couple of exceptions like the user creation route above).

### User Information
Use this route to change/set a user's name:
```
PUT /api/v1/user
{
    "name": "<name>"
}
```

Use this route to retrieve a user's name:
```
GET /api/v1/user
```

Response:
```
{
    "name": "<name>"
}
```

## Deck Manipulation
Create and edit decks.

### Deck Creation
Request:
```
POST /api/v1/deck/add
{
    "name": "<deckname>",
    "tags": ["<tag1>", "<tag2>", ...],
    "cards": [
        { "front": "<Q>", "back": "<A>" },
        ...
    ]
}
```
Where `<deckname>` is the name of the deck to be created, "tags" specifies a list of tags that can be searched on, and "cards" contains an array of cards. In this case, cards are just dictionaries with two keys: "front" and "back" which contain the front and back text for the card. Cards are put in the deck in the same order that they appear in the list. Decks created with this route are automatically added to the user's library.

Response: [Standard Full Deck Response](#full-response)

### Deck Edits
Request:
```
PUT /api/v1/deck/<uuid>
{
    "parent-deck-version": "<parent-deck-version>",
    "parent-user-data-version" "<parent-user-data-version>",
    "name": "<name>",
    "public": true | false,
    "tags": ["<tag1>", "<tag2>", ...],
    "actions": [
        {
            "action": "add" | "edit" | "delete",
            ...
        },
        ...
    ]
}
```
Request description:
- `uuid` (required): the unique identifier for the deck being edited
- `parent-deck-version` (required): the current version of the deck
- `parent-user-data-version` (required): the current version of the user data for the deck
- `name`: the name that the deck will be changed to
- `public`: determines whether or not the deck should be discoverable by other users
- `tags`: the new list of strings that describe the deck
- `actions`: a list of actions (add, edit, delete) as described below

Add action:
```
{
    "action": "add",
    "front": "<Q>",
    "back": "<A>",
    "position", <pos>,
    "needs-review": true | false
}
```

Edit action:
```
{
    "action": "edit",
    "card-id": "<card-id>"
    "front": "<Q>",
    "back": "<A>",
    "position": <pos>,
    "needs-review": true | false
}
```

Delete action:
```
{
    "action": "delete",
    "card-id": "<card-id>"
}
```

Response: [Standard Full Deck Response](#full-response)

### Flagging Cards For Review
This route allows cards to be marked with a flag for further review.

Request:
```
PUT /api/v1/deck/<uuid>/flag
{
    "parent-deck-version": "<parent-deck-version>",
    "parent-user-data-version": "<parent-user-data-version>",
    "actions": [
        {
            "card-id": "<card-id>",
            "needs-review": true | false
        },
        ...
    ]
}
```

Request description:
- `uuid`: the unique identifier for the deck whose cards are being flagged
- `parent-deck-version`: the current version of the deck
- `parent-user-data-version`: the current version of user data for the deck
- `actions`: a list of dictionaries describing whether to flag or unflag specific cards
- `card-id`: the unique identifier for a specific card
- `needs-review`: boolean indicating whether the cards flag should be set (true) or not (false)

Response:
```
{
    user-data-version: <user-data-version>
}
```
Here, `<user-data-version>` indicates the new version of the user data for the deck.

## Synchronization
Synchronize decks.

### Deck Fetch
Request:
```
GET /api/v1/deck/<uuid>
```
Where `<uuid>` is the unique identifier for the deck being fetched.

Response: [Standard Full Deck Response](#full-response)

## Library Management
Add and remove decks from your library

### Fetch Library
Request:
```
GET /api/v1/library
```
Response:
```
{
    "decks": [
        <standard metadata deck response 1>,
        <standard metadata deck response 2>,
        ...
    ]
}
```

### Add Remote Deck
Request:
```
POST /api/v1/library/add
{
    "uuid": "<uuid>"
}
```
Where `<uuid>` is the unique identifier for the deck being added.

Response: [Standard Metadata Deck Response](#metadata-response)

### Copy Remote Deck
```
POST /api/v1/library/copy
{
    "uuid": "<uuid>"
}
```
Where `<uuid>` is the unique identifier for the deck being copied.

Response: [Standard Full Deck Response](#full-response)

### Remove Deck
Request:
```
DELETE /api/v1/library/<uuid>
```
Where `<uuid>` is the unique identifier for the deck being removed from the library. If the deck is owned by the user making this call, the deck is also deleted. A response with status 200 indicates success.

### Rate Remote Deck
Request:
```
POST /api/v1/deck/<uuid>/rate
{
    "rating": <rating>
}
```
Where `<rating>` is an integer in the range \[-1, 1\] and `<uuid>` is the unique identifier of a public deck.

## Discoverability
Discover public decks.

### Top Rated Decks
Request:
```
GET /api/v1/discover/top
```

Response:
```
{
    "decks": [
        <standard metadata deck response 1>,
        <standard metadata deck response 2>,
        ...
    ]
}
```

### New Decks
Request:
```
GET /api/v1/discover/new
```

Response:
```
{
    "decks": [
        <standard metadata deck response 1>,
        <standard metadata deck response 2>,
        ...
    ]
}
```

### Search
Request:
```
GET /api/v1/discover/search?query=<query>
```

Response:
```
{
    "decks": [
        <standard metadata deck response 1>,
        <standard metadata deck response 2>,
        ...
    ]
}
```

## Standard Deck Response
This is the response body for many common operations where a deck is returned as a result.

### Metadata Response
This response only contains metadata (does not include the cards in the deck).
```
{
    "uuid": "<uuid>",
    "name": "<name>",
    "rating": <rating>,
    "num-ratings": "<num-ratings>",
    "tags": ["<tag1>", "<tag2>", ...],
    "owner": "<userid>",
    "public": true | false,
    "deck-version": "<deck-version>",
    "user-data-version": "<user-data-version>",
    "created": "<created>"
    "last-update": "<last-update>",
    "last-update-device": "<last-update-device>"
}
```

Response description:
- `uuid`: the unique identifier for the deck.
- `name`: the name of the deck
- `rating`: the deck rating (integer representing total net likes)
- `num-ratings`: the number of ratings this deck has
- `tags`: a list of strings describing the contents of the deck
- `owner`: the user id of the owner of the deck
- `public`: describes whether or not the deck is publicly accessible (i.e. via discovery)
- `deck-version`: the current deck version
- `user-data-version`: the current version for user information (e.g. cards marked "needs review")
- `created`: ISO format UTC datetime string describing the creation time of the deck
- `last-update`: ISO format UTC datetime string describing the time of the most recent deck update
- `last-update-device`: the name of the device that last modified the deck (this is only available for decks that are owned by the requester)

### Full Response
This response includes all of the data from the metadata response and also contains the cards of the deck.
```
{
    <metadata response key-values>,
    ...
    "cards": [
        {
            "uuid": "<uuid>",
            "front": "<front>",
            "back": "<back>",
            "needs-review": true | false,
            "position": <position>
        },
        ...
    ]
}
```

Response description:
- `cards`: a list of cards, not necessarily in the order they appear in the deck
- `uuid`: the unique identifier for a specific card
- `front`: the text on the front of the card
- `back`: the text on the back of the card
- `needs-review`: describes whether or not the card has been marked by the user
- `position`: number representing the index of the card in the deck (0-based)