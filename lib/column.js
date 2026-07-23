import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Chip } from "@mui/material"
import { formatBDDateTime } from "./dateFormatter"
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
export const DT_CATEGORY_COLUMN = [
    {
        accessorKey: 'name',
        header: 'Category Name',
        
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
    }
]

export const DT_PRODUCT_COLUMN = [
    {
        accessorKey: 'name',
        header: 'Product Name',
        
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
    },
   {
        accessorKey: 'category',
        header: 'Category',
    },
    {
        accessorKey: 'mrp',
        header: 'MRP',
    },
    {
        accessorKey: 'sellingPrice',
        header: 'Selling Price',
    },
    {
        accessorKey: 'discountPercentage',
        header: 'Discount Percentage',
    },
]

export const DT_PRODUCT_VARIANT_COLUMN = [
    {
        accessorKey: 'product',
        header: 'Product Name',
        
    },
    {
        accessorKey: 'color',
        header: 'Color',
    },
   {
        accessorKey: 'size',
        header: 'Size',
    },
    {
        accessorKey: 'sku',
        header: 'SKU',
    },
     {
        accessorKey: 'mrp',
        header: 'MRP',
    },
    {
        accessorKey: 'sellingPrice',
        header: 'Selling Price',
    },
    {
        accessorKey: 'discountPercentage',
        header: 'Discount Percentage',
    },
]


export const DT_COUPON_COLUMN = [
    {
        accessorKey: 'code',
        header: 'Code',
        
    },
  
    {
        accessorKey: 'discountPercentage',
        header: 'Discount Percentage',
    },
      {
        accessorKey: 'minShoppingAmount',
        header: 'Min. Shopping Amount',
    },
      {
        accessorKey: 'validity',
        header: 'Validity',
        Cell:({renderedCellValue}) => (
            new Date() > new Date(renderedCellValue) ? <Chip color="error" 
            label={new Date(renderedCellValue).toLocaleDateString('bn-BD')} /> : <Chip color="success" label={new Date(renderedCellValue).toLocaleDateString('bn-BD')}/>
        )
    },
    
]

export const DT_CUSTOMERS_COLUMN = [
    {
        accessorKey: 'avatar',
        header: 'Avatar',
        Cell:({renderedCellValue})=>(
            <Avatar>
                <AvatarImage src={renderedCellValue?.url || `https://github.com/shadcn.png`}/>
            </Avatar>
        )
    },
      {
        accessorKey: 'name',
        header: 'Name', 
    },
   {
        accessorKey: 'email',
        header: 'Email', 
    },
     {
        accessorKey: 'phone',
        header: 'Phone', 
    },
     {
        accessorKey: 'address',
        header: 'Address', 
    },
     {
        accessorKey: 'isEmailVerified',
        header: 'Is Verified', 
        Cell:({renderedCellValue})=>(
            renderedCellValue ? <Chip color="success" label="Verified" /> : 
            <Chip color="error" label="Not Verified" />
        )
    },
]


export const DT_REVIEW_COLUMN = [
   
      {
        accessorKey: 'product',
        header: 'product', 
    },
    {
        accessorKey:"user",
        header:'User'
    },
  {
        accessorKey:"title",
        header:'Title'
    },
     {
        accessorKey:"rating",
        header:'Rating'
    },
     {
        accessorKey:"review",
        header:'Review'
    },
   
]

export const DT_ORDER_COLUMN = [
   
      {
        accessorKey: 'orderId',
        header: 'Order Id', 
    },
    {
        accessorKey:"paymentMethod",
        header:'Payment Method'
    },
  {
        accessorKey:"name",
        header:'Name'
    },
     {
        accessorKey:"email",
        header:'Email'
    },
     {
        accessorKey:"phone",
        header:'Phone'
    },

    {
        accessorKey:"district",
        header:'District'
    },
     {
        accessorKey:"street",
        header:'Street'
    },
     {
        accessorKey:"zipcode",
        header:'Zip Code'
    },
    {
        accessorKey:"ordernote",
        header:"Order Note"
    },
     {
        accessorKey:"totalItem",
        header:'Total Item',
        Cell:({renderedCellValue,row})=>(<span>{row?.original?.products?.length || 0}</span>)
    },
     {
        accessorKey:"subtotal",
        header:'Subtotal'
    },
     {
        accessorKey:"discount",
        header:'Discount',
        Cell:({renderedCellValue})=>(<span>{Math.round(renderedCellValue)}</span>)
    },
     {
        accessorKey:"couponDiscountAmount",
        header:'Coupon Discount'
    },
     {
        accessorKey:"totalAmount",
        header:'Total Amount'
    },
   {
  accessorKey: "createdAt",
  header: "Date",
  Cell: ({ renderedCellValue }) => (
    <span>{formatBDDateTime(renderedCellValue)}</span>
  ),
},
     {
        accessorKey:"status",
        header:'Status'
    },
];

export const DT_SHIPMENT_ALLOCATION = [
  {
    accessorKey: "productVariantId",
    header: "Image",
    Cell: ({ cell }) => {
      const image =
        cell.getValue()?.media?.[0]?.secure_url || "/placeholder.png";

      return (
        <Image
          src={image}
          alt="Product"
          width={50}
          height={50}
          className="rounded border object-cover"
        />
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },

  {
    accessorKey: "productVariantId",
    header: "Product",
    Cell: ({ cell }) => (
      <span className="font-medium">
        {cell.getValue()?.product?.name || "-"}
      </span>
    ),
  },

  {
    accessorKey: "productVariantId",
    header: "Color",
    Cell: ({ cell }) => cell.getValue()?.color || "-",
  },

  {
    accessorKey: "productVariantId",
    header: "Size",
    Cell: ({ cell }) => cell.getValue()?.size || "-",
  },

  {
    accessorKey: "qty",
    header: "Qty",
  },

  {
    accessorKey: "location",
    header: "Location",
    Cell: ({ cell }) => (
      <Badge>{cell.getValue()}</Badge>
    ),
  },

  {
    accessorKey: "purchaseId",
    header: "Purchased",
    Cell: ({ cell }) => cell.getValue()?.totalQty || "-",
  },

  {
    accessorKey: "orderId",
    header: "Order",
    Cell: ({ cell }) => cell.getValue()?.orderId || "-",
  },
];

export const DT_SHIPMENT_COLUMN = [
  {
    accessorKey: "date",
    header: "Shipment Date",
  },


  {
    accessorKey: "city",
    header: "Departure",
  },

  {
    accessorKey: "name",
    header: "Agency / Person",
  },



  {
    accessorKey: "totalWeight",
    header: "Weight (KG)",
  },


  {
    id: "action",
    header: "Actions",
    enableSorting: false,
    enableColumnFilter: false,

    Cell: ({ row, table }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
          >
            <MoreHorizIcon fontSize="small" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              table.options.meta?.onView(row.original)
            }
          >
            View
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              table.options.meta?.onEdit(row.original)
            }
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              table.options.meta?.onDelete(row.original)
            }
            className="text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];