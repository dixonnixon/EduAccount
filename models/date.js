import mongoose from 'mongoose';
let Schema = mongoose.Schema;


let Date = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Educator'
    },
    date: {type: DateTime},
    name: {type: String}

}, { id: false, timestamps: true });


export default mongoose.model("Date", Date);