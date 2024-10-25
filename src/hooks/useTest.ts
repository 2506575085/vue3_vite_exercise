import { ref, unref } from 'vue'

export interface ScrollToParams {
  el: HTMLElement
  to: number
  position?: 'scrollLeft' | 'scrollTop'
  duration?: number
  callback?: () => void
}

const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d / 2
  if (t < 1) {
    return (c / 2) * t * t + b
  }
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}
const move = (el: HTMLElement, position: ScrollToParams['position'], amount: number) => {
  el[position!] = amount
}

export function useScrollTo({
  el,
  position = 'scrollLeft',
  to,
  duration = 20000,
  callback
}: ScrollToParams) {
  // const isActiveRef = ref(false)
  let isActiveRef = false
  const start = el[position]
  const change = to - start
  const increment = 10
  let currentTime = 0

  function animateScroll() {
    if (!isActiveRef) {
      return
    }
    currentTime += increment
    const val = easeInOutQuad(currentTime, start, change, duration)
    move(el, position, val)
    if (currentTime < duration && isActiveRef) {
      requestAnimationFrame(animateScroll)
    } else {
      if (callback) {
        callback()
      }
    }
  }

  function run() {
    isActiveRef = true
    animateScroll()
  }

  function stop() {
    isActiveRef = false
  }

  return { start: run, stop }
}
