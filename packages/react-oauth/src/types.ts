export interface AppState {
  /**
   * The current user data
   */
  userData?: any; // import type from oauth-js?

  /**
   * The path to return the user to after authentication
   */
  returnPath: string;
}
