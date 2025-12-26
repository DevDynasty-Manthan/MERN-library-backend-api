import seatAssignment from "../models/seatAssignment.js";
import Student from "../models/Student.js";
import Plan from "../models/plan.js";

export const getAvailableSeats = async (req, res) => {
try{
  //gettin the primary data
  const { planId }= req.query
  const userId = req.user.id;
  // checking if the plan id is provided
  if(!planId){
    return res.status(400).json({ ok: false, message: "Plan ID is required" });
  }
  // checking if the plan exists
  const plan = await Plan.findById(planId);
  if(!plan){
    return res.status(404).json({ ok: false, message: "Plan not found" });
  }
  //find the seats in the plan with assigned status
  const assignedSeats = await seatAssignment.find({planId : planId,
    status: "assigned"
  }).select("seatNo").lean(); //selecting only seatNo field
  
  const occupiedSeats = assignedSeats.map(seat => seat.seatNo);
  //all seats in the plan
  const totalSeats = Array.from({length: plan.capacity},(_,i)=>i+1);

  //if seat is assigned then skips that seat 
  const availableSeats = totalSeats.filter(seatNo=>{
    return !occupiedSeats.includes(seatNo);
  })
  return res.status(200).json({
    ok: true,
    data : {
      "planId": planId,
      "planCode": plan.code,
      "capacity": plan.capacity,
      "occupiedSeats": occupiedSeats,
      "availableSeats": availableSeats,
      "totalSeats": totalSeats
    }
  })
}
catch(err){
    return res.status(500).json({ ok: false, message: err?.message || "Internal server error" });
}
};

export const  requestSeat = async (req,res)=>{
  try{
     const userId = req.user.id;
     const {planId,seatNo} = req.body;

     if(!planId || !seatNo){  
      return res.status(400).json({ ok: false, message: "planId and seatNo are required" });
     }
     const hasActiveSeat = await seatAssignment.findOne({userId, status:'assigned'});
      if(hasActiveSeat){
        return res.status(400).json({ ok: false, message: "User already has an active seat assigned" });
      }
      const plan = await plan.findById(planId);
      if(!plan){
        return res.status(404).json({ ok: false, message: "Plan not found" });
      }
      if(seatNo<1 || seatNo>plan.capacity){
        return res.status(400).json({ ok: false, message: `seatNo must be between 1 and ${plan.capacity}` });
      }
     const assignment = await seatAssignment.create({
      userId,
      planId,
      seatNo,
      status: "assigned",
      startsAt: new Date(),
      endAt: new Date(new Date().setMonth(new Date().getMonth() + 1)) // 1 month
    });
    await Student.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          plan: planId,
          membershipStatus: "active"
        }
      },
      { upsert: true }
    );
     const populated = await seatAssignment
      .findById(assignment._id)
      .populate("planId", "code fees");

    return res.status(201).json({
      ok: true,
      message: `✅ Seat ${seatNo} assigned successfully!`,
      data: {
        assignmentId: assignment._id,
        seatNo,
        planCode: plan.code,
        validUntil: assignment.endAt
      }
    });
  }
  catch(err){
    return res.status(500).json({ ok: false, message: err?.message || "Internal server error" });
  }
}

// export const confirmSeatAssignment = async (req,res)=>{
//   try{

//     const student = await

//   }
//   catch(err){
//     return res.status(500).json({ ok: false, message: err?.message || "Internal server error" });
//   }
// }

