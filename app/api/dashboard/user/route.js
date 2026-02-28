import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import MediaModel from "@/models/Media.model";
import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
ProductVariantModel;
MediaModel;
ProductModel;
export async function GET(){
    try {
        await connectDB();
        const auth = await isAuthenticated('user')
        console.log(`user ${auth}`)
        if(!auth.isAuth){
            return response(false, 401, 'Unauthorized')
        }
        const userId = auth.userId

        //get recent orders
        const recentOrders = await OrderModel.find({userId:userId}).populate('products.productId','name slug')
        .populate({
            path:'products.variantId',
            populate:{path:'media'}
        }).lean()
        //get total order count
        
        const totalOrder = await OrderModel.countDocuments({userId:userId});
        return response(true, 200, 'Dashboard info', {recentOrders, totalOrder})
    } catch (error) {
        console.log(error)
        return catchError(error)
    }
}