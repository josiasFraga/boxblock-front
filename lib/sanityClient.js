import sanityClient from '@sanity/client'


const token =
  'sk4kM1mTItm2pqesekOGekJ8nwRUPTmKFxAFuCfWz3tbQm7mXdAPWZOgnjFrMuiVqZuArLvy4oPLFABqkNo4LlO5SEoi0wrPqJwSNwOaHd5Ha02jPBJSdnBJqhdoYdb5tddh2G5pNB0Mmw6TAcK0q9JTou3RoFOgdMVlJLVunJoVWxwnSY72'

const projectId = 'bapkmvpq'

export const client = sanityClient({
  projectId: projectId,
  dataset: 'production',
  apiVersion: 'v1',
  useCdn: false,
  token: token,
})
