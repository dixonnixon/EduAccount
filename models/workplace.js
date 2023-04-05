import mongoose from 'mongoose';
let Schema = mongoose.Schema;


let Workplace = new Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Educator'
    }],
    items: [{ type: String }], //FE:
    wpNo: {type: Number},
    macaddres: {type: Sting, required: true}
}, { id: false, timestamps: true });


export default mongoose.model("Workplace", Workplace);