<template>
  <div class="cart-list">
    <scroll ref="scroll" class="content">
      <cart-list-item v-for="item in cartList" 
                      :key="item.iid"
                      :itemInfo="item">
      </cart-list-item>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'components/common/scroll/Scroll'

  import CartListItem from './CartListItem'

  import {mapGetters} from 'vuex'

  export default {
    name: "cartList",
    computed: {
      ...mapGetters(['cartList'])
    },
    components: {
      Scroll,
      CartListItem
    },
    activated() {
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .cart-list {
    /* height: calc(100vh - 44px - 58px); */

    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 102px;
  }

  .content {
    height: 100%;
    overflow: hidden;
  }


</style>