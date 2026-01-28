"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
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
import { ADMIN_COUPON_EDIT, ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function EditCoupon({ params }) {
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const { data: getCouponData } = useFetch(`/api/coupon/get/${id}`);

  const formSchema = zSchema.pick({
    _id: true,
    code: true,
    discountPercentage: true,
    minShoppingAmount: true,
    validity: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      code: "",
      discountPercentage: "",
      minShoppingAmount: "",
      validity: 0,
    },
  });

  useEffect(() => {
    if (getCouponData && getCouponData.success) {
      const coupon = getCouponData.data;
      form.reset({
        _id: coupon._id,
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        minShoppingAmount: coupon.minShoppingAmount,
        validity: coupon.validity.split("T")[0],
      });
    }
  }, [getCouponData, form]);

  const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_COUPON_EDIT, label: "Coupons" },
    { href: "", label: "Add Coupon" },
  ];

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.put("/api/coupon/update", values);
      if (!response.success) {
        throw new Error(response.message);
      }

      showToast("success", response.message);
    } catch (error) {
      showToast("error", error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm mt-4">
        <CardHeader className="py-2  px-3 border-b">
          <h4 className="text-xl font-semibold">Edit Coupon</h4>
        </CardHeader>
        <CardContent className="py-2 pt-6 pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2  grid-cols-1 gap-5">
                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Code<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Code"
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
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Discount Percentange{" "}
                          <span className="text-red-500"> * </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Discount Percentange"
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
                    name="minShoppingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Min Shopping Amount
                          <span className="text-red-500"> * </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Min Shopping Amount"
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
                    name="validity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Validity
                          <span className="text-red-500"> * </span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="md:col-span"></div>
              <div className="mb-3 mt-5">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Save Changes"
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

export default EditCoupon;
