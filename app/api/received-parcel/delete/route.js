import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import ReceivedParcelModel from "@/models/ReceivedParcel.model";


export async function DELETE(request){
try{
   await connectDB();
    const {id} = await request.json();
    console.log(id)
    if(!id){
        return response(false,404, "Invalid or missing Id")
    }
    await ReceivedParcelModel.findByIdAndDelete(id);
    return response( true,200, 'Data Reset successfull')
}catch(error){
    return catchError(error)
}
}