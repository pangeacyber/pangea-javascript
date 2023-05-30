/* eslint-disable no-console */

import {
  PangeaConfig,
  URLIntelService,
  PangeaErrors,
  DomainIntelService,
} from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const urlIntel = new URLIntelService(String(token), config);
const domainIntel = new DomainIntelService(String(token), config);

const defangedSchemes = {
  "http:": "hxxp:",
  "https:": "hxxps:",
};

function defangURL(urlString) {
  const url = new URL(urlString);
  const defangedScheme = defangedSchemes[url.protocol];
  if (defangedScheme) {
    return urlString.replace(url.protocol, defangedScheme);
  }
  return urlString;
}

function getDomain(urlString) {
  const url = new URL(urlString);
  return url.hostname;
}

(async () => {
  console.log("Checking url...");
  const url = "http://113.235.101.11:54384";

  try {
    let options = { provider: "crowdstrike", verbose: true, raw: true };
    let response = await urlIntel.reputation(url, options);
    if (response.result.data.verdict == "malicious") {
      console.log("Defanged URL: ", defangURL(url));
    } else {
      const domain = getDomain(url);
      options = { provider: "domaintools", verbose: true, raw: true };
      response = await domainIntel.reputation(domain, options);
      if (response.result.data.verdict == "malicious") {
        console.log("Defanged URL: ", defangURL(url));
      } else {
        console.log("URL seems to be secure: ", url);
      }
    }
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
