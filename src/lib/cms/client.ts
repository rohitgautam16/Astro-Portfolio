import type { CMSAdapter } from "./types";
import { LocalCMSAdapter } from "./adapters/local";
import { SanityCMSAdapter } from "./adapters/sanity";

let cachedClient: CMSAdapter | null = null;

export function getCMSClient(): CMSAdapter {
  if (cachedClient) return cachedClient;

  const sanityProjectId = process.env.SANITY_PROJECT_ID || import.meta.env.SANITY_PROJECT_ID;
  const sanityDataset = process.env.SANITY_DATASET || import.meta.env.SANITY_DATASET;
  const sanityToken = process.env.SANITY_API_TOKEN || import.meta.env.SANITY_API_TOKEN;

  if (sanityProjectId) {
    cachedClient = new SanityCMSAdapter({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      token: sanityToken,
    });
  } else {
    cachedClient = new LocalCMSAdapter();
  }

  return cachedClient;
}

export * from "./types";
