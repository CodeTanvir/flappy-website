import mongoose from "mongoose";


const shipmentSchema = new mongoose.Schema({
    shipmentType:{
        type:String,
        required:true,
        trim:true,
    },
    date:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    costPerWeight:{
        type:Number,
        required:true
    },
    totalWeight:{
        type:Number,
        required:true
    },
    additionalCost:{
        type:Number,
        
    },
    city:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true

    },
   documents: [
  {
    type: String,
    
  },
],
   
    deletedAt:{
        type:Date,
        default:null,
        index:true
    }
 
},{timestamps:true});


const ShipmentModel = mongoose.models.Shipment || mongoose.model('Shipment',shipmentSchema,'shipment');

export default ShipmentModel;