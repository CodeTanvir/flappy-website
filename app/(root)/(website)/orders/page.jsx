'use client'
import UserPanelLayout from "@/components/Application/website/UserPanelLayout";
import WebsiteBreadcrumb from "@/components/Application/website/WebsiteBreadcrumb";
import useFetch from "@/hooks/useFetch";
import { WEBSITE_ORDER_DETAILS } from "@/routes/WebsiteRoute";
import Link from "next/link";

const breadCrumbData = {
  title: "Orders",
  links: [{ label: "Orders" }],
};
function Orders() {
    const {data: orderData, loading} = useFetch("/api/user-order")
  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumbData} />
      <UserPanelLayout>
        <div className="shadow rounded">
          <div className="p-5 text-xl font-semibold border">Orders</div>
         
            <div className="p-5">
              {loading ? <div className="text-center py-5">Loading...</div> :
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                      Sr.No.
                    </th>
                    <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                      Order id
                    </th>
                    <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                      Total Item
                    </th>
                    <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                   orderData && orderData?.data?.map((order, i) => (
                      <tr key={order.Id}>
                        <td className="text-start text-sm text-gray-500 p-2 font-bold">
                          {i + 1}
                        </td>

                        <td className="text-start text-sm text-gray-500 p-2 font-bold">
                          <Link
                            className="underline hover:text-blue-400"
                            href={WEBSITE_ORDER_DETAILS(order.orderId)}
                          >
                            {order.orderId}
                          </Link>
                        </td>
                        <td className="text-start text-sm text-gray-500 p-2 font-bold">
                          {order.products.length}
                        </td>
                        <td className="text-start text-sm text-gray-500 p-2 font-bold">
                          {order.totalAmount.toLocaleString("en-BD", {
                            style: "currency",
                            currency: "BDT",
                          })}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            }
        </div>
        </div>
      </UserPanelLayout>
    </div>
  );
}

export default Orders;
