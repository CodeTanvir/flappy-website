import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import StockModel from "@/models/Stock.model";

export async function POST(request){
    try{
        const auth = await isAuthenticated('admin');
        if(!auth.isAuth){
            return response(false, 403, 'Unauthorized')
        }
        await connectDB();
        const payload = await request.json()

        const newStock = new StockModel({
            productId: payload.productId,
            variantId: payload.variantId,
            stock:payload.stock,
            buyingPrice:payload.buyingPrice
        })
        await newStock.save()
        return response(true, 201, "Stock Updated")
    }catch(error){
        return catchError(error)
    }
}