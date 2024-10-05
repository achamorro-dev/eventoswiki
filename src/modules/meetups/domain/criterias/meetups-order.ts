import type { OrderDirection } from '@/modules/shared/domain/criteria/order-direction'

export interface MeetupsOrder {
  startsAt: OrderDirection
  endsAt: OrderDirection
}
