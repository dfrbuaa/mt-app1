<template>
  <div class="page-detail">
    <el-row>
      <el-col :span="24">
        <crumbs :keyword="keyword" :type="type" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <summa :meta="product" />
      </el-col>
    </el-row>
    <el-row class="m-title">
      <el-col :span="24">
        <h3>商家团购及优惠</h3>
      </el-col>
    </el-row>
    <el-row v-if="canOrder || !login">
      <el-col :span="24">
        <list :list="list" v-if="login" />
        <div class="deal-need-login" v-else>
          <img src="//p0.meituan.net/codeman/56a7d5abcb5ce3d90fc91195e5b5856911194.png" alt="登录查看" />
          <span>请登录后查看详细团购优惠</span>
          <el-button type="primary" round>
            <a href="/login">立即登录</a>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Crumbs from '@/components/detail/crumbs.vue';
import Summa from '@/components/detail/summary.vue';
import List from '@/components/detail/list.vue'
export default {
  data () {
    return {
      keyword: '',
      type: '',
      product: {},
      list: [],
      login: ''
    }
  },
  computed: {
    canOrder: function () {
      return this.list.filter(item => item.photos.length).length
    }
  },
  components: {
    Crumbs,
    Summa,
    List
  },
  async asyncData (ctx) {
    //   在服务端获取数据，请求上的信息是服务端的
    let { keyword, type } = ctx.query;
    let { status, data: { product, more: list, login } } = await ctx.$axios.get('/search/products', {
      params: { keyword, type, city: ctx.store.state.geo.position.city }
    })
    if (status == 200) {
      return {
        keyword,
        product,
        type,
        list,
        login
      }
    } else {
      return {
        keyword,
        product: {},
        type,
        list: [],
        login: false
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/css/detail/index.scss";
</style>
