import {
  ADD_CART,
  ADD_COUNTER
} from './mutation-types'

export default {
  addToCart(context, payload) {
    // payload为新添加的商品
    // 判断是否已经添加过了
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
    if (oldProduct) {
      context.commit(ADD_COUNTER, oldProduct)
    } else {
      payload.count = 1
      context.commit(ADD_CART, payload)
    }
  }
}