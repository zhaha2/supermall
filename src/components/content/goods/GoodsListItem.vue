<template>
  <div class="goods-item" @click="itemClick">
    <!-- vue监听： @load -->
    <img :src="showImage" alt="" @load="imageLoad">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goodsItem: {
      type: Object,
      default() {
        return []
      }
    }
  },
  computed: {
    showImage() {
      // 可能每个组件传来的对象，对应图片的路径不同
      return this.goodsItem.image || this.goodsItem.show.img
    }
  },
  methods: {
    imageLoad() {
      if (this.$route.path.indexOf('/home')){
        // 常用方法：路由判断当前是哪个页面
      }
    },
    itemClick() {
      // 路由跳转
      this.$router.push({
        path: './detail',
        query: {
          // 传递参数（iid）
          iid: this.goodsItem.iid
        }
      })
    }
  }
}
</script>

<style>
  .goods-item {
    padding-bottom: 40px;
    position: relative;

    width: 48%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    /* 形成BFC 防止内部元素溢出去影响别人 */
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    /* 显示省略符号来代表被修剪的文本。 */
    text-overflow: ellipsis;
    /* 不换行 */
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>