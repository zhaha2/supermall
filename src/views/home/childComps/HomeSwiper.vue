<template>
  <swiper ref="swiper">
    <!-- 不绑定 ：key会报错, 绑定之后相当于Vue每次都会重回新创建，不会复用
    但是这里绑定index做key实际上和默认不绑定key的行为是一样的，只是为了防止报错
    都不会复用（最好用item本身的id属性做key） -->
    <swiper-item v-for="(item, index) in banners" :key="index">
      <!-- 用到变量中的属性，要加： -->
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper'

  export default {
    name: "HomeSwiper",
    props: {
      banners: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      Swiper,
      SwiperItem
    },
    data() {
      return {
        isLoad: false
      } 
    },
    methods: {
      // 监听轮播图片加载完成事件
      imageLoad() {
        // 防止每次加载完成都发送一次事件，用isLoad记录状态，为true就不在发送了
        if (!this.isLoad) {
          this.$emit('swipeImgLoad')
          this.isLoad = true
        }
      }
    },
    activated() {
      // console.log("active");
      // this.$refs.scroll.scrollTo(0, this.saveY, 0)
      //使用keepAlive时的生命周期函数：页面打开时触发
      // setTimeout(() => {
        // this.$refs.scroll.scrollTo(0, this.offsettop, 0);
        // this.$refs.swiper.startTimer()
      // }, 0);
    },
    deactivated() {
	    // console.log("deactive");
      // this.$refs.swiper.stopTimer()
    }
  }
</script>

<style scoped>

</style>
