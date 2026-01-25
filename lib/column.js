import { Chip } from "@mui/material"

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