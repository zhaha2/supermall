export function debounce(func, dalay) {
  let timet = null
  // args接受可变个参数
  return function (...args) {
    if(timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, dalay)
  }
}