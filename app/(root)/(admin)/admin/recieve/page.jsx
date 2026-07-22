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

import { showToast } from "@/lib/showToast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";


import StockModal from "@/components/Application/Admin/StockModal";


export default function ReceivedParcel() {
const queryClient = useQueryClient()
const [open, setOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
const [mode, setMode] = useState("add");

const handleAdd = (item) => {
  setMode("add");
  setSelectedProduct(item);
  setOpen(true);
};
const handleEdit = (item) => {
  setMode("edit");
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

const { mutate:updateStock, isPending:updatePending  } = useMutation({

mutationFn: async(payload)=>{

const {data}=await axios.put(
"/api/stock/update",
payload
);

if(!data.success)
throw new Error(data.message);

return data;

},


onSuccess:(data)=>{

showToast(
"success",
data.message
);


setOpen(false);


queryClient.invalidateQueries({
queryKey:["received-parcel"]
});


}

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
      accessorKey: "cnWareHouse",
      header: "China",
      Cell: ({ cell }) => (
        <span className="font-medium">
          {cell.getValue() ?? 0}
        </span>
      ),
    },
      {
      accessorKey: "bdWareHouse",
      header: "Bangladesh",
      Cell: ({ cell }) => (
        <span className="font-medium">
          {cell.getValue() ?? 0}
        </span>
      ),
    },
     {
  id: "actions",
  header: "",
  size: 60,
  Cell: ({ row }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        <DropdownMenuItem
          onClick={() => handleAdd(row.original)}
        >
          Add Stock
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleEdit(row.original)}
        >
          Edit Stock
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
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
 {


<StockModal

open={open}

onOpenChange={setOpen}

product={selectedProduct}

loading={mode === "add" ? isPending : updatePending}

type={mode}


onSubmit={(values)=>{


if(mode === "add"){


createStock({

variantId: values.variantId,

buyingPrice:selectedProduct.buyingPrice,

cnWareHouse: values.cnWareHouse,

bdWareHouse: values.bdWareHouse,

});


}else{


updateStock({

variantId: values.variantId,

cnWareHouse: values.cnWareHouse,

bdWareHouse: values.bdWareHouse,

});


}


}}

/>

}




</>
  );
}
