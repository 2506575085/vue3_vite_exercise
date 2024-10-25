// const promise = new Promise((res,rej)=>{
//   console.log('promise')
//   setTimeout(() => {
//     console.log(res())
//   },1000)
//   // console.log(res())
//   // console.log(rej())
//   console.log(2)
//   console.log(3)
// }).then(()=>{
//   console.log('then')
//   return 1
// }).catch(()=>{console.log('catch')})

// const encodeRes = encodeURIComponent("几乎是空间的很快就暗示").split('%').filter(s=>s).map(s=>String.fromCharCode(71+(20+parseInt(s[1],16))%20)+s).join('').split('').reverse().join('')
// const decodeRes = decodeURIComponent(encodeRes.split('').reverse().filter((_,i)=>i%3).map((s,i)=>i%2?s:'%'+s).join(''))
// console.log(encodeRes)
// console.log(decodeRes)

// const encodeStr = `嘻嘻哈哈`
// // const encodeStr = ``
// function encode(str) {
//     return  str.split('').map(c => {
//         let s16 = c.charCodeAt(0).toString(16).toUpperCase()
//         return String.fromCharCode(71+(20+parseInt(s16[s16.length-1],16))%20) + s16
//     }).join('').split('').reverse().join('')
// }
// function decode(s) {
//     return  s.split('').reverse().join('').split(/[G-Z]/g).map(s=>String.fromCharCode(parseInt(s, 16))).join('')
// }
// const encodeRes = encode(encodeStr)
// console.log(encodeRes)
// console.log(decode(encodeRes))

const encodeStr = `sdads`
import fs from 'node:fs'
// const encodeStr = ``
function encode(str) {
    return  str.split('').map(c => {
        let s16 = c.charCodeAt(0).toString(16).toUpperCase()
        const l = s16.length
        const ex = String.fromCharCode(71+(20+parseInt(s16[l-1],16))%20)
        if(l===1) {
            return ex + ex + s16 + ex
        }
        return s16.slice(0,l/2) + ex + s16.slice(l/2,l)
    }).join('').split('').reverse().join('')
}

function decode(s) {
    const list = s.split('').reverse().join('').split(/[G-Z]/g)
    let res = ''
    let preLastCount = 0
    let oneFlag = false
    for (let [index, cur] of list.entries()) {
        if(!index) {
            preLastCount = cur.length
            continue
        }
        const pre = list[index - 1]
        if (oneFlag && pre !== '') {
            oneFlag = false
            preLastCount = cur.length
            continue
        }
        if(pre === '') {
            oneFlag = true
            res += String.fromCharCode(parseInt(cur, 16))
            continue
        }
        const preStr = pre.slice(pre.length - preLastCount, pre.length)
        const curStr = cur.slice(0, preLastCount)
        res += String.fromCharCode(parseInt(preStr + curStr, 16))
        preLastCount = cur.length - preLastCount
    }
    return res
}
const encodeRes = encode(encodeStr)
console.log(encodeRes)
console.log(decode(encodeRes))
// fs.writeFileSync('./text.txt', encodeRes)
// fs.writeFileSync('./text.txt', decode(``))
// fs.writeFileSync('./text.txt', encode(``))
