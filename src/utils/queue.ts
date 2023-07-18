import { type ILinkedListIter, LinkedList } from './linkedList'

export class Queue<T> {
  private queueList: LinkedList<T>
  private headIter: ILinkedListIter<T>
  private tailIter: ILinkedListIter<T>

  constructor(){
    this.queueList = new LinkedList<T>()
    this.headIter = this.queueList.iter()
    this.tailIter = this.queueList.iter(true)
  }
  
  /**
   * 向队头添加元素
   * @param value 
   */
  add(value: T){
    this.headIter.add(value)
  }
  /**
   * 读取队尾元素
   * @returns 
   */
  get(){
    if(this.tailIter.value()===null){
      this.tailIter.previous()
    }
    return this.tailIter.value()
  }
  /**
   * 删除并返回队尾元素
   * @returns 
   */
  remove(){
    if(this.tailIter.value()===null){
      this.tailIter.previous()
    }
    const v = this.tailIter.value()
    this.tailIter.remove()
    if(this.tailIter.hasPrevious()){
      this.tailIter.previous()
    }
    return v
  }
  isEmpty(){
    return this.queueList.size() === 0
  }
}