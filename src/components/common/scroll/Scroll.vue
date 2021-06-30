<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import ObserveImage from '@better-scroll/observe-image'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null,
      }
    },
    mounted() {
      // 1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        // 使div也可点击
        click: true,
        // 监听滚动
        probeType: this.probeType,
        // 上拉加载
        pullUpLoad: this.pullUpLoad,

        // 开启 observe-image 插件
          observeImage: {
            // 防抖
            /* 探测到图片加载成功或者失败后，过 debounceTime 毫秒后才会调用 refresh 方法，
            重新计算可滚动的高度或者宽度，如果在 debounceTime 毫秒内有多张图片加载成功或者失败，
            只会调用一次 refresh。 */
            debounceTime: 100 // ms
          }
      })

      // 2.监听滚动的位置(probeType=2/3才监听)
      // ？加个节流
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
          // console.log(position);
          this.$emit('scroll', position)
        })
      }

      // 3.监听滚到底部上拉事件(只有pullUpLoad为true才监听)
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          // console.log('上拉');
          this.$emit('pullingUp')
        })
      }

      // console.log(this.scroll);
    },
    methods: {
      scrollTo(x, y, time=300) {
        // 防止scroll还没被加载就调用
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        // 默认只能上拉加载一次，加载完要finish才能再加载下次
        this.scroll && this.scroll.finishPullUp()
      }
    }
  }
</script>

<style scoped>

</style>
