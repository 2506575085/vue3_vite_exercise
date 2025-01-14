/**
 * 深拷贝函数
 * @param value     要拷贝的目标
 * @param maxDeep   拷贝的深度限制，如果拷贝时深度超过了这个限制，将直接抛出错误
 */
 export function deepClone<T extends {[index:string|number]:any}>(value: T , maxDeep = 10): T|undefined {
  if (maxDeep < 0) throw new Error('deepClone Error: deep is exceed maxDeep');
  if (!value) return value;
  switch (typeof value) {
      case "object":
          if (value instanceof Map) {
              const map = new Map();
              for (let [_key, _value] of value) {
                  map.set(_key, deepClone(_value, maxDeep - 1));
              }
              return map as any;
          }
          if (value instanceof Set) {
              const set = new Set();
              for (let valueElement of value) {
                  set.add(deepClone(valueElement, maxDeep - 1));
              }
              return set as any;
          }
          if (value instanceof Array) {
              const array = Array(value.length);
              for (let i = 0; i < value.length; i++) {
                  array[i] = deepClone(value[i], maxDeep - 1);
              }
              return array as any
          }
          // 其它类型均当做普通对象处理
          const object: Record<string, any> = {}
          for (let key of Object.keys(value)) {
            object[key] = deepClone(value[key], maxDeep - 1);
          }
          return object as any
      case "function":
          console.warn('deepClone warn: 不支持 function 类型对象的 deep clone');
          return undefined;
      case "bigint":
          console.warn('deepClone warn: 不支持 bigint 类型的 deep clone');
          return undefined;
      case "symbol":
          console.warn('deepClone warn: 不支持 symbol 类型的 deep clone');
          return undefined;
      default:
          return value;
  }
}


/**
 * 生成范围内随机数
 */
export const randomNum = {

    /**
     * 生成[min,max]范围随机数
     * @param min 
     * @param max 
     * @returns 
     */
    fullClose(min: number, max: number) {
        var result = Math.random()*(max+1-min)+min;
        while(result>max) {
            result = Math.random()*(max+1-min)+min;
        }
        return result;
    },
  
    /**
     * 生成(min,max)范围随机数
     * @param min 
     * @param max 
     * @returns 
     */
    fullOpen(min: number, max: number) {
        var result = Math.random()*(max-min)+min;
        while(result == min) {
            result = Math.random()*(max-min)+min;
        }
        return result;
    },

    /**
     * 生成(min,max]范围随机数
     * @param min 
     * @param max 
     * @returns 
     */
    leftOpen(min: number, max: number) {
        var result = Math.random()*(max-min+1)+min-1;
        while(result<min) {
            result = Math.random()*(max-min+1)+min-1;
        }
        return result;
    },

    /**
     * 生成[min,max)范围随机数
     * @param min 
     * @param max 
     * @returns 
     */
    rightOpen(min: number, max: number) {
        return Math.random()*(min-max)+max
    },
    
    /**
     * 生成[min,max]范围随机整数
     * @param min 
     * @param max 
     * @returns 
     */
    intFullClose(min: number, max: number) {
        return Math.floor(Math.random()*(max-min+1))+min
    }
}

/**
 * sleep
 */
export function sleep(time:number){
    var timeStamp = new Date().getTime();
    var endTime = timeStamp + time;
    while(true){
        if (new Date().getTime() > endTime){
            return;
        } 
    }
}

/**
 * 防抖函数
 * @param func 执行函数
 * @param delay 延迟时间 ms
 * @param immediate 是否立即执行
 */
type Func = (this:unknown,...args:any[])=> unknown
export function debounce<T extends Func>(func: T, delay: number, immediate: boolean = false): T {
  let timer: NodeJS.Timeout | undefined
  return function (this: unknown, ...args: any[]) {
    let that = this
    if (immediate) {
      func.apply(that, args) // 确保引用函数的指向正确，并且函数的参数也不变
      immediate = false
      return
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(that, args)
    }, delay)
  } as T
}