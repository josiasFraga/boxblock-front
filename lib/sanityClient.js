import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'bapkmvpq',
  dataset: 'production',
  apiVersion: '2021-03-25',
  useCdn: false,
  token:
    'sk4kM1mTItm2pqesekOGekJ8nwRUPTmKFxAFuCfWz3tbQm7mXdAPWZOgnjFrMuiVqZuArLvy4oPLFABqkNo4LlO5SEoi0wrPqJwSNwOaHd5Ha02jPBJSdnBJqhdoYdb5tddh2G5pNB0Mmw6TAcK0q9JTou3RoFOgdMVlJLVunJoVWxwnSY72',
})
