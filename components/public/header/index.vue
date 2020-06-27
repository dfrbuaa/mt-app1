<template>
  <div class="m-header">
    <el-row>
      <el-col>
        <top-bar />
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <search-bar />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import topBar from './topbar.vue'
import searchBar from './searchbar.vue'
export default {

  components: {
    topBar,
    searchBar
  },

  methods: {
    // getCookie (name) {
    //   var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    //   if (process.client) {
    //     if (arr = document.cookie.match(reg))
    //       return unescape(arr[2]);
    //     else
    //       return null;
    //   }

    // }
  }
}
</script>

<style lang="scss">
@import "@/assets/css/public/header/index.scss";
</style>
