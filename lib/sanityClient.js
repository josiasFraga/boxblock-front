import sanityClient from '@sanity/client'


const token = process.env.SANITY_API_TOKEN
const projectId = process.env.SANITY_API_TOKEN

export const client = sanityClient({
  projectId: projectId,
  dataset: 'production',
  apiVersion: '2021-03-25',
  useCdn: false,
  token: token,
})
