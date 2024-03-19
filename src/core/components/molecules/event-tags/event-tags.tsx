

import { type FC } from 'react'
import { EventUtils } from '../../../events/event-utils'
import { AnchorTag } from '../../atoms/anchor-tag/anchor-tag'

type Props = {
    url: string,
    tags: string[]
}

export const EventTags: FC<Props> = ({ url, tags }) => {
    const searchParams = new URL(url).searchParams
    const selected = searchParams.getAll('tag')

    return (
        <section className="w-[88vw] sm:w-[94vw] md:w-full overflow-auto mb-4">
            <section className="flex md:flex-wrap gap-1 mb-4">
                {
                    tags.map(tag => (
                        <AnchorTag
                            href={EventUtils.getLink(new URL(url), tag)}
                            active={selected.includes(tag)}
                        >
                            {tag}
                        </AnchorTag>
                    ))
                }
            </section>
        </section>
    )
}