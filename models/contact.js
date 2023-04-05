import mongoose from 'mongoose';
let Schema = mongoose.Schema;


let Contact = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Educator'
    },
    contactNo: {type: Sting},
    name: { type: String }

}, { id: false, timestamps: true });


export default mongoose.model("Contact", Contact);