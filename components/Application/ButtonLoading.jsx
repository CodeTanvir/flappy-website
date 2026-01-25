import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"

export function ButtonLoading({type,text,loading,className,onClick,...props}) {
  return (
    <Button  
    type={type} 
    disabled={loading}
     onClick={onClick} 
     className={cn("",className)}
     {...props}>
        {loading && 
        <Spinner />
        }
      {text}
    </Button>
  )
}
