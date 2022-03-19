import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator'
import { langCode } from '@translate-tools/core/types/Translator'
import { LoaderFunction } from 'remix'

const translator = new GoogleTranslator()

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)

  const text = url.searchParams.get('text')
  const tos = url.searchParams.getAll('to')

  if (!text) return null
  const data = await Promise.all(
    tos.map((to) => translator.translate(text, 'auto', to as langCode)),
  )

  return data
}
