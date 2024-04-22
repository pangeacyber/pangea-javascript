import { useState, useEffect } from "react";
import { Branding, PangeaAuth } from "./types";
import {
  fetchBrandingConfig,
  getBrandingConfig,
  setBrandingConfig,
} from "./utils";

export const useBranding = (
  auth: PangeaAuth | undefined,
  brandingId: string | undefined
): {
  config: Partial<Branding.Config> | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
} => {
  const [config, setConfig] = useState<Partial<Branding.Config> | null>(
    getBrandingConfig()
  );
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!auth && !brandingId) return;
    if (!auth?.clientToken || !auth?.domain) {
      setError(
        "Invalid authentication. Both clientToken and domain are required."
      );
      return;
    }
    if (!brandingId) {
      setError(
        "Missing brandingId. Authentication provider, but id is required to fetch branding."
      );
      return;
    }

    const storedBrandingConfig = getBrandingConfig();
    if (storedBrandingConfig && storedBrandingConfig.id === brandingId) {
      setUpdating(true);
      setConfig(storedBrandingConfig);
    } else {
      setLoading(true);
    }

    fetchBrandingConfig(auth, brandingId)
      .then((config) => {
        setBrandingConfig(config);
        setConfig(config);
        setError(null);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setUpdating(false);
        setLoading(false);
      });
  }, [auth?.clientToken, auth?.domain, brandingId]);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  // FIXME: Need to setup clientId, and determine exactly how we want fetching to work.
  return { config, loading, updating, error };
};
