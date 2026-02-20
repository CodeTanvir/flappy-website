import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { zSchema } from "@/lib/zodSchema";

export async function POST(request){
    try{
        await connectDB();
        const payload = await request.json();
        const schema = zSchema.pick({
            amount:true
        })
        const validate = schema.safeParse(payload)
        if(!validate){
            return response(false, 400, 'Invalid or missing fields', validate.error)
        }
        const {amount} = validate.data;
    }catch(error){
        return catchError(error)
    }
}