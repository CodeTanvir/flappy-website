"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import Image from "next/image";

import {
   
    useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import { Button } from "@/components/ui/button";
import ReceiveParcelDialog from "@/components/Application/Admin/ReceiveParcelDialog";
import { showToast } from "@/lib/showToast";

export default function ReceivedParcel() {
const queryClient = useQueryClient()
const [open, setOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);

const handleAdd = (item) => {
  setSelectedProduct(item);
  setOpen(true);
};

  // ==========================
  // GET API
  // ==========================
  const {
    data: purchases = [],
    isLoading: loading,
  } = useQuery({
    queryKey: ["received-parcel"],
    queryFn: async () => {
      const { data } = await axios.get(
        "/api/received-parcel/get"
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      return data.data;
    },
  });


  const { mutate: createStock,isPending } = useMutation({
  mutationFn: async (payload) => {
    const { data } = await axios.post(
      "/api/stock/create",
      payload
    );
console.log("Response", data)
    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  },

  onSuccess: (data) => {
    showToast("success", data.message);
console.log(data)
    setOpen(false);

    queryClient.invalidateQueries({
      queryKey: ["received-parcel"],
    });
  },

  onError: (error) => {
    showToast(
      "error",
      error.response?.data?.message || error.message
    );
  },
});

  const columns = useMemo(
    () => [
      {
        id: "image",
        header: "Image",
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
            <div className="font-medium">
              {row.original.product.name}
            </div>

            <div className="text-xs text-muted-foreground">
              {row.original.product.color} /{" "}
              {row.original.product.size}
            </div>
          </div>
        ),
      },

      {
        accessorKey: "totalQty",
        header: "Purchased",
      },

      {
        accessorKey: "totalReceived",
        header: "Received",
      },

      {
        accessorKey: "remainingQty",
        header: "Remaining",
      },

      {
        id: "action",
        header: "Action",
        Cell: ({ row }) => (
          <Button
  size="sm"
  onClick={() => handleAdd(row.original)}
>
  Add
</Button>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: purchases,
    state: {
      isLoading: loading,
    },

    enableRowSelection: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
  });

  return(
    <>
     <MaterialReactTable table={table} />
   <ReceiveParcelDialog
  open={open}
  onOpenChange={setOpen}
  product={selectedProduct}
  loading={isPending}
  onSubmit={(values) => {
   createStock({
  variantId: values.variantId,
  buyingPrice: selectedProduct.buyingPrice,
  receivedQty: values.receivedQty,
  location: values.location,
});
  }}
/>
</>
  );
}
