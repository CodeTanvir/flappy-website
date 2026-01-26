import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import CountOverview from "./CountOverview";
import QuickAdd from "./QuickAdd";

function AdminDashboard() {
  return (
    <div className="pt-5">
      <CountOverview />
      <QuickAdd />
      <div className="mt-10 flex lg:flex-nowrap flex-warp gap-10">
        <Card className="rounded-lg lg:w-[70%] w-full p-0">
          <CardHeader className="py-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                <Button type="button">
                  <Link href="">View All</Link>
                </Button>
              </span>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
