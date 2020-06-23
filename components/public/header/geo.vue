<template>
  <div class="m-geo">
    <i style="cursor:pointer; color: #31BBAC" class="el-icon-location" @click="setPosition" />{{
      $store.state.geo.position.city
    }}
    <nuxt-link class="changeCity" to="/changeCity">切换城市</nuxt-link>
    [香河 廊坊 天津]
  </div>
</template>

<script>
export default {
  data () {
    return {};
  },
  methods: {
    async setPosition () {
      const { status, data: { province, city } } = await this.$axios.get('/geo/getPosition')
      this.$store.commit('geo/setPosition', status === 200 ? { city, province } : { city: '', province: '' })
      const { status: status3, data: { result } } = await this.$axios.get('/search/hotPlace', {
        params: {
          city: this.$store.state.geo.position.city.toString().replace('市', '')
        }
      })
      this.$store.commit('home/setHotPlace', status3 === 200 ? result : [])
    }
  }
};
</script>

<style scoped lang="css">
</style>
