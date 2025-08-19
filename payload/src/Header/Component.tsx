import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'

export async function Header() {
  const globalFn = await getCachedGlobal('header', 1)
  let headerData: Header | null = null
  try {
    headerData = (await globalFn()) as Header
  } catch {
    headerData = null
  }

  return <HeaderClient data={headerData as Header} />
}
