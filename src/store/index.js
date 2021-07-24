import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import mutations from './mutations'
import actions from './actions'

const state = {
  // 用Map应该更好
  cartList: []
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
})
