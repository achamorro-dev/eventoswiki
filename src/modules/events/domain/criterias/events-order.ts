import type { OrderDirection } from '@/modules/shared/domain/criteria/order-direction'

export interface EventsOrder {
  startsAt: OrderDirection
  endsAt: OrderDirection
}
