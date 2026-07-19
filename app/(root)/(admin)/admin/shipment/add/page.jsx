"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import Select from "@/components/Application/Select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";

import { showToast } from "@/lib/showToast";
import { zSchema } from "@/lib/zodSchema";
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from "@/routes/AdminPanelRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { DT_SHIPMENT_ALLOCATION } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunctions";
import ShipmentAllocationTable from "@/components/Application/Admin/ShipmentAllocationTable";








function AddShipment() {
  const [loading, setLoading] = useState(false);
  
 const [cityOptions, setCityOptions] = useState([]);

 const shipmentOptions = [
  {
    label: "Hand Carry",
    value: "Hand Carry",
  },
  {
    label: "Agency",
    value: "Agency",
  },
];



  
  //media modal states
  
const [selectedFiles, setSelectedFiles] = useState([]);
const [previewUrls, setPreviewUrls] = useState([]);

const handleFileChange = (e) => {
  const files = Array.from(e.target.files);

  setSelectedFiles((prev) => [...prev, ...files]);

  const previews = files.map((file) => URL.createObjectURL(file));

  setPreviewUrls((prev) => [...prev, ...previews]);
};


 useEffect(() => {
  const fetchCities = async () => {
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            country: "China",
          }),
        }
      );

      const data = await res.json();

      if (data.error === false) {
        const options = data.data.map((city) => ({
          label: city,
          value: city,
        }));

        setCityOptions(options);
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetchCities();
}, []);

const columns = useMemo(() => {
  return columnConfig(DT_SHIPMENT_ALLOCATION);
}, []);

  const formSchema = zSchema.pick({
    shipmentType: true,
    date: true,
    costPerWeight: true,
    totalWeight: true,
    // additionalCost: true,
    city: true,
    name: true,
    phoneNumber:true
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
   defaultValues: {
  shipmentType: "",
  date: "",
  costPerWeight: 0,
  totalWeight: 0,
  additionalCost: 0,
  city: "",
  name: "",
  phoneNumber: "",
}
  });

  const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_PRODUCT_SHOW, label: "Products" },
    { href: "", label: "Add Product" },
  ];

  

  //discount percentage calculation
 

 const onSubmit = async (values) => {
  setLoading(true);

  try {
    if (selectedFiles.length === 0) {
      return showToast("error", "Please select at least one document");
    }

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    selectedFiles.forEach((file) => {
      formData.append("documents", file);
    });

    const { data } = await axios.post(
      "/api/shipment/create",
      formData
    );

    if (!data.success) {
      throw new Error(data.message);
    }

    form.reset();
    setSelectedFiles([]);
    setPreviewUrls([]);

    showToast("success", data.message);
  } catch (err) {
    showToast("error", err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm mt-4">
        <CardHeader className="py-2  px-3 border-b">
          <h4 className="text-xl font-semibold">Add Shipment</h4>
        </CardHeader>
        <CardContent className="py-2 pt-6 pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
               <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="shipmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Shipment Type<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            selected={field.value}
                            options={shipmentOptions}
                            setSelected={field.onChange}
                            isMulti={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              
             <div className="mb-3">
 <FormField
  control={form.control}
  name="date"
  render={({ field }) => (
    <FormItem>
      <FormLabel>
        Date<span className="text-red-500">*</span>
      </FormLabel>
      <FormControl>
        <Input
          type="date"
          value={field.value || ""}
          onChange={(e) => field.onChange(e.target.value)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
  
</div>

             

               

                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="costPerWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Cost per weight (BDT)<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter MRP"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="totalWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Total Weight<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Selling Price"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="additionalCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Additional Transport/Other Cost (RMB){" "}
                          <span className="text-red-500"> * </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            
                            type="number"
                            placeholder="Enter Additional Cost (if have)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
 <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Departure City<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            selected={field.value}
                            options={cityOptions}
                            setSelected={field.onChange}
                            isMulti={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Person/Agency Name<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="String"
                            placeholder="Enter Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                  <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Phone Number<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="telephone"
                            placeholder="Enter phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

             <div className="md:col-span-2 border border-dashed rounded p-5 text-center">
 {previewUrls.length > 0 && (
  <div className="flex flex-wrap justify-center gap-2 mb-3">
    {previewUrls.map((url, index) => (
      <div key={index} className="relative h-24 w-24 border rounded overflow-hidden">
        <Image
          src={url}
          alt="Preview"
          width={300}
          height={300}
          className="w-full h-full object-cover"
        />

        <button
          type="button"
         onClick={() => {
  URL.revokeObjectURL(previewUrls[index]);

  setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  setSelectedFiles(prev => prev.filter((_, i) => i !== index));
}}
          className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-sm hover:bg-red-600"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}

  <label
    htmlFor="docs"
    className="bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer block"
  >
    <span className="font-semibold">+ Add Docs</span>
    <br />
    <span>(Passport, Ticket, Visa...)</span>
  </label>

  <input
    id="docs"
    type="file"
    multiple
    accept="image/*"
    className="hidden"
    onChange={handleFileChange}
  />
</div>
<Card className="mt-5 py-0 rounded shadow-sm">
  <CardHeader className="py-2 px-3 border-b">
    <h4 className="text-xl font-semibold">
      Shipment Allocation
    </h4>
  </CardHeader>

  <CardContent className="p-0">
    <ShipmentAllocationTable />
  </CardContent>
</Card>
              <div className="md:col-span"></div>
              <div className="mb-3 mt-5">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Add Product"
                  className=" cursor-pointer"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddShipment;
