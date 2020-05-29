// Package.
import * as inquirer from 'inquirer';
import fetch from 'node-fetch';
import { v4 as uuid } from 'uuid';

// Internal.
import { Store } from './Store';
import { AccessToken, RequestToken } from '../types';

// Constants.
import {
  REDIRECT_URL,
  POCKET_CONSUMER_KEY,
  POCKET_HEADERS,
  POCKET_URL_AUTHORIZE,
  POCKET_URL_REQUEST,
  getPocketAuthenticationUrl as getPocketAuthorizationUrl,
} from '../constants';

// Code.
export class Authorization {
  static async authorize(store: Store) {
    const storedAccessToken = store.getAccessToken();
    if (storedAccessToken) {
      await this.promptContinuation();
    }
    const state = uuid();
    const requestToken = await this.getRequestToken(state);
    await this.promptAuthorization(requestToken);
    const { accessToken, username } = await this.getAccessToken(
      requestToken,
      state
    );
    store.setAccessToken(accessToken);
    store.setUsername(username);
    console.log('Authorization successful!');
  }

  private static async getRequestToken(state: string): Promise<string> {
    console.log('Requesting a token from Pocket...');
    const input = {
      method: 'POST',
      body: JSON.stringify({
        consumer_key: POCKET_CONSUMER_KEY,
        redirect_uri: REDIRECT_URL,
        state,
      }),
      headers: POCKET_HEADERS,
    };
    const tokenResponse = await fetch(POCKET_URL_REQUEST, input);
    if (tokenResponse.status !== 200) {
      throw new Error(
        `Pocket returned error ${tokenResponse.status}, aborting...`
      );
    }
    const token: RequestToken = await tokenResponse.json();
    this.validateState(state, token.state);
    console.log('Obtained a request token!');
    return token.code;
  }

  private static async getAccessToken(
    requestToken: string,
    state: string
  ): Promise<{ accessToken: string; username: string }> {
    console.log('Requesting an access token from Pocket...');
    const input = {
      method: 'POST',
      body: JSON.stringify({
        consumer_key: POCKET_CONSUMER_KEY,
        code: requestToken,
      }),
      headers: POCKET_HEADERS,
    };
    const tokenResponse = await fetch(POCKET_URL_AUTHORIZE, input);
    if (tokenResponse.status !== 200) {
      throw new Error(
        `Pocket returned error ${tokenResponse.status}, aborting...`
      );
    }
    const token: AccessToken = await tokenResponse.json();
    this.validateState(state, token.state);
    console.log('Obtained a request token!');
    return {
      accessToken: token.access_token,
      username: token.username,
    };
  }

  private static async promptAuthorization(requestToken: string) {
    const url = getPocketAuthorizationUrl(requestToken);
    console.log(
      'To continue the process, open the following link and authorize the app on your Pocket account.'
    );
    console.log(url);
    await inquirer.prompt([
      {
        type: 'confirm',
        name: 'authorized',
        message: 'Is pickpocket authorized on Pocket?',
        default: true,
      },
    ]);
  }

  private static async promptContinuation() {
    await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: 'A token already exists, continuing will delete it. Proceed?',
        default: false,
      },
    ]);
  }

  private static validateState(state: string, receivedState: string): void {
    if (state !== receivedState) {
      throw new Error(
        `The states don't match: got "${receivedState}", expected "${state}"`
      );
    }
  }
}
