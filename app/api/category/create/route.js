import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";

export async function POST(request){
   try{
        const auth = await isAuthenticated('admin')
        console.log(auth)
        if(!auth.isAuth){
            return response(false, 403, 'Unauthorized')
        }
        await connectDB();
        const payload = await request.json()

        const schema = zSchema.pick({
            name:true,
            slug:true,
        })
        const validate = schema.safeParse(payload);
        if(!validate.success){
            return response(false, 400, "Invalid or missing fields", validate.error)
        }

        const {name, slug} = validate.data;
        const newCategory = new CategoryModel({
            name,
            slug,
        })
        await newCategory.save();

        return response(true, 201, "Category created successfully")
   }catch(error){

    return catchError(error)

   }
}