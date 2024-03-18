

import { type FC } from 'react'
import { EventUtils } from '../../../events/event-utils'

type Props = {
    url: string,
    tagsEvents: string[]
}

export const Tags: FC<Props> = ({ url, tagsEvents }) => {
    const searchParams = new URL(url).searchParams
    const tags = searchParams.getAll('tag')

    return (
        <section className="flex flex-wrap gap-1 mb-8">
            {
                tagsEvents.map(tag => (
                    <a
                        href={EventUtils.getLink(new URL(url), tag)}
                        className={`inline-flex items-center px-3 py-1.5 leading-none w-auto rounded-full text-xs font-bold uppercase border hover:bg-gray-100 dark:text-white dark:hover:text-slate-900 ${tags.includes(tag) && '!bg-primary !text-white border-primary'}`}
                    >
                        {tag}
                    </a>
                ))
            }
        </section>
    )
}