"use client";

import {  useMemo, useState } from "react";
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

import QtySelector from "./QtySelector";

export default function ShipmentProductTable({
  allocation,
  setAllocation,
}) {
 
const {resolvedTheme} = useTheme()
  const {
    data,
  isLoading,
    isError,
    isRefetching,
  } = useQuery({
    queryKey: ["shipment-product"],
    queryFn: async () => {
      const { data: response } = await axios.get("/api/stock/get");

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
      Cell: ({ row }) => (
        <Image
          src={
            row.original.product.image ||
            "/assets/images/img-placeholder.webp"
          }
          alt="Product"
          width={55}
          height={55}
          className="rounded border object-cover"
        />
      ),
    },

    {
      id: "product",
      header: "Product",
      Cell: ({ row }) => (
        <div>
          <p className="font-medium">
            {row.original.product.name}
          </p>

          <p className="text-xs text-muted-foreground">
            {row.original.product.color} / {row.original.product.size}
          </p>
        </div>
      ),
    },

    

    {
      accessorKey: "cnWareHouse",
      header: "CN Stock",
      size: 100,
      Cell: ({ cell }) => (
        <Badge>
          {cell.getValue()}
        </Badge>
      ),
    },

  {
  id: "sendQty",
  header: "Send Qty",
  size: 180,
  Cell: ({ row }) => (
    <QtySelector
      value={allocation[row.original.variantId] || ""}
      max={row.original.cnWareHouse}
      setValue={(value) =>
        setAllocation((prev) => ({
          ...prev,
          [row.original.variantId]: Number(value),
        }))
      }
    />
  ),
},
// {
//   id: "remaining",
//   header: "Remaining",
//   Cell: ({ row }) => {
//     const qty = Number(
//       sendQty[row.original.variantId] || 0
//     );

//     return (
//       <Badge variant="secondary">
//         {row.original.cnWareHouse - qty}
//       </Badge>
//     );
//   },
// },
  ],
  [allocation]
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