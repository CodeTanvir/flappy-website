import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import MediaModel from "@/models/Media.model";
import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
ProductModel;
ProductVariantModel;
MediaModel;
export async function GET(request,{params}){
    try{
        await connectDB()
        const getParams = await params;
        const orderid = getParams.orderid

        if(!orderid){
            return response(false, 404, 'Order not found')
        }
        const orderData = await OrderModel.findOne({orderId:orderid}).populate({
            path:'products.variantId',
            populate:{path:'media'}
        }).populate({
            path:'products.productId',
            select:'slug name'
        }).lean();
      
        if(!orderData){
            return response(false, 404, 'Order not found')
        }
        return response(true, 200,'Order found',orderData)
    }catch(error){
        return catchError(error)
    }
}