<template>
  <div class="m-products-list">
    <dl>
      <dd
        v-for="item in nav"
        :key="item.name"
        :class="[item.name, item.acitve ? 's-nav-active' : '']"
        @click="navSelect(item)"
      >
        {{ item.txt }}
      </dd>
    </dl>

    <ul>
      <Item v-for="(item, idx) in list" :key="idx" :meta="item" />
    </ul>

    <!-- <ul v-else-if="list_nav == 's-price'">
      <Item v-for="(item, idx) in list1" :key="idx" :meta="item" />
    </ul>
    <ul v-else-if="list_nav == 's-visit'">
      <Item v-for="(item, idx) in list2" :key="idx" :meta="item" />
    </ul>
    <ul v-else>
      <Item v-for="(item, idx) in list3" :key="idx" :meta="item" />
    </ul> -->
  </div>
</template>

<script>
import Item from './product.vue'

export default {

  components: {
    Item
  },
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },

  },
  data () {
    return {
      list_nav: [],
      list0: this.list.slice(),
      nav: [
        {
          name: 's-default',
          txt: '智能排序',
          acitve: true
        }, {
          name: 's-price',
          txt: '价格最低',
          active: false
        }, {
          name: 's-visit',
          txt: '人气最高',
          active: false
        }, {
          name: 's-comment',
          txt: '评价最高',
          active: false
        }
      ]
    }
  },


  async asyncData ({ app }) {
    let { data } = await app.$axios.get('searchList')
    return { items: data.list }
  },


  mounted () {

  },
  methods: {

    navSelect (index) {
      let self = this
      self.list_nav = index.name
      this.$emit('parentEvent', self.list_nav)
      console.log(self.list_nav)
    },

  }
}
</script>
