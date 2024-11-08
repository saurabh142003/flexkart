import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  imageUrls: { type: [String], required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  regularPrice: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  offer: { type: Boolean, required: true },
  ownerRef: {
    type: String,
    required: true,
  },
  category:{ type : String, required:true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product
