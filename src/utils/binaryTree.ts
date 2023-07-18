import { Queue } from "./queue"


type nullable<T> = T|null|undefined
type nullableArr<T> = Array<nullable<T>>
interface IBinaryTree<T>{
  getLChild(): BinaryTree<T>
  getLChild(): BinaryTree<T>
  getChildByIndex(index: number): BinaryTree<T>
  dfs(index:number, cb:(node:nullable<T>,i:number) => unknown): void
  bfs(index:number, cb:(node:nullable<T>,i:number) => unknown): void
  setChild(index: number,child: BinaryTree<T>): void
  setHeight(height:number): void
  getHeight(): number
  setNode(index: number,node: nullable<T>): void
  getNode(index: number): nullable<T>
}

export class BinaryTree<T> implements IBinaryTree<T>{
  
  private list: nullableArr<T> = []

  constructor(list: nullableArr<T>){
    this.list = list
  }
  /**
   * 获取左子树
   * @returns 
   */
  getLChild(): BinaryTree<T>{
    return this.getChildByIndex(2)
  }
  /**
   * 获取右子树
   * @returns 
   */
  getRChild():BinaryTree<T>{
    return this.getChildByIndex(3)
  }
  /**
   * 获取以index为根节点的子树
   * @param index 
   * @returns 
   */
  getChildByIndex(index: number){
    const childArr: nullableArr<T> = [null]
    const list = this.list
    let lastLineFlag = false
    let startIndex = index
    let lineNumCount = 1
    while(!lastLineFlag){
      let emptyNumCount = 0
      for(let i = startIndex; i < startIndex + lineNumCount; i++){
        if(list[i] !== undefined){
          childArr.push(list[i])
        } else {
          emptyNumCount++
        }
      }
      if(emptyNumCount === lineNumCount){
        lastLineFlag = true
      }
      startIndex *= 2
      lineNumCount *= 2
    }
    return new BinaryTree<T>(childArr)
  }
  /**
   * 以index结点作为根节点进行深度优先遍历
   * @param index 
   * @param cb 
   * @returns 
   */
  dfs(index:number, cb:(node:nullable<T>,i:number) => unknown){
    if(this.list[index] === undefined){
      return
    }
    cb(this.list[index],index)
    this.dfsWithoutRoot(index,cb)
  }
  private dfsWithoutRoot(index:number, cb:(node:nullable<T>,i:number) => unknown){
    if(this.list[index*2] !== undefined){
      cb(this.list[index*2],index*2)
      this.dfsWithoutRoot(index*2,cb)
    }
    if(this.list[index*2+1] !== undefined){
      cb(this.list[index*2+1],index*2+1)
      this.dfsWithoutRoot(index*2+1,cb)
    }
  }
  /**
   * 以index结点作为根节点进行广度优先遍历
   * @param index 
   * @param cb 
   */
  bfs(index:number, cb:(node:nullable<T>,i:number) => unknown){
    const bfsIndexQueue = new Queue<number>()
    cb(this.list[index], index)
    this.bfsWithoutRoot(index,cb,bfsIndexQueue)
  }
  private bfsWithoutRoot(index:number, cb:(node:nullable<T>,i:number) => unknown, bfsIndexQueue:Queue<number>){
    if(this.list[index*2] !== undefined){
      bfsIndexQueue.add(index*2)
    }
    if(this.list[index*2+1] !== undefined){
      bfsIndexQueue.add(index*2+1)
    }
    while(!bfsIndexQueue.isEmpty()){
      const index = bfsIndexQueue.remove()
      cb(this.list[index!], index!)
      this.bfsWithoutRoot(index!,cb,bfsIndexQueue)
    }
  }
  /**
   * 将index为根结点的子树替换为child
   * @param index 
   * @param child 
   */
  setChild(index: number,child: BinaryTree<T>){
    if(!this.getNode((index-index%2)/2)){
      throw new Error("new node is not linked")
    }
    if(child.getHeight() + BinaryTree.getDeepOfIndex(index) > this.getHeight()){
      this.setHeight(child.getHeight() + BinaryTree.getDeepOfIndex(index))
    }
    //清空子树
    this.bfs(index,((node,i)=>{
      this.setNode(i,undefined)
    }))
    let setIndex = index
    let lineStartIndex = index
    child.bfs(1,(node,i)=>{
      this.setNode(setIndex,node)
      const lineNumCount = BinaryTree.getLineCountByDeep(BinaryTree.getDeepOfIndex(i))
      if(setIndex < lineStartIndex + lineNumCount-1){
        setIndex ++
      } else {
        lineStartIndex *= 2
        setIndex = lineStartIndex
      }
    })
  }

  /**
   * 设置树高
   * @param height 
   */
  setHeight(height:number){
    let length = 1
    while(height!==1){
      length = length*2 + 1
      height--
    }
    this.list.length = length
  }

  /**
   * 获取树高
   * @returns 
   */
  getHeight(){
    return BinaryTree.getDeepOfIndex(this.list.length-1)
  }

  /**
   * 获取deep深度所在行的总结点数
   * @param deep 
   * @returns 
   */
  static getLineCountByDeep(deep:number){
    return Math.pow(2,deep-1)
  }

  /**
   * 获取index结点的深度
   * @param index 
   * @returns 
   */
  static getDeepOfIndex(index:number){
    let lastNodeIndex = index+1
    let deep = 0
    while(lastNodeIndex!=1){
      lastNodeIndex = (lastNodeIndex+(lastNodeIndex%2))/2
      deep ++
    }
    return deep
  }

  /**
   * 修改node值
   * @param index 
   * @param node 
   */
  setNode(index: number,node: nullable<T>){
    this.list[index] = node
  }

  /**
   * 获取node值
   * @param index 
   * @returns 
   */
  getNode(index:number){
    return this.list[index]
  }
}
