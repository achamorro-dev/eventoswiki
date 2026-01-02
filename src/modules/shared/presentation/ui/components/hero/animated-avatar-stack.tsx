'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Organization } from '@/organizations/domain/organization'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'

interface Props {
  organizations: Primitives<Organization>[]
}

export const AnimatedAvatarStack = ({ organizations }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused] = useState(false)

  useEffect(() => {
    if (organizations.length <= 1 || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % organizations.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [organizations.length, isPaused])

  if (organizations.length === 0) {
    return null
  }

  const stackSize = Math.min(3, organizations.length)
  const indexes = Array.from({ length: stackSize }, (_, i) => {
    return (currentIndex - (stackSize - 1 - i) + organizations.length) % organizations.length
  })

  const offsets = [-16, -4, 8]

  return (
    <div className="relative size-24">
      <AnimatePresence initial={false}>
        {indexes.map((orgIdx, i) => {
          const org = Organization.fromPrimitives(organizations[orgIdx])
          // El más arriba debe estar al final del array (z-index mayor)
          const z = 10 + i
          return (
            <motion.div
              key={orgIdx}
              initial={{ opacity: 0, scale: 0.8, y: offsets[i] }}
              animate={{ opacity: 1, scale: 1, y: offsets[i] }}
              exit={{ opacity: 0, scale: 0.8, y: offsets[i] }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: z }}
            >
              <Avatar className="shadow-lg transition-transform">
                <AvatarImage src={org.imageUrlString()} />
                <AvatarFallback className="text-xl">{org.firstNameLetter()}</AvatarFallback>
              </Avatar>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
