import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag, revalidatePath } from 'next/cache'

export const revalidateProduct: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context?.disableRevalidate) {
    payload.logger.info(`Revalidating product global`)
    revalidateTag('global_product')
    revalidatePath('/product/[id]', 'page')
    revalidatePath('/products', 'page')
    revalidatePath('/', 'page')
  }
  return doc
} 