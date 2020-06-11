<template>
  <div class="">
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd v-for="item in list" :key="item">
        <!-- 点击跳转 -->
        <a :href="'#city-' + item">{{ item }}</a>
      </dd>
    </dl>
    <dl v-for="item in block" :key="item.title" class="m-categroy-section">
      <dt :id="'city-' + item.title">{{ item.title }}</dt>
      <dd>
        <span v-for="c in item.city" :key="c">{{ c }}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
import pyjs from "js-pinyin";
export default {
  data () {
    return {
      list: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
      block: []
    };
  },
  async mounted () {
    let self = this;
    let blocks = [];
    let { status, data: { city } } = await self.$axios.get("/geo/city");
    if (status === 200) {
      let p;
      let c;
      let d = {};
      city.forEach(item => {
        // 获取小写首字母
        p = pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0, 1);
        // 得到小写字母的编码值
        c = p.charCodeAt(0);
        if (c > 96 && c < 123) {
          if (!d[p]) {
            d[p] = [];
          }
          // 键是小写首字母，值是城市名
          d[p].push(item.name);
        }
      });
      // 构建blocks中的数据结构
      for (let [k, v] of Object.entries(d)) {
        blocks.push({
          title: k.toUpperCase(),
          city: v
        });
      }
      // 排序
      blocks.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
      self.block = blocks;
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/changeCity/categroy.scss";
</style>
