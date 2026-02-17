import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon.model";

export async function POST(request){
    
    try{
        
        await connectDB();
        const payload = await request.json()
        const couponFormSchema = zSchema.pick({
            code:true,
            minShoppingAmount:true
        })
        const validate = couponFormSchema.safeParse(payload)
        if(!validate.success){
            return response(false, 400, 'Missing or Invalid data.', validate.error)
        }
        const {code, minShoppingAmount} = validate.data
        const couponData = await CouponModel.findOne({code}).lean()
        if(!couponData){
            return response(false,400,'Invalid or Expired coupon code')
        }
        if(new Date() > couponData.validity){
            return response(false, 400, 'Coupon code expired')
        }
        if(minShoppingAmount < couponData.minShoppingAmount){
            return response(false, 400, 'In-sufficient shopping amount')
        }
        return response(true, 200, 'Coupon applied successfully',{discountPercentage: couponData.discountPercentage})
    }catch(error){
        console.log(error)
        return catchError(error)
    }
}