<template>
  <div id="app">
    <main-tab-bar/>
    <!-- keep alive使退出当前界面不销毁，下次返回还是原来的位置 -->
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
  import MainTabBar from 'components/content/mainTabBar/MainTabBar'

  export default {
    name: 'app',
    components: {
      MainTabBar,
    }
  }
</script>

<style>
  @import 'assets/css/base.css';
</style>
