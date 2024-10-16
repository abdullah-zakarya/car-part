import axios from 'axios';
import { OAuthArgu } from '../../../../../types/types';
import OAuthProvider from './OAuthProvider';

class GoogleOAuth extends OAuthProvider {
  protected async getAccessToken({
    authCode,
    redirect_uri,
  }: OAuthArgu): Promise<string> {
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      code: authCode,
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: process.env.GOOGLE_OAUTH_CLEINT_SECRET,
      redirect_uri,
      grant_type: 'authorization_code',
    });

    return data.access_token;
  }

  protected async getUserInfo(
    accessToken: string
  ): Promise<{ name: string; email: string; photo: string }> {
    const { data } = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return {
      name: data.name,
      email: data.email,
      photo: data.picture,
    };
  }
}

export default GoogleOAuth;
