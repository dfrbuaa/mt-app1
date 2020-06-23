<template>
  <div class="m-iselect">
    <span class="name">按省份选择:</span>
    <el-select v-model="pvalue" placeholder="省份" @change="changeProvince">
      <el-option
        v-for="item in province"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select v-model="cvalue" :disabled="!city.length" placeholder="城市" @change="changeCity">
      <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市中文或拼音"
      @select="handleSelect"
    />
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data () {
    return {
      province: [],
      pvalue: "",
      city: [],
      cvalue: "",
      input: "",
      cities: []
    };
  },

  watch: {
    // 选择新的省份，加载响应的城市
    pvalue: async function (newPvalue) {
      let self = this;

      let { status, data: { city } } = await self.$axios.get(`/geo/province/${newPvalue}`);
      if (status === 200) {
        self.city = city.map(item => {

          return {
            value: item.id,
            label: item.name
          };
        });
        self.cvalue = "";
      }

    },
    // 选择新的城市，加载页面
    cvalue: async function (newCvalue) {
      let self = this
      // console.log(newCvalue)
      // self.$store.commit('geo/changePosition', { city: newCvalue, province: 'newPvalue' })
    }

  },
  // 自动加载省份列表
  mounted: async function () {
    let self = this;
    let { status, data: { province } } = await self.$axios.get("/geo/province");
    if (status === 200) {
      self.province = province.map(item => {
        return {
          value: item.id,
          label: item.name
        };
      });
    }
  },
  methods: {
    querySearchAsync: _.debounce(async function (query, cb) {
      let self = this;
      if (self.cities.length) {
        // 回调过滤
        cb(self.cities.filter(item => item.value.indexOf(query) > -1));
      } else {
        let { status, data: { city } } = await self.$axios.get("/geo/city");
        if (status === 200) {
          self.cities = city.map(item => {
            return {
              value: item.name
            };
          });
          cb(self.cities.filter(item => item.value.indexOf(query) > -1));
        } else {
          cb([]);
        }
      }
    }, 200),
    changeProvince (item) {
      console.log(item);
    },
    changeCity (item) {

      console.log(item);
    },
    handleSelect (item) {
      let self = this

      self.$store.commit('geo/changePosition', { city: item.value })
      console.log(item);
    },

  }
};
</script>

<style lang="scss">
@import "@/assets/css/changeCity/iselect.scss";
</style>
