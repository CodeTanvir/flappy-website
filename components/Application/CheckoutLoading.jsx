import loading from "@/public/assets/images/loading.svg";
import Image from "next/image";

function CheckoutLoading() {
  return (
    <div className="flex justify-center items-center bg-black/10 h-screen w-screen">
      <Image src={loading} height={120} width={120} alt="loading" />
      <h4 className="font-semibold">Order Confirming....</h4>
    </div>
  );
}

export default CheckoutLoading;
