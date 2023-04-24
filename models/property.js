import mongoose from 'mongoose';
let Schema = mongoose.Schema;



let Property = new Schema({
   
    name: { type: String, index: { unique: true }, trim: true, lowercase: true },
    cap: { type: String },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    },
    // values: [{Value}]

}, { timestamps: false });


export default mongoose.model("Property", Property);  