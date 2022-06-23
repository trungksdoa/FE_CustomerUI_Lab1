import { District } from './district'

export interface City {
  matp: number
  name: string
  type: string
  slug: string
  quanhuyen: Array<District>
}
