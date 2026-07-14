'use client'
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import Select from "@/components/Application/Select";
import useFetch from "@/hooks/useFetch";
import { formatBDDateTime } from "@/lib/dateFormatter";
import { showToast } from "@/lib/showToast";
import placeholderImg from "@/public/assets/images/img-placeholder.webp";
import { ADMIN_DASHBOARD, ADMIN_ORDER_SHOW } from "@/routes/AdminPanelRoute";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_ORDER_SHOW, label: 'orders' },
  { href: '', label: 'Order Details' }
];
const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Unverified', value: 'unverified' }
]
function OrderDetails({ params }) {

  const [orderData, setOrderData] = useState();
  const [orderStatus, setOrderStatus] = useState();
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const { order_id } = params;

  const { data, loading } = useFetch(`/api/orders/get/${order_id}`)

  useEffect(() => {
    if (data && data.success) {
      setOrderData(data.data)
      setOrderStatus(data?.data?.status)
    }
  }, [data])
  const handleOrderStatus = async () => {
    setUpdatingStatus(true)
    try {
      const { data: response } = await axios.put('/api/orders/update-status', {
        _id: orderData?._id,
        status: orderStatus
      })
      if (!response.success) {
        throw new Error(response.message)
      }
      showToast('success', response.message)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setUpdatingStatus(false)
    }
  }
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <div className=" px-5 border">
        {!orderData ? <div className="flex justify-center items-center py-32">
          <h4 className="text-red-500 text-xl font-semibold">Order Not Found</h4>
        </div> :
          <div>
            <div className="py-2 px-5 border-b mb-3">
              <h4 className="text-lg font-bold text-primary">Order Details</h4>
            </div>

            <div className="px-5 mb-5">
              <div className="mt-3 mb-5">
                <p><b>Order Id : </b>{orderData?.orderId}</p>
                <p><b>Payment Method : </b>{orderData?.paymentMethod}</p>
                <p className="capitalize"><b>Status: </b>{orderData?.status}</p>
                <p className="capitalize"><b>Time: </b>{formatBDDateTime(orderData?.createdAt)}</p>
              </div>
              <table className="w-full border">
                <thead className="border-b bg-gray-50 dark:bg-card md:table-header-group hidden">
                  <tr>
                    <th className="text-center p-3">Product</th>

                    <th className="text-center p-3">Price</th>
                    <th className="text-center p-3">Quantity</th>
                    <th className="text-center p-3">Total</th>
                    <th className="text-center p-3">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData && orderData?.products.map((product) => (

                    <tr key={product.variantId._id} className="md:table-row block border-b">
                      <td className=" md:table-cell p-3">
                        <div className="flex items-center gap-5">
                          <Image width={60} height={60} alt="product" className="rounded"
                            src={product?.variantId?.media?.[0]?.secure_url || placeholderImg.src} />
                          <div>
                            <h4 className="text-lg">
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
                        <span>{product.sellingPrice.toLocaleString('en-BD', { style: 'currency', currency: 'BDT' })}</span>
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
                        <span>{(product.qty * product.sellingPrice).toLocaleString('en-BD', { style: 'currency', currency: 'BDT' })}</span>

                       
                      </td>
                       <td className="md:table-cell 
                  flex justify-between
                   md:p-3 px-3 pb-2 text-center">

                          <span className="md:hidden font-medium">Location</span>

                          <span>
                            {
                              orderData?.allocations
                                ?.filter(
                                  allocation =>
                                    allocation.productVariantId === product.variantId._id
                                )
                                .map((allocation, index) => (
                                  <span key={index} className="block">
                                    {allocation.location}
                                  </span>
                                ))
                            }
                          </span>

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
                          <td className="text-end py-2">{orderData?.name}</td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">Email</td>
                          <td className="text-end py-2">{orderData?.email}</td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">Phone</td>
                          <td className="text-end py-2">{orderData?.phone}</td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">District</td>
                          <td className="text-end py-2">{orderData?.district}</td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">Street</td>
                          <td className="text-end py-2">{orderData?.street}</td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">zip code</td>
                          <td className="text-end py-2">{orderData?.zipcode ?? 'not given'}</td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">Order Note</td>
                          <td className="text-end py-2">{orderData?.ordernote || 'not given'}</td>
                        </tr>
                        {orderData?.paymentMethod === 'bkash' && (
                          <tr>
                            <td colSpan="2" className="py-4">
                              <div className="rounded-xl border border-pink-200 bg-pink-50 p-4 dark:bg-pink-950/20 dark:border-pink-800">

                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold">
                                    ৳
                                  </div>

                                  <div>
                                    <h5 className="font-semibold text-pink-700 dark:text-pink-400">
                                      bKash Payment
                                    </h5>
                                    <p className="text-sm text-gray-500">
                                      Customer payment information
                                    </p>
                                  </div>
                                </div>


                                <div className="space-y-3">

                                  <div className="flex justify-between bg-white dark:bg-card rounded-lg px-3 py-2">
                                    <span className="font-medium">
                                      bKash Number
                                    </span>

                                    <span className="text-gray-700 dark:text-gray-300">
                                      {orderData?.bkash?.phoneNumber || 'Not given'}
                                    </span>
                                  </div>


                                  <div className="flex justify-between bg-white dark:bg-card rounded-lg px-3 py-2">
                                    <span className="font-medium">
                                      Transaction ID
                                    </span>

                                    <span className="font-semibold text-pink-600">
                                      {orderData?.bkash?.trxId || 'Not given'}
                                    </span>
                                  </div>

                                </div>

                              </div>
                            </td>
                          </tr>
                        )}

                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="p-5 bg-gray-50 dark:bg-card">
                  <h4 className="text-lg font-semibold mb-5">Order Summary</h4>

                  <div>
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="font-medium py-2">Subtotal</td>
                          <td className="text-end py-2">{orderData?.subtotal.toLocaleString('en-BD', {
                            style: 'currency', currency: 'BDT'
                          })}</td>
                        </tr>

                        <tr>
                          <td className="font-medium py-2">Discount</td>
                          <td className="text-end py-2">{orderData?.discount.toLocaleString('en-BD', {
                            style: 'currency', currency: 'BDT'
                          })}</td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">Coupon Discount</td>
                          <td className="text-end py-2">{orderData?.couponDiscountAmount.toLocaleString('en-BD', {
                            style: 'currency', currency: 'BDT'
                          })}</td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">Total</td>
                          <td className="text-end py-2">{orderData?.totalAmount.toLocaleString('en-BD', {
                            style: 'currency', currency: 'BDT'
                          })}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <hr />
                  <div className="pt-3">
                    <h4 className="text-lg font-semibold mb-2">Order Status</h4>
                    <Select options={statusOptions}
                      selected={orderStatus}
                      setSelected={(value) => setOrderStatus(value)}
                      placeholder="Select"
                      isMulti={false} />
                    <ButtonLoading type="button" loading={updatingStatus} onClick={handleOrderStatus}
                      className="mt-5 cursor-pointer" text="Update Status" />
                  </div>
                </div>
              </div></div>




          </div>}
      </div>
    </div>
  );
};

export default OrderDetails;
