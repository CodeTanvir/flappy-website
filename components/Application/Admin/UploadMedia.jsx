'use client'
import { Button } from "@/components/ui/button"
import { showToast } from "@/lib/showToast";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary"
import { FiPlus } from "react-icons/fi";


function UploadMedia({isMultiple,queryClient}) {
    
    // const toastMessage = useRef(null)

    // const handleOnError = (error) =>{
    //     // toastMessage.current = { type: "error", text: error?.statusText || "Upload error" }
    //     showToast( "error",  error?.message || "Upload error" )
    // }

    const handleOnQueueEnd = async (results) =>{
        const files = results.info.files;
        
        const uploadedFiles = files.filter(file => file.uploadInfo).map(file =>({
            asset_id: file.uploadInfo.asset_id,
            public_id: file.uploadInfo.public_id,
            secure_url: file.uploadInfo.secure_url,
            path:file.uploadInfo.path,
            thumbnail_url: file.uploadInfo.thumbnail_url,
        }));
        console.log(uploadedFiles)
        if(uploadedFiles.length > 0){
            try{
                const {data: mediaUploadResponse} = 
                await axios.post('/api/media/create', uploadedFiles);
                // toastMessage.current = null
                if(!mediaUploadResponse.success){
                    throw new Error(mediaUploadResponse.message)
                }
                // toastMessage.current = { type: "success", text: mediaUploadResponse.message }
                queryClient.invalidateQueries(['media-data']);
                showToast('success',mediaUploadResponse.message)
                
            }catch(error){
                // toastMessage.current = { type: "error", text: error.message }
                showToast('error', error.message)
               
            }
        }
    }
    // const handleWidgetClose = () => {
    //     if (toastMessage.current) {
    //         showToast(toastMessage.current.type, toastMessage.current.text)
            
    //     }
    // }
    return (
        <div >
            <CldUploadWidget 
            signatureEndpoint="/api/cloudinary-signature"
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            // onError={handleOnError}
            onQueuesEnd={handleOnQueueEnd}
            // onClose={handleWidgetClose}
            config={{
                cloud:{
                    cloudName:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                }
            }}
            options={{
                multiple:isMultiple,
                sources:['local','url','unsplash','google_drive'],
                display: "inferior"
            }}
            >  

            {({open})=>{
                return(
                    <Button onClick={()=>open()}>
                    <FiPlus/>
                    Upload Media
                </Button>
                )}
            }

            </CldUploadWidget>
        </div>
    )
}

export default UploadMedia
