import mongoose from 'mongoose';
let Schema = mongoose.Schema;


let Street = new Schema({
    address: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Address'
    },
    buildNo: { type: Number},
    name: { type: String }

}, { _id: false, timestamps: false });

let Address = new Schema({
    owner: { //experimental
        type: mongoose.Schema.Types.ObjectId,
    },
    city: { type: String},
    street: [Street],
    postIndex: { type: Number},

}, { _id: true, timestamps: false });


export default mongoose.model("Address", Address);  