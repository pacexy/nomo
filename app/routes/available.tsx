import npmName from 'npm-name'
import { LoaderFunction } from 'remix'

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const name = url.searchParams.get('name')
  if (!name) return null

  try {
    return await npmName(name)
  } catch (err) {
    console.error(err)
    return null
  }
}
