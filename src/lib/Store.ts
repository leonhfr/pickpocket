// Package.
import * as Conf from 'conf';

// Code.
export class Store {
  store: Conf;

  constructor() {
    this.store = new Conf();
  }

  getAccessToken(): string | undefined {
    const maybeToken = this.store.get('token');
    return maybeToken ? maybeToken : undefined;
  }

  setAccessToken(token: string): void {
    this.store.set('token', token);
  }

  getUsername(): string | undefined {
    const maybeUsername = this.store.get('username');
    return maybeUsername ? maybeUsername : undefined;
  }

  setUsername(username: string): void {
    this.store.set('username', username);
  }

  getLastChecked(): number | undefined {
    const maybeLastChecked = this.store.get('lastChecked');
    return maybeLastChecked ? maybeLastChecked : undefined;
  }

  setLastChecked(lastChecked: number): void {
    this.store.set('lastChecked', lastChecked);
  }
}
