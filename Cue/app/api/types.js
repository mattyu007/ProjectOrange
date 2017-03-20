// @flow

export type Card = {
  uuid: string,
  front: string,
  back: string,
  needs_review: boolean,
  position: number
};

export type DeckMetadata = {
  uuid: string,
  name: string,
  author: string,
  rating: number,
  num_ratings: number,
  num_cards: number,
  tags: Array<string>,
  owner: string,
  public: boolean,
  deck_version: number,
  user_data_version?: number,
  created: Date,
  last_update: Date,
  last_update_device?: string,
  share_code?: string,
  deleted: boolean,
  accession?: string,
};

export type Deck = DeckMetadata & {
  cards: Array<Card>
};

export type Library = {
	decks: Array<Deck>
}
