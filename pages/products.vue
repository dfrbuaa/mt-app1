<template>
  <el-row class="page-product">
    <el-col :span="19">
      <crumbs :keyword="keyword" />
      <!-- :绑定数据，就可以向子组件传递数据 -->
      <categroy :types="types" :areas="areas" />
      <div>
        <list :list="list" @parentEvent="toClick" />
      </div>
    </el-col>
    <el-col :span="5">
      <div :class="mapFixed == true ? 'isFixed' : ''">
        <amap :width="230" :height="290" :point="point" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Crumbs from '@/components/products/crumbs.vue'
import Categroy from '@/components/products/categroy.vue'
import List from '@/components/products/list.vue'
import Amap from '@/components/public/map.vue'
export default {
  components: {
    Crumbs,
    Categroy,
    List,
    Amap
  },
  data () {

    return {


      list: [],

      types: [],
      areas: [],
      keyword: '',
      point: [],
      mapFixed: '',


    }
  },
  computed: {

    list0 () {
      let listA = this.sortKeyHigh(this.list, 'rate')
      return this.sortKeyLow(listA, 'price')

    },
    list1 () {
      return this.sortKeyLow(this.list, 'price')
    },
    list2 () {
      return this.sortKeyHigh(this.list, 'comment')
    },
    list3 () {
      return this.sortKeyHigh(this.list, 'rate')
    }

  },

  mounted () {

    // this.list0 = JSON.parse(JSON.stringify(this.list))
    window.addEventListener('scroll', this.handleScroll)

  },

  methods: {
    handleScroll () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // console.log(scrollTop)

      if (scrollTop > 260) {
        this.mapFixed = true
      } else {
        this.mapFixed = false
      }
      if (scrollTop < 500) {
        var newPoint = (this.list[0].location).split(',')
        var newName = this.list[0].name
        this.point = newPoint
        console.log(newName)
        console.log(this.point)
      }
      else if (scrollTop > 500 && scrollTop < 250 + this.list.length * 210) {
        var i = parseInt((scrollTop - 500) / 210) + 1
        var newPoint = (this.list[i].location).split(',')
        var newName = this.list[i].name

        this.point = newPoint

        console.log(newName)
        console.log(this.point)
        //  console.log(this.point)
        // console.log(scrollTop)

      } else if (scrollTop > 250 + this.list.length * 210) {
        console.log(111)
        this.point = (this.list[this.list.length - 1].location).split(',')
      }
      // this.point = (this.list[list.length - 1].location).split(',')



    },
    sortKeyLow (array, key) {
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : (x > y) ? 1 : 0)
      })
    },
    sortKeyHigh (array, key) {
      return array.sort(function (b, a) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : (x > y) ? 1 : 0)
      })
    },
    deepCopy (oldData, newData) {
      newData = JSON.parse(JSON.stringify(oldData))
      return newData
    },
    toClick (list_nav) {

      if (list_nav == 's-price') {
        this.list = this.list1
      } else if (list_nav == 's-visit') {
        this.list = this.list2
      } else if (list_nav == 's-comment') {
        this.list = this.list3
      } else {
        this.list = this.list0

      }
    }



  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },
  // 获取异步数据
  async asyncData (ctx) {
    let keyword = ctx.query.keyword
    let city = ctx.store.state.geo.position.city
    var { status, data: { count, pois } } = await ctx.$axios.get('/search/resultsByKeywords', {
      params: {
        keyword,
        city
      }
    })
    let { status: status2, data: { areas, types } } = await ctx.$axios.get('/categroy/crumbs', {
      params: {
        city
      }
    })
    if (status === 200 && count > 0) {
      return {
        list: pois.filter(item => item.photos.length).map(item => {
          return {
            type: item.type,
            img: item.photos[0].url,
            name: item.name,
            comment: Math.floor(Math.random() * 10000),
            rate: Number(item.biz_ext.rating),
            price: Number(item.biz_ext.cost),
            scene: item.tag,
            tel: item.tel,
            status: '可订明日',
            location: item.location,
            module: item.type.split(';')[0]
          }
        }),
        keyword,
        areas: areas.filter(item => item.type !== '').slice(0, 5),
        types: types.filter(item => item.type !== '').slice(0, 5),
        point: (pois.find(item => item.location).location || '').split(','),

      }
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/css/products/index.scss";

.isFixed {
  padding-left: 12px;
  position: fixed;
  top: 0;
  z-index: 999;
}
</style>
