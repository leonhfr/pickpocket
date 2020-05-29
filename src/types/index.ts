export interface Options {
  version: string;
  force?: boolean;
  // mode: string;
  output?: string;
  // source?: boolean;
  // tags?: string;
}

export interface RequestToken {
  code: string;
  state: string;
}

export interface AccessToken {
  access_token: string;
  username: string;
  state: string;
}

// export interface GetMarkdownInput {
//   url: string;
//   timeAdded: number;
//   title?: string;
//   timeToRead?: number;
//   wordCount?: number;
// }

export interface PocketRetrieveInput {
  consumer_key: string;
  access_token: string;
  state?: PocketState;
  favorite?: PocketFavorite;
  tag?: string; // filter, or _untagged_
  sort?: PocketSort;
  detailType: 'simple'; // 'complete'
  search?: string; // url or title contains the string
  domain?: string; // only domain
  since?: number; // since unix timestamp (s)
  count?: number;
  offset?: number; // only with count, start from offset
}

export enum PocketState {
  Unread = 'unread', // default
  Archive = 'archive',
  All = 'all',
}

export enum PocketFavorite {
  OnlyUnfavorite = 0,
  OnlyFavorite = 1,
}

export enum PocketSort {
  Newest = 'newest',
  Oldest = 'oldest',
  Title = 'title', // title alphabetically
  Site = 'site', // url alphabetically
}

export interface PocketRetrieveOutput {
  status: number;
  complete: number;
  list: {
    [key: string]: {
      given_url: string;
      given_title: string;
      favorite: string;
      status: string;
      time_added: string;
      time_updated: string;
      time_read: string;
      time_favorited: string;
      resolved_title: string;
      resolved_url: string;
      excerpt: string;
      word_count: string;
      lang: string;
      time_to_read: string;
    };
  };
  error: any;
  since: number;
}
