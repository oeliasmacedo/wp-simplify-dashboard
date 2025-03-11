
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

// WordPress Post type
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  categories?: number[];
  tags?: number[];
}

// WordPress Page type
export interface WordPressPage extends Omit<WordPressPost, 'categories' | 'tags' | 'sticky'> {
  parent: number;
  menu_order: number;
}

// WordPress User type
export interface WordPressUser {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    [key: string]: string;
  };
  roles?: string[];
  capabilities?: {
    [key: string]: boolean;
  };
}

// WordPress Plugin type
export interface WordPressPlugin {
  plugin: string;
  status: string;
  name: string;
  plugin_uri: string;
  author: string;
  author_uri: string;
  description: {
    raw: string;
    rendered: string;
  };
  version: string;
  network_only: boolean;
  requires_wp: string;
  requires_php: string;
  textdomain: string;
}

// WordPress Theme type
export interface WordPressTheme {
  stylesheet: string;
  template: string;
  name: string;
  theme_uri: string;
  description: string;
  author: string;
  author_uri: string;
  version: string;
  status: string;
  tags: string[];
  text_domain: string;
}
