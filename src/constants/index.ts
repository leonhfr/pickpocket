// Redirect URL.
export const REDIRECT_URL = 'https://www.github.com/leonhfr/'; // Replace with GH

// Pocket API.
export const POCKET_CONSUMER_KEY = '91606-3fe4eda51e069280ddab217f';

export const POCKET_HEADERS = {
  'Content-Type': 'application/json; charset=UTF-8',
  'X-Accept': 'application/json',
};

export const POCKET_URL = 'https://getpocket.com/v3';
export const POCKET_URL_AUTHORIZE = `${POCKET_URL}/oauth/authorize`;
export const POCKET_URL_GET = `${POCKET_URL}/get`;
export const POCKET_URL_REQUEST = `${POCKET_URL}/oauth/request`;

export const getPocketAuthenticationUrl = (requestToken: string) =>
  `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${REDIRECT_URL}`;
