import mongoose from 'mongoose';
let Schema = mongoose.Schema;


let Workplace = new Schema({
    // educators: [{
    //     type: mongoose.Schema.Types.ObjectId, ref: 'Educator'
    // }],
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' ,
        index: { unique: true },
    }], //FE:
    wpNo: { type: Number },
    floor: { type : String },
    cabinet: { type: String } 
}, { id: false, timestamps: true });


Workplace.virtual('wpnumber')
    .get(function () {
        return this.wpNo + this.floor + this.cabinet;
    })


export default mongoose.model("Workplace", Workplace);