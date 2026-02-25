import Image from "next/image";

function PaymentCard({ paymentMethod, register, img, errors }) {
  return (
    <div>
      <div className="mt-6 border rounded-xl p-6 bg-gray-50">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Side - Phone Number */}
          <div>
            <h4 className="font-semibold mb-2">Send Money To:</h4>
            <p className="text-lg font-bold text-pink-600 ">01765763455</p>
            <p className="text-sm text-gray-500 mt-2">
              Please send the exact amount to this number.
            </p>
          </div>

          {/* Right Side - QR + TrxID */}
          <div>
            <h4 className="font-semibold mb-2">Scan QR Code</h4>
            <div className="w-40 h-40 bg-white border flex items-center justify-center mb-4">
              {/* Replace with your real QR image */}
              <span className="text-gray-400 text-sm">
                <Image src={img.src} width={120} height={120} alt="qr code" />
              </span>
            </div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              {...register("bkashPhone")}
              type="number"
              placeholder="Enter bkash phone number"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            {errors?.bkashPhone && (
              <p className="text-red-500 text-sm">
                {errors.bkashPhone.message}
              </p>
            )}
            <label className="block text-sm font-medium mb-1">
              Transaction ID (TrxID)
            </label>
            <input
              {...register("trxId")}
              type="text"
              placeholder="Enter your TrxID"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            {errors?.trxId && (
              <p className="text-red-500 text-sm">{errors.trxId.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentCard;
