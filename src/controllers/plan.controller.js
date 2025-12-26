import Plans from "../models/plan.js";
export const getPlans =async (req,res)=>{
    try{
       const plans = await Plans.find();
       if(plans.length===0){
        return res.status(404).json({ ok: false, message: "No plans found" });
       }
       return res.status(200).json({ ok: true, data: plans });
    }
    catch(err){
        return res.status(500).json({ ok: false, message: err?.message || "Internal server error" });
    }
}

export const createPlan = async (req,res)=>{
    try{
        const {code,fees,features,capacity} =req.body;
        if(!code || !fees || !features || !capacity){
            return res.status(400).json({ ok: false, message: "All fields are required" });
        }
        const Plan = await Plans.create({
            code,
            fees,
            features,
            capacity
        });
        return res.status(201).json({ ok: true, data: Plan });
    }
    catch(err){
        return res.status(500).json({ ok: false, message: err?.message || "Internal server error" });
    }
}

export const updatePlan = async(req,res)=>{
    try{
        const planId = req.params.id;
        const updateData = req.body;
        const updatedPlan = await Plans.findByIdAndUpdate(
            planId,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        return res.status(200).json({ ok: true, data: updatedPlan });
    }
    catch(err){
        return res.status(500).json({ ok: false, message: err?.message || "Internal server error" });
    }
}
export const deletePlan = async(req,res)=>{
    try{
        const planId = req.params.id;
        await Plans.findByIdAndDelete(planId);
        return res.status(200).json({ ok: true, message: "Plan deleted successfully" });
    }
    catch(err){
        return res.status(500).json({ ok: false, message: err?.message || "Internal server error" });
    }
}