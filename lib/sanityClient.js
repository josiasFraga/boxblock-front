import sanityClient from '@sanity/client'


const token = process.env.NEXT_PUBLIC_SANITY_API_TOKEN
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

export const client = sanityClient({
  projectId: projectId,
  dataset: 'production',
  apiVersion: '2021-03-25',
  useCdn: false,
  token: token,
})
