export class Stack<T> {
  private stack: T[]

  constructor(){
    this.stack = []
  }

  push(v: T){
    this.stack.push(v)
  }
  pop(){
    return this.stack.pop()
  }
}
