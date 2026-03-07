import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import MediaModel from "@/models/Media.model";
import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
ProductModel;
ProductVariantModel;
MediaModel;
export async function PUT(request){
    try{
        const auth = await isAuthenticated('admin');
        if(!auth.isAuth){
            return response(false,403,'Unauthorized')
        }
        await connectDB()
        const {_id,status} = await request.json();
        if(!_id || !status){
            return response(false, 400, 'Order id status are required')
        }
        const orderData = await OrderModel.findById(_id);
      
        if(!orderData){
            return response(false, 404, 'Order not found')
        }
        orderData.status = status;
        await orderData.save()
        return response(true, 200,'Order Status Updated',orderData)
    }catch(error){
        return catchError(error)
    }
}