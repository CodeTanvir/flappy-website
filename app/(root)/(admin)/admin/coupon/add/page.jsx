"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
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
import { ADMIN_DASHBOARD, ADMIN_COUPON, ADMIN_COUPON_SHOW } from "@/routes/AdminPanelRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
const MediaModal = dynamic(
  () => import("@/components/Application/Admin/MediaModal"),
  {
    ssr: false,
  },
);
const Editor = dynamic(() => import("@/components/Application/Admin/Editor"), {
  ssr: false,
});

function AddCoupon() {
  const [loading, setLoading] = useState(false);

  const editor = (event, editor) => {
    const data = editor.getData();
    form.setValue("description", data);
  };

  const formSchema = zSchema.pick({
    name: true,
    slug: true,
    category: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
    description: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      description: "",
    },
  });

  const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_COUPON_SHOW, label: "Products" },
    { href: "", label: "Add Coupon" },
  ];

  const nameValue = form.watch("name");
  useEffect(() => {
    const name = nameValue.toLowerCase();
    if (name) {
      form.setValue("slug", slugify(name));
    }
  }, [nameValue, form]);

  //discount percentage calculation
  const mrp = form.watch("mrp");
  const sellingPrice = form.watch("sellingPrice");
  useEffect(() => {
    if (mrp > 0 && sellingPrice > 0) {
      const discountPercentage = ((mrp - sellingPrice) / mrp) * 100;
      form.setValue("discountPercentage", Math.round(discountPercentage));
    }
  }, [mrp, sellingPrice, form]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      if (selectedMedia.length <= 0) {
        return showToast("error", "Please select at least one media");
      }
      const mediaIds = selectedMedia.map((media) => media._id);
      values.media = mediaIds;
      const { data: response } = await axios.post(
        "/api/product/create",
        values,
      );
      if (!response.success) {
        throw new Error(response.message || "Failed to create category");
      }
      form.reset();
      setSelectedMedia([]);
      showToast("success", response.message || "Product created successfully");
    } catch (error) {
      showToast("error", error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm mt-4">
        <CardHeader className="py-2  px-3 border-b">
          <h4 className="text-xl font-semibold">Add Product</h4>
        </CardHeader>
        <CardContent className="py-2 pt-6 pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter category name"
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
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Slug<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter slug"
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Category<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            selected={field.value}
                            options={categoryOptions}
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
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          MRP<span className="text-red-500">*</span>
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
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Selling Price<span className="text-red-500">*</span>
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
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Discount Percentange{" "}
                          <span className="text-red-500"> * </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            readOnly
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

                <div className="mb-5 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="ck-editor-wrapper">
                        <FormLabel>
                          Description <span className="text-red-500">*</span>
                        </FormLabel>

                        <FormControl>
                          <Editor
                            // initialData={field.value || ""}
                            // onChange={(_, editor) => {
                            //   field.onChange(editor.getData());
                            // }}
                            onChange={editor}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="md:col-span-2 border border-dashed rounded p-5 text-center">
                <MediaModal
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                />
                {selectedMedia.length > 0 && (
                  <div
                    className="flex
    justify-center 
    items-center 
    flex-warp mb-3 
    gap-2"
                  >
                    {selectedMedia?.map((media) => (
                      <div key={media._id} className="h-24 w-24 border">
                        <Image
                          src={media?.url}
                          alt={media?.alt || "Image"}
                          height={300}
                          width={300}
                          className="size-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div
                  onClick={() => setOpen(true)}
                  className="bg-gray-50 dark:bg-card
   border w-[200px] mx-auto p-5 cursor-pointer"
                >
                  <span className="font-semibold">Selected Media</span>
                </div>
              </div>
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

export default AddCoupon;
