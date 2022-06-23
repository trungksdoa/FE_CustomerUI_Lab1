import { ward } from "./ward"

export interface District {
  maqh: number
  name: string
  type: string
  phuongxa: Array<ward>
}
