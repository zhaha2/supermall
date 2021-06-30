<template>
  <div class="goods">
    <goods-list-item v-for="(item,id) in goods" :key="id" :goods-item="item"/>
  </div>
</template>

<script>
  import GoodsListItem from './GoodsListItem'

  export default {  
    props: {
      goods: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      GoodsListItem
    }
  }
</script>

<style>
  .goods {
    display: flex;
    /* 规定灵活的项目在必要的时候拆行或拆列(换行)。 */
    /* 
       默认值为nowrap，不换行，当父元素在主轴上一行（一列）装不下子元素时，将会对子元素进行等比缩放，使子元素能在主轴上一行（一列）显示。
       当将属性值设置为wrap时，如子元素在一行（一列）上装不下，将会另起一行（一列）而不是改变子元素的大小
       */
    flex-wrap: wrap;
    /* 元素中间的距离均等分 */
    justify-content: space-around;
    padding: 2px;
  }
</style>