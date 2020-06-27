import axios from '../server/interface/utils/axios'

export default async function({ store }) {
    const { status, data: { newCity } } = await axios.get('/geo/getChangeCity')
    if (newCity[0].city) {

        console.log(newCity[0].city)
        await store.commit('geo/setPosition', { city: newCity[0].city })
        const { status: status3, data: { result } } = await axios.get('/search/hotPlace', {
            params: {
                city: store.state.geo.position.city.replace('市', '')
            }
        })
        await store.commit('home/setHotPlace', status3 === 200 ? result : [])
    } else {
        // await store.commit('geo/setPosition', { city: newCity[0].city })
    }
}