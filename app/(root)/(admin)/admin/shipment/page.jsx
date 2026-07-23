"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import EditAction from "@/components/Application/Admin/EditAction";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { DT_SHIPMENT_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunctions";

import {
  ADMIN_DASHBOARD,
  ADMIN_SHIPMENT_ADD,
  ADMIN_SHIPMENT_EDIT,
  ADMIN_SHIPMENT_SHOW,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_SHIPMENT_SHOW,
    label: "Shipment",
  },
];

function ShowShipment() {
  const columns = useMemo(() => {
    return columnConfig(DT_SHIPMENT_COLUMN);
  }, []);

  const action = useCallback(
    (row, deleteType, handleDelete) => {
      return [
        <EditAction
          key="edit"
        //   href={ADMIN_SHIPMENT_EDIT(row.original._id)}
        />,

        <DeleteAction
          key="delete"
          row={row}
          deleteType={deleteType}
          handleDelete={handleDelete}
        />,
      ];
    },
    []
  );

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="py-2 px-3 border-b">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold">
              Show Shipments
            </h4>

            <Button asChild>
              <Link href="">
                <FiPlus />
                New Shipment
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-0">
          <DatatableWrapper
            queryKey="shipment-data"
            fetchUrl="/api/shipment"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndPoint="/api/shipment/export"
            deleteEndPoint="/api/shipment/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=shipment`}
            createAction={action}
            enableRowActions={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ShowShipment;