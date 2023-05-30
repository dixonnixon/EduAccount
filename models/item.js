import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let Value = new Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Item'
    },
    name: { type: String },
    cap: { type: String },
    property: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Property'
    },
    value: { type: String }
}, {  timestamps: false, _id: true });


// mongoose.model("Value", Value)

let Item = new Schema({
   
    name: { type: String },
    cap: { type: String },
    workplace: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Workplace'
    }, 
    values:  { type: [ Value ] },
}, { _id: true, timestamps: false });

export default mongoose.model("Item", Item);  