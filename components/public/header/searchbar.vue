<template>
  <div class="search-panel">
    <el-row :gutter="0" m-header-searchbar>
      <el-col :span="3" class="left">
        <a href="/"><img src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/logo.png" alt="美团"/></a>
      </el-col>
      <el-col :span="15" class="center">
        <div class="wrapper">
          <el-input
            v-model="search"
            @focus="focus"
            @blur="blur"
            @input="input"
            placeholder="搜索商家和地点"
          ></el-input>
          <a :href="'/products?keyword=' + encodeURIComponent(this.search)">
            <button class="el-button el-button--primary">
              <i class="el-icon-search" />
            </button>
          </a>

          <dl v-if="isHotPlace" class="hotPlace">
            <dt>热门搜索</dt>
            <dd v-for="(item, idx) in $store.state.home.hotPlace.slice(0, 5)" :key="idx">
              <a :href="'/products?keyword=' + encodeURIComponent(item.name)">{{ item.name }}</a>
            </dd>
          </dl>
          <dl v-if="isSearchList" class="searchList">
            <dd v-for="(item, idx) in searchList" :key="idx">
              <a :href="'/products?keyword=' + encodeURIComponent(item.name)">{{ item.name }}</a>
            </dd>
          </dl>
        </div>
        <p class="suggest">
          <a
            :href="'/products?keyword=' + encodeURIComponent(item.name)"
            v-for="(item, idx) in $store.state.home.hotPlace.slice(0, 5)"
            :key="idx"
            >{{ item.name }}</a
          >
        </p>
        <ul class="nav">
          <li>
            <nuxt-link to="/" class="takeout">美团外卖</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="movie">猫眼电影</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="hotel">美团酒店</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="apartment">民宿/公寓</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="business">商家入驻</nuxt-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="6" class="right">
        <ul class="security">
          <li>
            <i class="refund"><p class="txt">随时退</p></i>
          </li>
          <li>
            <i class="single"><p class="txt">不满意免单</p></i>
          </li>
          <li>
            <i class="overdue"><p class="txt">过期退</p></i>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import _ from "lodash"; //延时函数
export default {
  data () {
    return {
      search: "",
      isFocus: false,
      hotPlace: [],
      searchList: [],

    };

  },

  computed: {

    isHotPlace () {
      return this.isFocus && !this.search;
    },
    isSearchList () {
      return this.isFocus && this.search;
    }
  },
  methods: {

    focus () {
      this.isFocus = true;
    },
    blur () {
      let self = this;
      setTimeout(function () {
        self.isFocus = false;
      }, 200);
    },
    input: _.debounce(async function () {
      let self = this;
      let city = self.$store.state.geo.position.city.replace("市", "");
      self.searchList = [];
      let {
        status,
        data: { top }
      } = await self.$axios.get("search/top", { params: { input: self.search, city } });
      self.searchList = top.slice(0, 10);
    }, 300)
  },
  async asyncData () {
    const { status: status3, data: { result } } = await this.$axios.get('/search/hotPlace', {
      params: {
        city: this.$store.state.geo.position.city.toString().replace('市', '')
      }
    })
    this.$store.commit('home/setHotPlace', status3 === 200 ? result : [])
  }
};

</script>

<style lang="scss">
</style>
