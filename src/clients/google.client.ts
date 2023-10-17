import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

class GoogleClient {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
  }

  public getRedirectUrl() {
    const authorizeUrl = this.client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
    });

    return authorizeUrl;
  }

  public async getUser(code: string) {
    const tokenResponse = await this.client.getToken(code);
    this.client.setCredentials(tokenResponse.tokens);

    const accessToken = this.client.credentials.access_token;
    const idToken = this.client.credentials.id_token;

    const { data } = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    return data;
  }
}

export default new GoogleClient();
