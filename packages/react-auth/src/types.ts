// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

export interface ClientConfig {
  clientToken: string;
  domain: string;
}

export type Profile = {
  first_name: string;
  last_name: string;
  phone: string;
};

export type AuthUser = {
  id?: string;
  identity?: string;
  token?: string;
  type?: string;
  email?: string;
  life?: number;
  expire?: string;
  scopes: string[];
  lifetime?: string;
  created_at?: string;
  profile: Profile;
};

export type AppState = {
  userData: AuthUser;
  returnPath: string;
};
