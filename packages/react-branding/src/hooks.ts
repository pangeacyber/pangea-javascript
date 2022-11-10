import { useState, useEffect } from "react";
import { Branding, PangeaAuth } from "./types";

export const useBranding = (
  auth: PangeaAuth | undefined,
  brandingId: string | undefined
): {
  config: Partial<Branding.Config> | null;
  loading: boolean;
  error: string | null;
} => {
  const [config, setConfig] = useState<Partial<Branding.Config> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    fetch(`https://authn.${auth.domain}/v1/resource/branding`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.clientToken}`,
      },
      body: JSON.stringify({
        id: brandingId,
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (data.result) {
        setConfig(data.result);
        setError(null);
      } else
        setError(data.summary ?? "Unable to retrieve branding configuration");

      setLoading(false);
      return;
    });
  }, [auth?.clientToken, auth?.domain, brandingId]);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  // FIXME: Need to setup clientId, and determine exactly how we want fetching to work.
  return { config, loading, error };
};
