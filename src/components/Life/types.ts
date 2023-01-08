/**
 * 选择集合key为y，Set值为x
 */
export type SetList = { [index: number]: Set<number> }
export interface Select{
  x: number;
  y: number
}
export type SelectList = Array<Select>