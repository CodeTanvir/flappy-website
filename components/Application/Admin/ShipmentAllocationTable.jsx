"use client";

import { useEffect, useMemo, useState } from "react";
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
import { formatBDDateTime, timeAgo } from "@/lib/dateFormatter";

export default function ShipmentAllocationTable() {
 
const {resolvedTheme} = useTheme()
  const {
    data,
  isLoading,
    isError,
    isRefetching,
  } = useQuery({
    queryKey: ["shipment-allocation"],
    queryFn: async () => {
      const { data: response } = await axios.get("/api/allocation/get");

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    },
  });

  const columns = useMemo(
    () => [
      {
        id: "image",
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
              className="rounded border object-cover"
            />
          );
        },
      },

      {
        id: "product",
        header: "Product",
        Cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {row.original.productVariantId?.product?.name || "-"}
            </div>
            <div className="text-xs text-muted-foreground">
              {row.original.productVariantId?.color || "-"} /{" "}
              {row.original.productVariantId?.size || "-"}
            </div>
          </div>
        ),
      },

      {
        accessorKey: "qty",
        header: "Allocated",
      },

      {
        id: "purchase",
        header: "Purchased",
        Cell: ({ row }) =>
          row.original.purchaseId?.totalQty ?? "-",
      },

      {
        id: "order",
        header: "Order",
        Cell: ({ row }) =>
          row.original.orderId?.orderId ?? "-",
      },
{
  id: "orderAge",
  header: "Order Age",
  Cell: ({ row }) => {
    const createdAt = row.original.orderId?.createdAt;

    return (
      <div>
        <div className="font-medium">
          {timeAgo(createdAt)}
        </div>

        <div className="text-xs text-muted-foreground">
          {formatBDDateTime(createdAt)}
        </div>
      </div>
    );
  },
}
    ],
    []
  );

  const table = useMaterialReactTable({
  columns,
  data: data ?? [],
  state: {
    isLoading,
    showSkeletons: isLoading,
    showProgressBars: isRefetching,
    showAlertBanner: isError,
  },
  enableRowSelection: true,
  muiSelectCheckboxProps: {
  sx: {
    color: resolvedTheme === "dark" ? "#d4d4d4" : "#111827",

    "&.Mui-checked": {
      color: "#8e51ff",
    },

    "& .MuiSvgIcon-root": {
      fontSize: 20,
    },
  },
},
  muiTablePaperProps: {
    sx: {
      backgroundColor:
        resolvedTheme === "dark" ? "#0b0a10" : "#ffffff",
      color:
        resolvedTheme === "dark" ? "#d4d4d4" : "#030712",
    },
  },

  muiTableContainerProps: {
    sx: {
      backgroundColor:
        resolvedTheme === "dark" ? "#0b0a10" : "#ffffff",
    },
  },

  muiTopToolbarProps: {
    sx: {
      backgroundColor:
        resolvedTheme === "dark" ? "#0b0a10" : "#ffffff",
    },
  },

  muiBottomToolbarProps: {
    sx: {
      backgroundColor:
        resolvedTheme === "dark" ? "#0b0a10" : "#ffffff",
    },
  },

  muiTableHeadCellProps: {
    sx: {
      backgroundColor:
        resolvedTheme === "dark" ? "#111827" : "#f9fafb",
      color:
        resolvedTheme === "dark" ? "#ffffff" : "#111827",
    },
  },

  muiTableBodyCellProps: {
    sx: {
      backgroundColor:
        resolvedTheme === "dark" ? "#0b0a10" : "#ffffff",
      color:
        resolvedTheme === "dark" ? "#d4d4d4" : "#111827",
    },
  },
});
 

  return (
    <ThemeProvider
      theme={resolvedTheme === "dark" ? darkTheme : lightTheme}
    >
      <MaterialReactTable table={table} />
    </ThemeProvider>
  );
}