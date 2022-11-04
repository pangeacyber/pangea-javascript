import { useState } from "react";
import { Branding, PangeaAuth } from "./types";

export const useBranding = (
  auth: PangeaAuth
): {
  config: Partial<Branding.Config>;
  loading: boolean;
} => {
  const [config, setConfig] = useState<Partial<Branding.Config>>({});
  const [loading, setLoading] = useState(false);

  // FIXME: Need to setup clientId, and determine exactly how we want fetching to work.
  return { config, loading };
};
