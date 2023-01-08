/** item的类型 */
export interface Items {
  position: {
    left: number,
    top: number
  },
  size: {
    width: number,
    height: number
  },
  id?: string,
  direction: 'up' | 'down' | 'left' | 'right' | 'stop',
  crashSize?:number
}
/** item集合 */
export type ItemsList = Array<Items>