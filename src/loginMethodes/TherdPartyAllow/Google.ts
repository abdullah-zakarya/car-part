import axios from 'axios';
import { OAuthArgu } from '../../../types/types';
import OAuthProvider from './OAuthProvider';

class GoogleOAuth extends OAuthProvider {
  protected async getAccessToken(obj: OAuthArgu): Promise<string> {
    const { authCode, redirect_uri } = obj;
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        code: authCode,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_CLEINT_SECRET,
        redirect_uri,
        grant_type: 'authorization_code',
      }
    );

    return tokenResponse.data.access_token;
  }

  protected async getUserInfo(
    accessToken: string
  ): Promise<{ name: string; email: string; photo: string }> {
    const userInfoResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      name: userInfoResponse.data.name,
      email: userInfoResponse.data.email,
      photo: userInfoResponse.data.picture,
    };
  }
}

export default GoogleOAuth;
