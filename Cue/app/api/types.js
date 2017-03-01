// @flow

export type Card = {
  uuid: string,
  front: string,
  back: string,
  needsReview: boolean,
  position: number
};

export type Deck = {
  uuid: string,
  name: string,
  rating: number,
  numRatings: number,
  tags: Array<string>,
  owner: string,
  public: boolean,
  deckVersion: number,
  userDataVersion: number,
  created: Date,
  lastUpdate: Date,
  lastUpdateDevice?: string,
  shareCode?: string,
  deleted: boolean,
  cards: Array<Card>
};

export type Library = {
	decks: Array<Deck>
}