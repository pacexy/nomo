import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator'
import { langCode } from '@translate-tools/core/types/Translator'
// @ts-ignore
import Kuroshiro from 'kuroshiro'
// @ts-ignore
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import { LoaderFunction } from 'remix'

const translator = new GoogleTranslator()
const kuroshiro = new Kuroshiro()

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)

  const text = url.searchParams.get('text')
  const tos = url.searchParams.getAll('to')

  if (!text) return null
  const data = await Promise.all(
    tos.map(async (to) => {
      let result = await translator.translate(text, 'auto', to as langCode)
      if (to === 'ja') {
        await kuroshiro.init(
          new KuromojiAnalyzer({
            dictPath: __dirname + '/../dict',
          }),
        )
        result = await kuroshiro.convert(result, {
          to: 'romaji',
          mode: 'normal',
          romajiSystem: 'passport',
        })
      }
      return result
    }),
  )

  return data
}
