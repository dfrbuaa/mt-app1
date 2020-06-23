// import createVuexAlong from 'vuex-along'
export const actions = {
    async nuxtServerInit({ commit }, { req, app }) {
        const { status, data: { province, city } } = await app.$axios.get('/geo/getPosition')
        commit('geo/setPosition', status === 200 ? { city, province } : { city: '', province: '' })
        const { status: status2, data: { menu } } = await app.$axios.get('/geo/getMenu')
        commit('home/setMenu', status2 === 200 ? menu : [])

        const { status: status3, data: { result } } = await app.$axios.get('/search/hotPlace', {
            params: {
                city: app.store.state.geo.position.city.replace('市', '')
            }
        })
        commit('home/setHotPlace', status3 === 200 ? result : [])

    }
}

// export const plugins = {
//     plugins: [
//         createVuexAlong({
//             // 设置保存的集合名字，避免同站点下的多项目数据冲突
//             name: "city-vuex-along",
//             local: {
//                 list: ["geo"],
//                 // 过滤模块 ma 数据， 将其他的存入 localStorage
//                 isFilter: true,
//             },
//             session: {
//                 // 保存模块 ma 中的 a1 到 sessionStorage
//                 list: ["geo"],
//             },
//         }),
//     ],
// }