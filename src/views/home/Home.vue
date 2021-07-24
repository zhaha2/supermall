<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">香菇街</div></nav-bar>
    <!-- 常用方法，占位 -->
    <tab-control class="tab-control"
                :titles="['流行','新款','精选']"
                @tabClick="tabClick"
                ref="tabControl1"
                v-show="isTabFixed"/>
    <!-- bug P171 13:00 & day11笔记 -->
    <!-- 解决：2.x版本 observe-dom observe-image更好用。相当于帮着实现了上面的方法，原理一样都是refresh -->
    <scroll class="content"
            :pull-up-load="true"
            :probe-type="3"
            ref="scroll"
            @scroll="contentScroll"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swipeImgLoad="swipeImgLoad" ref="homeSwiper"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']"
                    @tabClick="tabClick"
                    ref="tabControl2"/>
      <goods-list :goods="showGoods" />
      
    </scroll>
    <!-- .native：监听组件根元素的原生事件 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import { getHomeMultidata, getHomeGoods } from "network/home"

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        saveY: 0,
        isTabFixed: false,
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      // 1.请求多个数据 调用methods发送请求，免得created里面代码太多
      this.getHomeMultidata()

      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      // 1.吸顶bug
      // this.$refs.tabControl获取tabControl(组件)的offsetTop
      // 所有组件都有一个属性$el: 用于获取组件的元素
      // (获取offsetTop会回流)
      // 这里图片还没加载，offsetTop还没算图片高度
      // console.log(this.$refs.tabControl.$el.offsetTop);
    },
    destroyed() {
      console.log('des');
    },
    // 用router back返回有时候（过一定时间）不会保存位置
    activated() {
      // console.log(this.saveY);

      // this.$refs.scroll.scrollTo(0, this.saveY, 0)
      // this.$refs.scroll.refresh()
      /*使用keepAlive时的生命周期函数：页面打开时触发
        !!轮播图导致bug，回到首页自动跑到顶部
        解决办法：keepalive非激活退出时的生命周期函数deactivated中清除轮播图计时器
                activated回来时再添加计时器（
                先判断定时器是否存在再添加，不然第一次加载也添加的话会同时有两个计时器）
        不能立即添加计时器，否则轮播图还是会自动滚回顶端，要等300ms
        仍存在问题：要等300ms才开始轮播
      */
      setTimeout(() => {
        if (!this.$refs.homeSwiper.$refs.swiper.isTiming) {
          // console.log(this.$refs.homeSwiper.$refs.swiper.isTiming);
          this.$refs.homeSwiper.$refs.swiper.startTimer()
        }
      }, 300);
         // this.$refs.scroll.scrollTo(0, this.offsettop, 0);
        // this.$refs.scroll.refresh()
    },
    deactivated() {
	    // this.saveY = this.$refs.scroll.scrollY
      // console.log(this.saveY);
      this.$refs.homeSwiper.$refs.swiper.stopTimer()

      // 取消全局事件的监听
      // this.$bus.$off('itemImgLoad', 函数名)
    },
    methods: {
      /**
       * 事件监听相关的方法
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        // 保证两个tabControl index保持一致
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      backClick() {
        // this.$refs.scroll拿到Scroll组件
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position) {
        // 1.判断backTop是否显示
        this.isShowBackTop = (-position.y) > 1000

        // 2.决定tabControl是否吸顶
        // （position: fixed）不行，还是会被transform顶上去
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      // 网络请求相关的方法
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // this.result = res;
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp()
        })
      },
      // 2.吸顶bug
      // 轮播图片加载最慢，等他加载完在计算高度就可以了
      // 参考：https://blog.csdn.net/weixin_43334673/article/details/110130720
      swipeImgLoad() {
        // console.log(this.$refs.tabControl.$el.offsetTop);
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
    }
  }
</script>

<style scoped>
/* scoped代表作用域
  表示下面所有内容只针对当前组件中 */
  #home {
    /* padding-top: 44px; */
    /* 设定高度充满视口 而不是被很多内容撑高 */
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /* fixed就脱离标准流了
      在使用原生滚动时使其不滚动用到
      现在不用原生滚动了就没用了 */
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }

  /* 用better-scroll之后sticky就不起效果了 */
  /* .tab-control { */
    /* position: -webkit-sticky;
    position: sticky;
    top: 44px;
    z-index: 8; */
  /* } */

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  /*.content {*/
    /*height: calc(100% - 93px);*/
    /*overflow: hidden;*/
    /*margin-top: 44px;*/
  /*}*/

  /* better-scroll在改translate属性，所以fixed也被改变了，下面就失效了 */
  /* .fixed {
    position: fixed;
    left: 0;
    right: 0;
    top: 44px;
  } */

  .tab-control {
    /* 设置相对位置不改变原位，以设置zindex */
    position: relative;
    z-index: 9;
  }
</style>
