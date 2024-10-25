/**
 * 链表迭代器
 */
export interface ILinkedListIter<T>{
  /**
   * 获取指针指向的结点值
   * @returns 
   */
  value: () => T|null
  /**
   * 修改指针指向的结点值
   * @param v 
   */
  setValue(v: T): void
  /**
   * 是否有上个非头结点
   * @returns 
   */
  hasPrevious: ()=> boolean
  /**
   * 是否有下个非尾结点
   * @returns 
   */
  hasNext: () => boolean
  /**
   * 指向上个非头结点
   * @returns 新结点值
   */
  previous: () => T | null
  /**
   * 指向下个非尾结点
   * @returns 新结点值
   */
  next: () => T | null
  /**
   * 向指针处插入一个值为value的新结点
   * @description 添加后指针仍指向新结点的前一个结点
   * @param value 
   * @returns 
   */
  add: (value: T) => void
  /**
   * 删除指针指向的结点
   * @returns 
   */
  remove: () => boolean
}
/**
 * 链表
 */
export interface ILinkedList<T> {
  /**
   * 获取迭代器指针
   * @param reverseFlag 指向尾结点
   * @returns 
   */
  iter: (reverseFlag?:boolean) => ILinkedListIter<T>
  /**
   * 连接链表
   * @param list 
   */
  subList(list: LinkedList<T>):void
  /**
   * 获取大小
   * @returns 
   */
  size: () => number
  /**
   * 
   * @returns 获取头结点
   */
  getHeadNode:() => ILinkedListNode<T>
  /**
   * 
   * @returns 获取尾结点
   */
  getTailNode:() => ILinkedListNode<T>
  /**
   * 根据索引访问元素，效率很低
   * @param index 索引
   * @returns 
   */
  get(index:number): T | null
}
/**
 * 链表元素节点
 */
export interface ILinkedListNode<T> {
  /**
   * 父节点
   */
  parent: ILinkedListNode<T> | null
  /**
   * 子节点
   */
  child: ILinkedListNode<T> | null
  /**
   * 值
   */
  self: T | null
}

class LinkedListNode<T> implements ILinkedListNode<T>{
  parent = null
  child = null
  self: T | null
  constructor(self?:T|null){
    this.self = self ?? null
  }
}

class LinkedListIter<T> implements ILinkedListIter<T>{
  private node: ILinkedListNode<T>
  private list: LinkedList<T>
  private reversed: boolean

  constructor (list:LinkedList<T>, reverseFlag?:boolean){
    this.node = reverseFlag ? list.getTailNode() : list.getHeadNode()
    this.list = list
    this.reversed = reverseFlag ?? false
  }

  add(value: T){
    if(this.reversed){
      const cnode = this.node.parent ?? null
      this.node.parent = new LinkedListNode(value)
      if(cnode) {
        cnode.child = this.node.parent
      }
      this.node.parent.child = this.node
      this.node.parent.parent = cnode
      this.list.setSize(this.list.size()+1)
    } else {
      const cnode = this.node.child ?? null
      this.node.child = new LinkedListNode(value)
      if(cnode){
        cnode.parent = this.node.child
      }
      this.node.child.parent = this.node
      this.node.child.child = cnode
      this.list.setSize(this.list.size()+1)
    }
  }
  remove(){
    //头尾结点禁止删除
    if(this.node.child === null || this.node.parent === null){
      return false
    }
    if(this.reversed) {
      this.node.parent.child = this.node.child
      this.node.child.parent = this.node.parent
      this.node = this.node.child
      this.list.setSize(this.list.size()-1)
      return true
    } else {
      this.node.child.parent = this.node.parent
      this.node.parent.child = this.node.child
      this.node = this.node.parent
      this.list.setSize(this.list.size()-1)
      return true
    }
  }
  value(){
    return this.node.self ?? null
  }
  setValue(v: T){
    if(this.node.child === null || this.node.parent === null){
      throw new Error("can not change head or tail")
    }
    this.node.self = v
  }
  hasPrevious(){
    return !!this.node.parent && this.node.parent.self !== null
  }
  hasNext(){
    return !!this.node.child && this.node.child.self !== null
  }
  previous(){
    if(!!this.node.parent && this.node.parent.self !== null){
      this.node = this.node.parent
    } else {
      throw new Error('outOfList')
    }
    return this.node.self ?? null
  }
  next(){
    if(!!this.node.child && this.node.child.self !== null){
      this.node = this.node.child
    } else {
      throw new Error('outOfList')
    }
    return this.node.self ?? null
  }
}
export class LinkedList<T> implements ILinkedList<T>{
  /**头结点，parent和self为null */
  private headNode: ILinkedListNode<T>
  /**尾结点，child和self为null*/
  private tailNode: ILinkedListNode<T>
  private length = 0

  constructor(list?:LinkedList<T> | Array<T>){
    this.headNode = new LinkedListNode<T>()
    this.tailNode = new LinkedListNode<T>()
    this.headNode.child = this.tailNode
    this.tailNode.parent = this.headNode
    this.fromList(list)
  }

  subList(list: LinkedList<T>){
    this.getTailNode().parent!.child = list.getHeadNode().child
    list.getHeadNode().child!.parent = this.getTailNode().parent
    this.tailNode = list.getTailNode()
    this.setSize(this.size()+list.size())
  }
  /**
   * 获取迭代器
   * @param reverseFlag 为true时指向尾结点
   * @returns 
   */
  iter(reverseFlag?:boolean){
    return new LinkedListIter<T>(this, reverseFlag)
  }
  /**
   * 获取头节点
   * @returns headNode
   */
  getHeadNode(){
    return this.headNode
  }
  /**
   * 获取尾节点
   * @returns tailNode
   */
  getTailNode(){
    return this.tailNode
  }
  /**
   * 获取链表长度
   * @returns size
   */
  size(){
    return this.length
  }
  /**
   * 设置链表长度，仅供iter使用
   * @param newV 
   * @returns 
   */
  setSize(newV: number){
    this.length = newV
    return true
  }
  /**
   * 根据索引访问元素，效率很低
   * @param index 索引
   * @returns 
   */
  get(index:number): T | null {
    const iter = this.iter()
    let i = 0
    while(iter.hasNext()){
      iter.next()
      if(i++===index){
        return iter.value()
      }
    }
    return null
  }
  /**
   * 由输入初始化链表
   * @param list LinkedList | Array
   * @returns 
   */
  private fromList(list?:LinkedList<T> | Array<T>): void{
    if(!list){
      return
    }
    const iter = this.iter()
    if(list instanceof Array){
      list.forEach(v=>{
        iter.add(v)
        iter.next()
      })
      this.length = list.length
    } else if(list instanceof LinkedList){
      const iter0 = list.iter()
      while(iter0.hasNext()){
        iter0.next()
        iter.add(iter0.value()!)
        iter.next()
      }
    }
  }

  *[Symbol.iterator]() {
    const iter = this.iter()
    while(iter.hasNext()){
      iter.next()
      yield iter.value()
    }
  }

}