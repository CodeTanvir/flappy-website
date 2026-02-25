import loading from "@/public/assets/images/loading.svg";
import Image from "next/image";
function Loading() {
  return (
    <div>
      <Image
        className="h-screen w-screen flex justify-center 
            items-start mt-12"
        src={loading.src}
        height={10}
        width={10}
        alt="loading"
      />
    </div>
  );
}

export default Loading;
