"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";

import {
    useQuery,
    useMutation,
    useQueryClient
} from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { showToast } from "@/lib/showToast";

export default function ReceiveParcelPage() {

    const queryClient = useQueryClient();

    const [saving, setSaving] = useState(null);

    const [receiveQty, setReceiveQty] = useState({});

    // ==========================
    // GET PURCHASES
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

        }

    });


  const { mutate: receiveParcel } = useMutation({

    mutationFn: async ({ variantId, receivedQty }) => {

        const { data } = await axios.post(
            "/api/received-parcel/create",
            {
                variantId,
                receivedQty
            }
        );

        if (!data.success) {
            throw new Error(data.message);
        }

        return data;
    },

    onSuccess: () => {
        showToast("success", "Parcel received");

        setReceiveQty({});

        queryClient.invalidateQueries({
            queryKey: ["received-parcel"]
        });
    },

    onError: (error) => {
        showToast("error", error.message);
    },

    onSettled: () => {
        setSaving(null);
    }

});

    // ==========================
    // HANDLE RECEIVE
    // ==========================

  const handleReceive = (variantId) => {

    const qty = Number(receiveQty[variantId]);

    if (!qty || qty <= 0) {
        return showToast("error", "Enter quantity");
    }

    setSaving(variantId);

    receiveParcel({
        variantId,
        receivedQty: qty
    });

};
    if (loading) {

        return (
            <div className="p-6">
                Loading...
            </div>
        );

    }


    return (

        <div className="space-y-5">

            <div>

                <h1 className="text-2xl font-bold">
                    Receive Purchased Parcels
                </h1>

                <p className="text-muted-foreground">
                    Receive products against purchases
                </p>

            </div>


            <div className="border rounded-lg overflow-hidden">

                <table className="w-full">

                    <thead className="bg-muted">

                        <tr>

                            <th className="p-3 text-left">
                                Image
                            </th>

                            <th className="text-left">
                                Product
                            </th>

                            <th>
                                Purchased
                            </th>

                            <th>
                                Received
                            </th>

                            <th>
                                Remaining
                            </th>

                            <th>
                                Receive Qty
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            purchases.map((item, index) => (

                                <tr
                                    key={item._id}
                                    className="border-t"
                                >

                                    <td className="p-3">

                                        <Image

                                            src={
                                                item.product.image ||
                                                "/assets/images/img-placeholder.webp"
                                            }

                                            width={60}
                                            height={60}

                                            alt="product"

                                            className="rounded border"

                                        />

                                    </td>


                                    <td>

                                        <div className="font-semibold">

                                            {item.product.name}

                                        </div>

                                        <div className="text-sm text-muted-foreground">

                                            {item.product.color}
                                            {" / "}
                                            {item.product.size}

                                        </div>

                                    </td>


                                    <td className="text-center">

                                        {item.totalQty}

                                    </td>


                                    <td className="text-center">

                                        {item.totalReceived}

                                    </td>


                                    <td className="text-center font-semibold">

                                        {item.remainingQty}

                                    </td>


                                    <td className="w-40">

                                      <Input
    type="number"
    min={1}
    max={item.remainingQty}
    disabled={item.remainingQty === 0}
    value={receiveQty[item.variantId] || ""}
    onChange={(e) =>
        setReceiveQty(prev => ({
            ...prev,
            [item.variantId]: e.target.value
        }))
    }
/>
                                    </td>


                                    <td className="text-center">

                                        <Button

                                        disabled={
    item.remainingQty === 0 ||
    saving === item.variantId
}

onClick={() =>
    handleReceive(item.variantId)
}

                                        >

                                            {
                                                item.remainingQty === 0
                                                    ? "Completed"
                                                    : saving === item._id
                                                        ? "Receiving..."
                                                        : "Receive"
                                            }

                                        </Button>

                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}