import mongoose from 'mongoose'
const Schema = mongoose.Schema
const Changecity = new Schema({
    city: {
        type: String,
        require: true
    },
    province: {
        type: String,
        require: true
    }
})

export default mongoose.model('Changecity', Changecity)