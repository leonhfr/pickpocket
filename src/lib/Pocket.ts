// Package.
import fetch from 'node-fetch';

// Internal.
import { Markdown } from './Markdown';
import { Store } from './Store';
import { Options, PocketRetrieveInput, PocketRetrieveOutput } from '../types';

// Constants.
import {
  POCKET_CONSUMER_KEY,
  POCKET_HEADERS,
  POCKET_URL_GET,
} from '../constants';

// Code.
export class Pocket {
  static async run(store: Store, options: Options) {
    console.log('Fetching articles from Pocket...');
    const accessToken = store.getAccessToken();
    if (!accessToken) {
      throw new Error('Token not defined.');
    }
    const lastChecked = store.getLastChecked() || 0;

    const response = await this.get(accessToken, lastChecked);
    const urls = Object.values(response.list).map(
      (article) => article.resolved_url
    );
    console.log(urls);
    for (const url of urls) {
      await Markdown.get(url, options);
    }
    store.setLastChecked(Math.round(Date.now() / 1000));
  }

  private static async get(
    accessToken: string,
    since: number
  ): Promise<PocketRetrieveOutput> {
    const input: PocketRetrieveInput = {
      consumer_key: POCKET_CONSUMER_KEY,
      access_token: accessToken,
      detailType: 'simple',
      since,
    };
    const response = await fetch(POCKET_URL_GET, {
      method: 'POST',
      body: JSON.stringify(input),
      headers: POCKET_HEADERS,
    });
    if (response.status !== 200) {
      throw new Error(`Pocket returned error ${response.status}, aborting...`);
    }
    const output: PocketRetrieveOutput = await response.json();
    return output;
  }
}
