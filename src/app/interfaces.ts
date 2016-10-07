export interface Show {
  id: number;
  name: string;
  nextEpisode?: Object;
}

export interface Episode {
  airdate: string;
  airstamp: string;
  name: string;
  season: number;
  number: number;
  url: string;
}