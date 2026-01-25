"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DT_CATEGORY_COLUMN,
  DT_COUPON_COLUMN,
  DT_PRODUCT_COLUMN,
  DT_PRODUCT_VARIANT_COLUMN,
} from "@/lib/column";
import { columnConfig } from "@/lib/helperFunctions";
import {
  ADMIN_CATEGORY_ADD,
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { FiPlus } from "react-icons/fi";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_TRASH, label: "Trash" },
];

const TRASH_CONFIG = {
  category: {
    title: "Category Trash",
    columns: DT_CATEGORY_COLUMN,
    fetchUrl: "/api/category",
    exportUrl: "/api/category/export",
    deleteUrl: "/api/category/delete",
  },
  product: {
    title: "Product Trash",
    columns: DT_PRODUCT_COLUMN,
    fetchUrl: "/api/product",
    exportUrl: "/api/product/export",
    deleteUrl: "/api/product/delete",
  },
  "product-variant": {
    title: "Product Trash",
    columns: DT_PRODUCT_VARIANT_COLUMN,
    fetchUrl: "/api/product-variant",
    exportUrl: "/api/product-variant/export",
    deleteUrl: "/api/product-variant/delete",
  },
  coupon: {
    title: "Coupon Trash",
    columns: DT_COUPON_COLUMN,
    fetchUrl: "/api/coupon",
    exportUrl: "/api/coupon/export",
    deleteUrl: "/api/coupon/delete",
  },
};

function Trash() {
  const searchParams = useSearchParams();
  const trashOf = searchParams.get("trashof");
  const config = TRASH_CONFIG[trashOf];

  const columns = useMemo(() => {
    if (!config) return [];
    return columnConfig(config.columns, false, false, true);
  }, [config?.columns]);
  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <DeleteAction
        key="delete"
        handleDelete={handleDelete}
        row={row}
        deleteType={deleteType}
      />,
    ];
  }, []);

  if (!config) {
    return <div>Invalid trash type</div>;
  }
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="py-2  px-3 border-b">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">{config.title}</h4>
            <Button>
              <FiPlus />
              <Link href={ADMIN_CATEGORY_ADD}>New Category</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <DatatableWrapper
            queryKey={`${trashOf}-data-deleted`}
            fetchUrl={config.fetchUrl}
            initialPageSize={10}
            columnsConfig={columns}
            exportEndPoint={config.exportUrl}
            deleteEndPoint={config.deleteUrl}
            deleteType="PD"
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default Trash;
