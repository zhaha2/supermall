import * as types from './mutation-types'


export default {
    // mutations唯一的目的就是修改state中的状态
    // mutations中的每个方法完成的事件都尽量单一一点
    // 复杂的逻辑最好去actions完成，这里只要修改一条数据就好
    [types.ADD_COUNTER](state, payload) {
      payload.count++
    },
    [types.ADD_CART](state, payload) {
      state.cartList.push(payload)
    }
}