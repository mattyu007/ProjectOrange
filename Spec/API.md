# API
Server-side API routes.
- [User Management](#user-management)
    - [User Creation](#user-creation)
    - [User Authentication](#user-authentication)
    - [User Information](#user-information)
- [Deck Manipulation](#deck-manipulation)
    - [Deck Creation](#deck-creation)
    - [Deck Edits](#deck-edits)
    - [Deck Overwrites](#deck-overwrites)
    - [Flagging Cards For Review](#flagging-cards-for-review)
    - [Share Code Generation](#share-code-generation)
    - [Fetch Deck UUID by Share Code](#fetch-deck-uuid-by-share-code)
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

Any unauthorized requests will receive a 401 response. All routes require authentication (with a
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
    "device": "<devicename>",
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
    "device": "<device_name>",
    "parent_deck_version": "<parent-deck-version>",
    "parent_user_data_version" "<parent-user-data-version>",
    "name": "<name>",
    "public": true | false,
    "unshare": true,
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
- `device`: the name of the device
- `parent_deck_version` (required): the current version of the deck
- `parent_user_data_version` (required): the current version of the user data for the deck
- `name`: the name that the deck will be changed to
- `public`: determines whether or not the deck should be discoverable by other users
- `unshare`: nullifies the deck's share code if it exists
- `tags`: the new list of strings that describe the deck
- `actions`: a list of actions (add, edit, delete) as described below

Add action:
```
{
    "action": "add",
    "front": "<Q>",
    "back": "<A>",
    "position", <pos>,
    "needs_review": true | false
}
```

Edit action:
```
{
    "action": "edit",
    "card_id": "<card-id>"
    "front": "<Q>",
    "back": "<A>",
    "position": <pos>,
    "needs_review": true | false
}
```

Delete action:
```
{
    "action": "delete",
    "card_id": "<card-id>"
}
```

Response: [Standard Full Deck Response](#full-response)

### Deck Overwrites
This route will allow a deck to be overwritten. This can be handy when there is a version conflict and the client opts to keep the version that was not synchronized with the server. This route is almost identical to the route for deck creation (with some minor differences).

When this route is used, all existing ratings for the deck will be maintained. It should be noted that this operation can only be done by the owner of the deck.

Request:
```
POST /api/v1/deck/<uuid>
{
    "name": "<deckname>",
    "tags": ["<tag1>", "<tag2>", ...],
    "public": true | false,
    "device": "<devicename>",
    "cards": [
        {
            "uuid": "<uuid>" | null,
            "front": "<Q>",
            "back": "<A>",
            "position": "<P>",
            "needs_review": true | false
        },
        ...
    ]
}
```
Request description:
- `name`: the name of the deck
- `tags`: a list of strings that can be searched on
- `public`: describes whether the deck should be publicly discoverable or not
- `device`: name of the device
- `cards`: a list of objects representing cards. The order of the cards in the array will reflect their position in the deck.
    - `uuid`: the UUID for an existing card, if the card is new then `null`
    - `front`: the text on the front of the card
    - `back`: the text on the back of the card
    - `position`: position of the card in the deck
    - `needs_review` (optional): indicates if the user wants to mark the card as needs review

Response: [Standard Full Deck Response](#full-response)

### Flagging Cards For Review
This route allows cards to be marked with a flag for further review.

Request:
```
PUT /api/v1/deck/<uuid>/flag
{
    "device": "<device_name>",
    "parent_deck_version": "<parent-deck-version>",
    "parent_user_data_version": "<parent-user-data-version>",
    "actions": [
        {
            "card_id": "<card-id>",
            "needs_review": true | false
        },
        ...
    ]
}
```

Request description:
- `uuid`: the unique identifier for the deck whose cards are being flagged
- `device`: the name of the device
- `parent_deck_version`: the current version of the deck
- `parent_user_data_version`: the current version of user data for the deck
- `actions`: a list of dictionaries describing whether to flag or unflag specific cards
- `card_id`: the unique identifier for a specific card
- `needs_review`: boolean indicating whether the cards flag should be set (true) or not (false)

Response:
```
{
    user_data_version: <user-data-version>
}
```
Here, `<user-data-version>` indicates the new version of the user data for the deck.

### Share Code Generation
This route generates a deck-specific code. The owner of the deck can share this code with other users so that they can add the decks to their libraries without the deck needing to be public.

Request:
```
GET /api/v1/deck/<uuid>/code
```

Response:
```
{
    "share_code": "<share-code>"
}
```

### Fetch Deck UUID by Share Code
Get a Deck's UUID via its share code.

Request:
```
GET /api/v1/deck/uuid/<share_code>
```

Response
```
{
    "uuid": "<uuid>"
}
```

## Synchronization
Synchronize decks.

### Deck Fetch
Request:
```
GET /api/v1/deck/<uuid>[?share_code=<share_code>]
```
Where `<uuid>` is the unique identifier for the deck being fetched.
If a non-public deck that the user does not own is being requested, the deck's share code must be
provided otherwise the user will not be authorized to view it.

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
    "uuid": "<uuid>",
    "device": "<device_name>"[,
    "share_code": "<share_code>"]
}
```
Where `<uuid>` is the unique identifier for the deck being added and `<device_name>` is the name of the device that made the request.
If a deck is not public, it can be added via share code by passing the share code in the payload.
Note that `share_code` is only required for non-public decks.

Response: [Standard Metadata Deck Response](#metadata-response)

### Copy Remote Deck
```
POST /api/v1/library/copy
{
    "uuid": "<uuid>",
    "device": "<device_name>"
}
```
Where `<uuid>` is the unique identifier for the deck being copied and `<device_name>` is the name of the device that made the request.

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
GET /api/v1/discover/top[?page=<page>]
```
Where `page` is the page offset into the result set (1 by default).

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
GET /api/v1/discover/new[?page=<page>]
```
Where `page` is the page offset into the result set (1 by default).

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
GET /api/v1/discover/search?query=<query>[&page=<page>]
```
Response description:
- `query`: String used to search by deck name.
- `page`: is the page offset into the result set (1 by default).

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
    "num_ratings": "<num-ratings>",
    "num_cards": <num-cards>,
    "tags": ["<tag1>", "<tag2>", ...],
    "owner": "<userid>",
    "author": "<author>" | null,
    "public": true | false,
    "deck_version": "<deck-version>",
    "user_data_version": "<user-data-version>" | null,
    "created": "<created>"
    "last_update": "<last-update>",
    "last_update_device": "<last-update-device>" | null,
    "share_code": "<share-code>" | null,
    "deleted": true | false,
    "accession": "public" | "private" | "shared" | null,
    "accessible": true | false
}
```

Response description:
- `uuid`: the unique identifier for the deck.
- `name`: the name of the deck
- `rating`: the deck rating (integer representing total net likes)
- `num_ratings`: the number of ratings this deck has
- `num_cards`: the number of cards in the deck
- `tags`: a list of strings describing the contents of the deck
- `owner`: the user id of the owner of the deck
- `author`: the name of the owner of the deck (or null if not set)
- `public`: describes whether or not the deck is publicly accessible (i.e. via discovery)
- `deck_version`: the current deck version
- `user_data_version`: the current version for user information (null if deck is not a part of the user's library)
- `created`: ISO format UTC datetime string describing the creation time of the deck
- `last_update`: ISO format UTC datetime string describing the time of the most recent deck update
- `last_update_device`: the name of the device that last modified the deck (null if the deck is not in the user's library)
- `share_code`: the code that can be entered by users to gain access to a remote private deck (null if a code has not been requested yet)
- `deleted`: boolean indicating whether or not a deck has been deleted by the owner
- `accession`: string indicating how the deck became part of the user's library (null if the deck is not a part of the user's library)
- `accessible`: boolean indicating whether or not a deck is still retrievable given its current state and the user's accession

*Note*: if the `deleted` flag is set to true in the response, the client should not expect to receive any other metadata about the deck (with the exception of `name` and `uuid`).

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
            "needs_review": true | false,
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
- `needs_review`: describes whether or not the card has been marked by the user
- `position`: number representing the index of the card in the deck (0-based)
