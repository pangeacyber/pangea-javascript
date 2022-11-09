import { useState, useEffect } from "react";
import { Branding, PangeaAuth } from "./types";

export const useBranding = (
  auth: PangeaAuth
): {
  config: Partial<Branding.Config>;
  loading: boolean;
  error: string | null;
} => {
  const [config, setConfig] = useState<Partial<Branding.Config>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth) return;
    if (auth?.clientToken && auth?.domain) {
      setError("Missing authentication clientToken or domain.");
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
      body: JSON.stringify({}),
    }).then(async (res) => {
      const data = await res.json();
      if (data.result) {
        setConfig(config);
        setError(null);
      } else
        setError(data.summary ?? "Unable to retrieve branding configuration");

      setLoading(false);
      return;
    });
  }, [auth?.clientToken, auth?.domain]);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  // FIXME: Need to setup clientId, and determine exactly how we want fetching to work.
  return { config, loading, error };
};
