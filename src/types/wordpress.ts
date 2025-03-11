
export interface WordPressSite {
  id: string;
  name: string;
  url: string;
  username: string;
  // We'll store this securely, but need to represent it in our model
  applicationPassword?: string;
  token?: string;
  authType: 'application_password' | 'jwt';
  isConnected: boolean;
  lastConnected?: Date;
}

export interface WordPressConnectionCredentials {
  url: string;
  username: string;
  applicationPassword?: string;
  token?: string;
  authType: 'application_password' | 'jwt';
}
