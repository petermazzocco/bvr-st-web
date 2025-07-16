import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "zw1ewafw",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export const writeClient = createClient({
  projectId: "zw1ewafw",
  dataset: "production",
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

export const readClient = createClient({
  projectId: "zw1ewafw",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});
