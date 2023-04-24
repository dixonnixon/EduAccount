import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let Category = new Schema({
    name: { type: String,  index: { unique: true }, trim: true, lowercase: true },
    cap: { type: String }
}, {  timestamps: false });


Category.path('name').index({ unique: true });



export default mongoose.model("Category", Category);