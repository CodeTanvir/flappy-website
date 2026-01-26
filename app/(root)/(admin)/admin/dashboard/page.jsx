import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import CountOverview from "./CountOverview";
import { OrderOverview } from "./OrderOverview";
import { OrderStatus } from "./OrderStatus";
import QuickAdd from "./QuickAdd";

function AdminDashboard() {
  return (
    <div className="pt-5">
      <CountOverview />
      <QuickAdd />
      <div className="mt-10 flex lg:flex-nowrap flex-warp gap-10">
        <Card className="rounded-lg lg:w-[70%] w-full p-0">
          <CardHeader className="py-3 border [.border-b]:pb-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Order Overview</span>
              <Button type="button">
                <Link href="">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <OrderOverview />
          </CardContent>
        </Card>
        <Card className="rounded-lg lg:w-[30%] w-full p-0">
          <CardHeader className="py-3 border [.border-b]:pb-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Order Status</span>
              <Button type="button">
                <Link href="">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <OrderStatus />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
