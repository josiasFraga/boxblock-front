import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'bapkmvpq',
  dataset: 'production',
  apiVersion: '2021-03-25',
  useCdn: false,
  token:
    'skefeVNtX6k6nRPj3goONf9PTaGAeK2H80o9pb30jXH2bo1yc2lSd8GfxPOXRz4iEWOU6vlIRyl2rHPm7jULGZ6Q7qqB2tAvyGsP0xdKonwguwGZmDSzmLy8QkQO12vnhoo4LBp7gyLJ86O4tApIxF3tbxuALuJzx5jFkJ5ElOSxIQtkgLDz',
})
