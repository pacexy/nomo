import { debounce } from '@github/mini-throttle'
import clsx from 'clsx'
import latinize from 'latinize'
import { useEffect, useState } from 'react'
import { SiNpm } from 'react-icons/si'
import { useFetcher } from 'remix'
import { objectKeys } from 'ts-extras'

export const langs = {
  en: 'English',
  fr: 'French',
  de: 'German',
  es: 'Spanish',
  it: 'Italian',
  eo: 'Esperanto',
}

export default function Index() {
  const t = useFetcher()

  return (
    <div className="flex flex-col items-center gap-6 pt-8">
      <h1 className="flex items-center gap-4 typescale-headline-small">
        <img src="nomo.png" alt="" width={32} />
        <span>nomo</span>
      </h1>
      <t.Form method="get" action="/translate">
        <input
          name="text"
          onChange={debounce((e) => t.submit(e.target.form), 500)}
          className="mb-6 p-4 bg-surface1 typescale-title-large"
        />
        <ul className="space-y-4">
          {objectKeys(langs).map((code, i) => (
            <Item key={i} code={code} translated={t.data?.[i]} />
          ))}
        </ul>
      </t.Form>
    </div>
  )
}

export const Item: React.FC<{
  code: keyof typeof langs
  translated?: string
}> = ({ code, translated }) => {
  const [available, setAvailable] = useState<boolean | undefined | null>()
  const formatted =
    translated && latinize(translated).toLowerCase().replace(/ /g, '-')

  useEffect(() => {
    setAvailable(undefined)
  }, [translated])

  useEffect(() => {
    if (!formatted) return
    fetch(`/available?name=${formatted}`)
      .then((r) => r.json())
      .then((r) => setAvailable(r))
  }, [formatted])

  return (
    <li className="flex h-12 justify-between">
      <div className="flex w-24 flex-col justify-center gap-1">
        <label className="text-outline typescale-body-medium">
          {langs[code]}
          <input type="hidden" name="to" value={code} />
        </label>
        <SiNpm
          size={20}
          className={clsx(
            'transition',
            typeof available !== 'boolean'
              ? 'text-surface-variant'
              : available
              ? 'text-primary/40'
              : 'text-error/60',
          )}
        />
      </div>
      {translated && (
        <div className="text-right">
          <div className="text-on-surface typescale-title-large">
            {translated}
          </div>
          <div className="text-on-surface-variant">{formatted}</div>
        </div>
      )}
    </li>
  )
}
