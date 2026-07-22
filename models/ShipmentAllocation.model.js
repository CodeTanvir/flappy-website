import mongoose from "mongoose";


 const shipmentAllocationSchema = new mongoose.Schema(
{
    shipmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shipment",
        required:true,
        unique:true,
    },

    products:[
        {
            variantId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"ProductVariant",
                required:true,
            },

            qty:{
                type:Number,
                required:true,
                min:1,
            }
        }
    ]
},
{
    timestamps:true
});

export default mongoose.models.ShipmentAllocation ||
mongoose.model(
  "ShipmentAllocation",
  shipmentAllocationSchema,
  "shipmentAllocation"
);