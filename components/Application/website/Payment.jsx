"use client";
import bkash from "@/public/assets/images/bkash_logo.svg";
import qr from "@/public/assets/images/bkash_qr.jpeg";
import Image from "next/image";
import { FaMoneyBillWave } from "react-icons/fa";
function Payment({ paymentMethod, setPaymentMethod, register, errors }) {
  return (
    <div className=" mx-auto p-6 mt-6 border rounded-xl shadow-md bg-white ">
      <h2 className="text-2xl font-semibold mb-6">Select Payment Method</h2>

      {/* Cash On Delivery */}
      <div
        onClick={() => setPaymentMethod("cod")}
        className={`border rounded-lg p-4 mb-4 cursor-pointer transition ${
          paymentMethod === "cod" ? "border-green-500 bg-green-50" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <FaMoneyBillWave className="text-2xl text-green-600" />
          <span className="font-medium">Cash On Delivery</span>
        </div>
      </div>

      {/* bKash */}
      <div
        onClick={() => setPaymentMethod("bkash")}
        className={`border rounded-lg p-4 cursor-pointer transition ${
          paymentMethod === "bkash" ? "border-pink-500 bg-pink-50" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <Image
            alt="bkashlogo"
            src={bkash.src}
            width={55}
            height={45}
            className="text-2xl text-pink-600"
          />
          <span className="font-medium">Pay with bKash</span>
        </div>
      </div>

      {/* Nagad */}

      {/* bKash Expand Section */}
      {paymentMethod === "bkash" && (
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
                    <Image
                      src={qr.src}
                      width={120}
                      height={120}
                      alt="qr code"
                    />
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
      )}
    </div>
  );
}

export default Payment;
