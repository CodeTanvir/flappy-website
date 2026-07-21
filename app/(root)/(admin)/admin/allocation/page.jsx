"use client"

import ShipmentAllocationTable from "@/components/Application/Admin/ShipmentAllocationTable"
import { Card, CardContent, CardHeader } from "@/components/ui/card";


 function Allocation() {
    return (
<Card className="mt-5 py-0 rounded shadow-sm">
  <CardHeader className="py-2 px-3 border-b">
    <h4 className="text-xl font-semibold">
      Shipment Allocation
    </h4>
  </CardHeader>

  <CardContent className="p-0">
    <ShipmentAllocationTable />
  </CardContent>
</Card>
            
    )

}
export default Allocation