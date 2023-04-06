import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let Category = new Schema({
    prop: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Property'
    },
    name: { type: String },
    cap: { type: String },
  

}, { _id: false, timestamps: false });


let Value = new Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Item'
    },
    name: { type: String },
    cap: { type: String },
   
}, { _id: false, timestamps: false });


let Property = new Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Value'
    },
    name: { type: String },
    cap: { type: String },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    },
    values: [{Value}]

}, { _id: false, timestamps: false });

let Item = new Schema({
   
    name: { type: String },
    cap: { type: String },
    workplace: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Workplace'
    }, 
    values: [{
        Value
    }]
}, { _id: true, timestamps: false });

export default mongoose.model("Item", Item);  