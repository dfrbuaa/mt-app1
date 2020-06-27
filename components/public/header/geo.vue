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
    return {

    };
  },



  methods: {

    async setPosition () {

      const { status, data: { province, city } } = await this.$axios.get('/geo/getPosition')

      await this.$axios.get('/geo/removeChangeCity')
      const { status: status1, data: { newCity } } = await this.$axios.post('/geo/changeCity', {
        params: {
          city: this.city
        }
      })
      location.href = "/"

    }


  }
};
</script>

<style scoped lang="css">
</style>
