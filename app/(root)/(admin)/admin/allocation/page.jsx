"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/showToast";
import placeholderImg from "@/public/assets/images/img-placeholder.webp";


const locations = [
    {
        label: "CN Online",
        value: "cn-online"
    },
    {
        label: "CN Warehouse",
        value: "cn-warehouse"
    },
    {
        label: "BD Warehouse",
        value: "bd-warehouse"
    },
    {
        label: "In Shipment",
        value: "in-shipment"
    }
];


export default function Allocation() {


    const [allocations, setAllocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(null);



    useEffect(() => {

        getAllocations();

    }, []);



    const getAllocations = async () => {

        try {

            setLoading(true);

            const { data } = await axios.get(
                "/api/allocation/get"
            );


            if (data.success) {

                setAllocations(data.data);

            }


        } catch (error) {

            showToast(
                "error",
                error.message
            );


        } finally {

            setLoading(false);

        }

    }




    // const updateLocation = async (id, location) => {


    //     try {


    //         setUpdating(id);


    //         const { data } = await axios.put(
    //             "/api/allocation/update",
    //             {
    //                 id,
    //                 location
    //             }
    //         );



    //         if (!data.success) {

    //             throw new Error(data.message);

    //         }



    //         showToast(
    //             "success",
    //             "Location updated"
    //         );



    //     } catch (error) {


    //         showToast(
    //             "error",
    //             error.message
    //         );


    //     } finally {

    //         setUpdating(null);

    //     }


    // }




    return (

        <div className="border rounded-lg overflow-hidden">


            <table className="w-full">


                <thead className="bg-gray-100 dark:bg-card">

                    <tr className="border-b">


                        <th className="p-3 text-left">
                            Image
                        </th>


                        <th className="p-3 text-left">
                            Product
                        </th>


                        <th className="p-3 text-left">
                            Variant
                        </th>


                        <th>
                            Purchase
                        </th>


                        <th>
                            Order
                        </th>


                        <th>
                            Qty
                        </th>


                        <th>
                            Location
                        </th>


                        {/* <th>
                            Action
                        </th> */}


                    </tr>

                </thead>



                <tbody>


                    {
                        loading ?

                            <tr>

                                <td
                                    colSpan="8"
                                    className="text-center p-10"
                                >

                                    Loading...

                                </td>

                            </tr>


                            :

                            allocations.length === 0 ?

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center p-10"
                                    >

                                        No allocation found

                                    </td>

                                </tr>


                                :


                                allocations.map(item => (


                                    <tr

                                        key={item._id}

                                        className="
border-b
hover:bg-gray-50
dark:hover:bg-card
"


                                    >


                                        <td className="p-3">


                                            <Image

                                                src={
                                                    item.productVariantId?.media?.[0]?.secure_url
                                                    ||
                                                    placeholderImg.src
                                                }

                                                width={55}

                                                height={55}

                                                alt="product"

                                                className="
rounded-md
object-cover
border
"

                                            />


                                        </td>





                                        <td className="p-3">


                                            <div className="font-medium">

                                                {
                                                    item.productVariantId?.product?.name
                                                }

                                            </div>


                                        </td>





                                        <td className="p-3 text-sm">


                                            <p>
                                                Color:
                                                {item.productVariantId?.color}
                                            </p>


                                            <p>
                                                Size:
                                                {item.productVariantId?.size}
                                            </p>


                                        </td>






                                        <td className="text-center">


                                            {
                                                item.purchaseId?.purchaseId
                                                ||
                                                "N/A"
                                            }


                                        </td>





                                        <td className="text-center">


                                            {
                                                item.orderId?.orderId
                                                ||
                                                "N/A"
                                            }


                                        </td>





                                        <td className="text-center font-semibold">


                                            {
                                                item.qty
                                            }


                                        </td>






                                        <td className="text-center">

                                            {item.location}
                                            {/* <select

                                                value={item.location}

                                                onChange={(e) => {


                                                    const value = e.target.value;


                                                    setAllocations(prev =>

                                                        prev.map(x =>

                                                            x._id === item._id

                                                                ?

                                                                {
                                                                    ...x,
                                                                    location: value
                                                                }

                                                                :

                                                                x

                                                        )

                                                    )


                                                }}


                                                className="
border
rounded-md
px-3
py-2
bg-background
"


                                            >


                                                {
                                                    locations.map(loc => (

                                                        <option

                                                            key={loc.value}

                                                            value={loc.value}

                                                        >

                                                            {loc.label}

                                                        </option>

                                                    ))

                                                }


                                            </select> */}


                                        </td>






                                        {/* <td className="text-center">


                                            <Button

                                                disabled={updating === item._id}

                                                onClick={() => updateLocation(
                                                    item._id,
                                                    item.location
                                                )}

                                            >


                                                {
                                                    updating === item._id
                                                        ?
                                                        "Saving..."
                                                        :
                                                        "Save"
                                                }


                                            </Button>


                                        </td> */}



                                    </tr>


                                ))


                    }


                </tbody>


            </table>


        </div>


    )

}