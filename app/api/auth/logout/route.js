import { connectDB } from "@/lib/databaseConnection";
import{catchError, response} from "@/lib/helperFunctions";
import { cookies } from "next/headers";

export async function POST(request){
    try{
        await connectDB();
        const cookieStore = await cookies();
        cookieStore.delete('access_token')
        return response(true, 200, 'Logout successfull')
    }catch(error){
        catchError(error)
        return response(false,500,'Internal server error')

    }
}