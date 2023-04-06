import mongoose from 'mongoose';
let Schema = mongoose.Schema;


let Workplace = new Schema({
    // educators: [{
    //     type: mongoose.Schema.Types.ObjectId, ref: 'Educator'
    // }],
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }], //FE:
    wpNo: { type: Number },
}, { id: false, timestamps: true });


export default mongoose.model("Workplace", Workplace);