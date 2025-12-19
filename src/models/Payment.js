import mongoose from 'mongoose'

const paymentSchema= new mongoose.Schema({
    amount : {
        type : Number,
        required: true
    },
    screenshotUrl:{
        required :  true,
        type: String
    },
    transactionId : {
        type : String,
        required : true
    },
    method : {
        type : String,
        enum : ["cash","upi","online"],
        required : true
    },
    status:{
        type:String,
        enum : ["pending","verified","rejected"],
        default: "pending"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",          // link to User
      required: true      // you can make it true later when flow is fixed
    }

},{timestamps:true})

const Payment = mongoose.model('payment',paymentSchema)
export default Payment ;