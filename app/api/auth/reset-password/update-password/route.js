import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunctions";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";

export async function PUT(request){
    console.log(request)
    try{
        await connectDB();
        const payload = await request.json();
        console.log(payload)
        const validationSchema = zSchema.pick({
            email:true,password:true
        });
        const validatedData = validationSchema.safeParse(payload);
        console.log(validatedData)
        if(!validatedData.success){
            return response(false, 401, 
                "Invalid or missing input field",validatedData.error)
        }
        const {email,password} = validatedData.data;
        const getUser = await UserModel.findOne({deletedAt:null,email}).select("+password");
        if(!getUser){
            return response(false,404,"User not Found")
        }
        getUser.password = password;
        await getUser.save();
        return response(true,200,'password update success')
    }catch(error){
        catchError(error)
    }
}