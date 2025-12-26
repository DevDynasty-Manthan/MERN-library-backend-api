import mongoose from "mongoose";
import {Schema} from 'mongoose';
const seatingAssignmentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    planId:{
        type:Schema.Types.ObjectId,
        ref:'Plan',

        required:true
    },
    seatNo:{
        type : Number,
        required:true,
        // unique:true
        min : 1
    },
    status:{
        type:String,
        enum:['assigned','ended','pending'],
        default:'pending'
    },
    endAt :{
        type:Date,
        required:true,
        default: ()=>{
            const now = new Date();
            return new Date(now.setMonth(now.getMonth() + 1));
        }
    },
    startsAt:{
        type:Date,
        required:true
    }
},{timestamps:true})

seatingAssignmentSchema.index(
    {planId:1,seatNo:1,status:1},
    {unique:true}
)
seatingAssignmentSchema.index(
    {userId:1,status:1},
    {unique:true}
)
const seatAssignment = mongoose.model('seatAssignment',seatingAssignmentSchema);
export default seatAssignment;