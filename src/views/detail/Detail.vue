<template >
  <div id="detail">
    <detail-nav-bar class=".detail-nav"
                    @titleClick="titleClick"
                    ref="nav"
                    :current-index="currentIndex"></detail-nav-bar>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages" ref="dswiper"></detail-swiper>
      <!-- 注意驼峰
            属性（goodsInfo）不区分大小写，全当小写
            传入值（goods-info）用'-'来区分大小写才能正确传入 -->
      <detail-base-info :goods-info="goodsInfo"></detail-base-info>
      <detail-shop-info :shop-info="shopInfo"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommends"/>
    </scroll>
    <detail-bottom-bar @addTocart="addTocart"/>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  import BackTop from 'components/content/backTop/BackTop'

  import {getDetail, GoodsInfo, ShopInfo, GoodsParam, getRecommend} from 'network/detail'
  import {debounce} from 'common/utils'
  import {backTopMixin} from 'common/mixin'

  export default {
    name: 'Detail',
    data() {
      return {
        iid: null,
        topImages: [],
        goodsInfo: {},
        shopInfo: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        topThemes: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
      }
    },
    methods: {
      titleClick(index) {
        // 简洁方法scrollToElement， 后面分别是滑动时间和偏移量
        // const targetElName = Object.keys(this.$refs)[index]
        // const targetEl = this.$refs[targetElName].$el
        // this.$refs.scroll.scrollToElement(targetEl, 200) 
        
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500)
      },
      imageLoad() {
        // 等DOM渲染过之后再获取offsetTOp
        // 法三 图片加载后回调, 缺少防抖
        // this.themeTopYs = []
        // this.themeTopYs.push(0);
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
        // console.log(this.themeTopYs);

        // 法四
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      contentScroll(position) {
        // 1. 获取y
        const positionY = -position.y

        const length = this.themeTopYs.length
        // 2. positionY与主题中的值对比
        for (let i = 0; i < length; i++) {
          if (this.currentIndex !== i && (
              (i === length - 1 && positionY >= this.themeTopYs[i]) || 
               (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]))){
                //  console.log(positionY);
                //  console.log(i);
                this.currentIndex = i
          }
        }
        // 3.判断backTop是否显示
        this.listenBackTop(position)
      },
      addTocart() {
        // 1. 获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goodsInfo.title
        product.desc = this.goodsInfo.desc
        product.price = this.goodsInfo.realPrice
        product.iid = this.iid

        // 2. 将商品加到购物车
        this.$store.dispatch('addToCart', product)
      }
    },
    created() {
      // 1.接收参数（iid）
      this.iid = this.$route.query.iid

      // 2.根据iid请求数据
      // 数据最好先整合到一个对象里再展示
      getDetail(this.iid).then(res => {
        const data = res.result
        // 1.获取顶部图片的轮播数据
        this.topImages = res.result.itemInfo.topImages

        // 2.获取商品信息
        this.goodsInfo = new GoodsInfo(data.itemInfo, data.columns, data.shopInfo.services)
        // console.log(this.goodsInfo);

        // 3.获取商家信息
        this.shopInfo = new ShopInfo(data.shopInfo)

        // 5.获取商品详细信息
        this.detailInfo = data.detailInfo
        
        // 6.保存参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 7.取出评论信息
        // cRate表示评论个数
        if(data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0]
        }
      })

      // 3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

      // 等渲染过之后再获取offsetTOp
      // 法二
      // this.$nextTick(() => {
        // 等DOM渲染完之后回调下面的函数
        // 根据最新的数据，对应的DOM（不包含图片）已经被渲染出来
        // 但是图片还没加载完，和法一都有这个问题
        // this.themeTopYs = []

        // this.themeTopYs.push(0);
        // // $el代表组件的根组件
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
        // console.log(this.themeTopYs);
      // })

      // 等渲染过之后再获取offsetTOp
      // 法四
      // 4. 给 getThemeTopY 赋值 
      // 不用防抖？ imageLoad已经处理过只返回一次了
      this.getThemeTopY = function() {
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
      }

      // 4.给 topThemes 赋值
      // this.$refs.Keys()

    },
    updated() {
      // 等DOM渲染过之后再获取offsetTOp
      // 法一
      // this.themeTopYs = []

      // this.themeTopYs.push(0);
      // // $el代表组件的根组件
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
    },
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      BackTop
    },
    mixins: [backTopMixin]
  }
</script>

<style scoped>
  /* 为了盖住原本的tabbar
      ？？用别的办法 */
  #detail {
    height: 100vh;
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    /* 不加overflow: hidden的话内容会溢出盖住上面nav */
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 58px;
    left: 0;
    right: 0;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
  }
</style>>
