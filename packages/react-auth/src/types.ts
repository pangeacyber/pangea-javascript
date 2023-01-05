// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

export interface ClientConfig {
  clientToken: string;
  domain: string;
}

export type Profile = {
  first_name: string;
  last_name: string;
};

export type AuthUser = {
  profile: Profile;
  token: string;
  life: number;
  pool: string;
  identity: string;
  scopes: Array<string>;
};

export type AppState = {
  userData: AuthUser;
  returnPath: string;
};
