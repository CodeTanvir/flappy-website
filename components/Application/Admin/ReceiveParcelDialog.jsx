"use client";

import { useEffect, useState } from "react";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonLoading } from "../ButtonLoading";

export default function ReceiveParcelDialog({
  open,
  onOpenChange,
  product,
  loading,
  onSubmit,
}) {
  const [qty, setQty] = useState("");
  const [location, setLocation] = useState("cn-warehouse");

  useEffect(() => {
    if (open) {
      setQty("");
      setLocation("cn-warehouse");
    }
  }, [open]);

  if (!product) return null;

 const handleSubmit = () => {
  const quantity = Number(qty);

  if (!quantity || quantity <= 0) return;

  if (quantity > product.remainingQty) return;

  onSubmit?.({
    variantId: product.variantId,
    buyingPrice: product.buyingPrice,
    receivedQty: quantity,
    location,
  });
};

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Receive Parcel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* Product */}

          <div className="flex gap-4">

            <Image
              src={
                product.product.image ||
                "/assets/images/img-placeholder.webp"
              }
              alt={product.product.name}
              width={90}
              height={90}
              className="rounded-lg border object-cover"
            />

            <div className="flex-1">

              <h3 className="text-lg font-semibold">
                {product.product.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                {product.product.color} / {product.product.size}
              </p>

            </div>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-3 gap-4">

            <div className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground">
                Purchased
              </p>

              <p className="text-xl font-bold">
                {product.totalQty}
              </p>
            </div>

            <div className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground">
                Received
              </p>

              <p className="text-xl font-bold">
                {product.totalReceived}
              </p>
            </div>

            <div className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground">
                Remaining
              </p>

              <p className="text-xl font-bold text-primary">
                {product.remainingQty}
              </p>
            </div>

          </div>

          {/* Quantity */}

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Receive Quantity
            </label>

            <Input
              type="number"
              min={1}
              max={product.remainingQty}
              value={qty}
              onChange={(e) =>
                setQty(e.target.value)
              }
            />

          </div>

          {/* Warehouse */}

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Warehouse
            </label>

            <Select
              value={location}
              onValueChange={setLocation}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="cn-warehouse">
                  CN Warehouse
                </SelectItem>

                <SelectItem value="bd-warehouse">
                  BD Warehouse
                </SelectItem>

              </SelectContent>

            </Select>

          </div>

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <ButtonLoading
          loading={loading}
          text={loading ? "Saving" : "Save"}
            disabled={
              !qty ||
              Number(qty) <= 0 ||
              Number(qty) > product.remainingQty ||
              loading
            }
            onClick={handleSubmit}
          />
            

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}