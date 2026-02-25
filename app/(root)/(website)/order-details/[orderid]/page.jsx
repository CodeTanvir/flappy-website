import WebsiteBreadcrumb from "@/components/Application/website/WebsiteBreadcrumb";
import placeholderImg from "@/public/assets/images/img-placeholder.webp";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
async function OrderDetails({ params }) {
  const { orderid } = await params;
  const { data: orderData } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/get/${orderid}`,
  );
  
  const breadCrumb = {
    title: "Order Details",
    links: [{ label: "Order Details" }],
  };
  return (
    <div>
      <div className="lg:px-32 px-5 my-20">
      <WebsiteBreadcrumb props={breadCrumb} />
      {orderData && !orderData.success ? <div className="flex justify-center items-center py-32">
        <h4 className="text-red-500 text-xl font-semibold">Order Not Found</h4>
      </div> :
      <div>
        <div className="mt-3 mb-5">
          <p><b>Order Id : </b>{orderData?.data?.orderId}</p>
           <p><b>Payment Method : </b>{orderData?.data?.paymentMethod}</p>
           <p className="capitalize"><b>Status: </b>{orderData?.data?.status}</p>
        </div>
        <table className="w-full border">
          <thead className="border-b bg-gray-50 md:table-header-group hidden">
            <tr>
              <th className="text-center p-3">Product</th>

              <th className="text-center p-3">Price</th>
              <th className="text-center p-3">Quantity</th>
              <th className="text-center p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderData && orderData?.data?.products.map((product)=>(
             
              <tr key={product.variantId._id} className="md:table-row block border-b">
                <td className="p-3">
                  <div className="flex items-center gap-5">
                    <Image width={60} height={60} alt="product" className="rounded"
                     src={product?.variantId?.media?.[0]?.secure_url || placeholderImg.src}/>
                     <div>
                      <h4 className="text-lg line-clamp-1">
                        <Link href={WEBSITE_PRODUCT_DETAILS(product?.productId?.slug)}>
                        {product?.productId?.name}
                        </Link>
                        <p>Color: {product?.variantId?.color}</p>
                        <p>Size: {product?.variantId?.size}</p>
                      </h4>
                     </div>
                  </div>
                </td>
                <td className="md:table-cell 
                  flex justify-between
                   md:p-3 px-3 pb-2 text-center">
                  <span className="md:hidden font-medium">Price</span>
                  <span>{product.sellingPrice.toLocaleString('en-BD',{style:'currency', currency:'BDT'})}</span>
                </td>
                <td className="md:table-cell 
                  flex justify-between
                   md:p-3 px-3 pb-2 text-center">
                  <span className="md:hidden font-medium">Quantity</span>
                  <span>{product.qty}</span>
                </td>
                  <td className="md:table-cell 
                  flex justify-between
                   md:p-3 px-3 pb-2 text-center">
                  <span className="md:hidden font-medium">Total</span>
                  <span>{(product.qty * product.sellingPrice).toLocaleString('en-BD',{style:'currency', currency:'BDT'})}</span>
                </td>
              </tr>

            ))}
          </tbody>
        </table>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-10 border mt-10">
          <div className="p-5">
          <h4 className="text-lg font-semibold mb-5">Shipping Address</h4>

          <div>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-medium py-2">Name</td>
                  <td className="text-end py-2">{orderData?.data?.name}</td>
                </tr>
                <tr>
                  <td className="font-medium py-2">Email</td>
                  <td className="text-end py-2">{orderData?.data?.email}</td>
                </tr>
                 <tr>
                  <td className="font-medium py-2">Phone</td>
                  <td className="text-end py-2">{orderData?.data?.phone}</td>
                </tr>
                 <tr>
                  <td className="font-medium py-2">District</td>
                  <td className="text-end py-2">{orderData?.data?.district}</td>
                </tr>
                 <tr>
                  <td className="font-medium py-2">Street</td>
                  <td className="text-end py-2">{orderData?.data?.street}</td>
                </tr>
                 <tr>
                  <td className="font-medium py-2">zip</td>
                  <td className="text-end py-2">{orderData?.data?.zip ?? 'not given'}</td>
                </tr>
                 <tr>
                  <td className="font-medium py-2">Order Note</td>
                  <td className="text-end py-2">{orderData?.data?.ordernote || 'not given'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>
          <div className="p-5 bg-gray-50">
          <h4 className="text-lg font-semibold mb-5">Order Summary</h4>

          <div>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-medium py-2">Subtotal</td>
                  <td className="text-end py-2">{orderData?.data?.subtotal.toLocaleString('en-BD',{
                    style:'currency',currency:'BDT'
                  })}</td>
                </tr>
               
              <tr>
                  <td className="font-medium py-2">Discount</td>
                  <td className="text-end py-2">{orderData?.data?.discount.toLocaleString('en-BD',{
                    style:'currency',currency:'BDT'
                  })}</td>
                </tr>
                <tr>
                  <td className="font-medium py-2">Coupon Discount</td>
                  <td className="text-end py-2">{orderData?.data?.couponDiscountAmount.toLocaleString('en-BD',{
                    style:'currency',currency:'BDT'
                  })}</td>
                </tr>
                <tr>
                  <td className="font-medium py-2">Total</td>
                  <td className="text-end py-2">{orderData?.data?.totalAmount.toLocaleString('en-BD',{
                    style:'currency',currency:'BDT'
                  })}</td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>
        </div>


        </div>}
        </div>
    </div>
  );
}

export default OrderDetails;
