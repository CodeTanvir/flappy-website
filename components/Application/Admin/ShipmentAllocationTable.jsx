"use client";

import { useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import { useTheme } from "next-themes";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import { Badge } from "@/components/ui/badge";
import { darkTheme, lightTheme } from "@/lib/materialTheme";

function ShipmentAllocationTable() {
  const { resolvedTheme } = useTheme();

  const { data, isLoading, isError, isRefetching } = useQuery({
    queryKey: ["shipment-allocation"],
    queryFn: async () => {
      const { data } = await axios.get("/api/allocation/get");
        console.log("API RESPONSE:", data);
      return data.data || [];
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "productVariantId",
        header: "Image",
        size: 70,
        Cell: ({ row }) => {
          const image =
            row.original.productVariantId?.media?.[0]?.secure_url ||
            "/placeholder.png";

          return (
            <Image
              src={image}
              alt="Product"
              width={50}
              height={50}
              className="rounded-md border object-cover"
            />
          );
        },
      },

      {
        accessorKey: "productName",
        header: "Product",
        Cell: ({ row }) => (
          <div>
            <p className="font-medium">
              {row.original.productVariantId?.product?.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.original.productVariantId?.color} •{" "}
              {row.original.productVariantId?.size}
            </p>
          </div>
        ),
      },

      {
        accessorKey: "qty",
        header: "Allocated Qty",
        size: 80,
      },

      {
        accessorKey: "purchase",
        header: "Purchased Qty",
        Cell: ({ row }) => row.original.purchaseId?.totalQty ?? "-",
      },

      {
        accessorKey: "order",
        header: "Order",
        Cell: ({ row }) => row.original.orderId?.orderId ?? "-",
      },

      {
        accessorKey: "location",
        header: "Location",
        Cell: ({ cell }) => {
          const location = cell.getValue();

          const labels = {
            "cn-online": "CN Online",
            "cn-warehouse": "CN Warehouse",
            "bd-warehouse": "BD Warehouse",
            "in-shipment": "In Shipment",
          };

          return (
            <Badge variant="secondary">
              {labels[location] || location}
            </Badge>
          );
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: data || [],

    enableRowSelection: true,
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableDensityToggle: true,
    enableFullScreenToggle: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,

    state: {
      isLoading,
      showProgressBars: isRefetching,
      showAlertBanner: isError,
    },

    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Failed to load allocation data",
        }
      : undefined,

    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 15,
      },
    },

    getRowId: (row) => row._id,
  });

  return (
    <ThemeProvider
      theme={resolvedTheme === "dark" ? darkTheme : lightTheme}
    >
      <MaterialReactTable table={table} />
    </ThemeProvider>
  );
}

export default ShipmentAllocationTable;