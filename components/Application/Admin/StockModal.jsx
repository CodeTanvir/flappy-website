"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QtySelector from "./QtySelector";
import { ButtonLoading } from "../ButtonLoading";








export default function StockModal({
  open,
  onOpenChange,
  product,
  loading,
  onSubmit,
  type
}) {
console.log(type)
  const [cnQty, setCnQty] = useState("");
  const [bdQty, setBdQty] = useState("");


  useEffect(() => {
  if (!open || !product) return;

  if (type === "edit") {
    setCnQty(String(product.cnWareHouse || 0));
    setBdQty(String(product.bdWareHouse || 0));
  } else {
    setCnQty("");
    setBdQty("");
  }
}, [open, product, type]);


  if(!product) return null;



 const handleSubmit = () => {

  if (
    type === "add" &&
    Number(cnQty) <= 0 &&
    Number(bdQty) <= 0
  ) {
    return;
  }

  onSubmit({
    variantId: product.variantId,
    cnWareHouse: Number(cnQty),
    bdWareHouse: Number(bdQty),
  });
};



  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent className="sm:max-w-md">


        <DialogHeader>

          <DialogTitle>
            Update Warehouse Stock
          </DialogTitle>

        </DialogHeader>



        {/* Product */}

        <div className="flex gap-3 items-center">

          <Image
            src={
              product.product.image ||
              "/assets/images/img-placeholder.webp"
            }
            width={65}
            height={65}
            alt=""
            className="rounded-lg border"
          />


          <div>

            <p className="font-semibold">
              {product.product.name}
            </p>

            <p className="text-sm text-muted-foreground">
              {product.product.color} / {product.product.size}
            </p>

          </div>

        </div>

{
type === "edit" && (
  <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
    <strong>⚠ Warning:</strong> The values you enter will
    <strong> replace</strong> the current warehouse quantities.
    This action does not add or subtract stock.
  </div>
)
}


        {/* Inputs */}

        <div className="space-y-4 mt-5">


          <div>

            <label className="text-sm font-medium">
              CN Warehouse Quantity
            </label>

           {
type === "add" ? (
  <QtySelector
    value={cnQty}
    setValue={setCnQty}
  />
) : (
  <Input
    type="number"
    min={0}
    value={cnQty}
    onChange={(e)=>setCnQty(e.target.value)}
    className="mt-2"
  />
)
}

          </div>




          <div>

            <label className="text-sm font-medium">
              BD Warehouse Quantity
            </label>


           {
type === "add" ? (
  <QtySelector
    value={bdQty}
    setValue={setBdQty}
  />
) : (
  <Input
    type="number"
    min={0}
    value={bdQty}
    onChange={(e)=>setBdQty(e.target.value)}
    className="mt-2"
  />
)
}

          </div>


        </div>




        <DialogFooter className="mt-5">


          <Button

            variant="outline"

            onClick={()=>
              onOpenChange(false)
            }

          >
            Cancel

          </Button>



          <ButtonLoading

            disabled={loading}

            onClick={handleSubmit}
            text={type === "add" ?
              (loading
              ?
              "Saving..."
              :
              "save") : (loading
              ?
              "updating..."
              :
              "update")}
              loading={loading}

          />

           


        


        </DialogFooter>



      </DialogContent>


    </Dialog>

  );

}