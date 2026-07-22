import {
    ADMIN_ADD_SHIPMENT,
    ADMIN_ALLOCATION,
    ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_SHOW,
    ADMIN_COUPON_ADD,
    ADMIN_COUPON_SHOW,
    ADMIN_CUSTOMERS_SHOW,
    ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW,
    ADMIN_ORDER_BUY,
    ADMIN_ORDER_SHOW,
    ADMIN_PRODUCT_ADD,
    ADMIN_PRODUCT_SHOW,
    ADMIN_PRODUCT_VARIANT_ADD,
    ADMIN_PRODUCT_VARIANT_SHOW,
    ADMIN_PURCHASE_LIST,
    
    ADMIN_REVIEW_SHOW,
    ADMIN_STOCKS
} from "@/routes/AdminPanelRoute";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaLayerGroup } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { GrCubes } from "react-icons/gr";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { IoMdStarOutline } from "react-icons/io";
import { LuUserRound } from "react-icons/lu";
import { MdOutlinePayment, MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { MdOutlineInventory } from "react-icons/md";
import { BsOpencollective } from "react-icons/bs";
import { GiCargoShip } from "react-icons/gi";



export const adminAppSidebarMenu = [
    {
        title:"Dashboard",
        url:ADMIN_DASHBOARD,
        icon:AiOutlineDashboard,

    },
    {
        title:'Category',
        url:'#',
        icon:BiCategory,
        subMenu:[
            {
                title:"Add Category",
                url:ADMIN_CATEGORY_ADD
            },
            {
                title:"All Category",
                url:ADMIN_CATEGORY_SHOW
            }
        ]
    },
    {
        title:'Products',
        url:'#',
        icon: GrCubes,
        subMenu:[
            {
                title:"Add Product",
                url:ADMIN_PRODUCT_ADD
            },
            {
                title:"Add Varient",
                url:ADMIN_PRODUCT_VARIANT_ADD
            },
            {
                title:"All Products",
                url:ADMIN_PRODUCT_SHOW
            },
            {
                title:"Products Varients",
                url:ADMIN_PRODUCT_VARIANT_SHOW
            }
        ]
    },
     {
        title:'Stocks',
        url:ADMIN_STOCKS,
        icon:MdOutlineInventory,
       
    },
    {
        title:'Coupons',
        url:'#',
        icon:RiCoupon2Line,
        subMenu:[
            {
                title:"Add Coupon",
                url:ADMIN_COUPON_ADD
            },
            {
                title:"All Coupons",
                url:ADMIN_COUPON_SHOW
            }
           
        ]
    },
    {
        title:'Orders',
        url:ADMIN_ORDER_SHOW,
        icon:HiOutlineShoppingCart,
        
    },

       {
        title:'Purchase',
        url:'#',
        icon:MdOutlinePayment,
        subMenu:[
            {
                title:'All Purchase',
                url:ADMIN_PURCHASE_LIST,
            },
             {
                title:'Buy orders',
                url:ADMIN_ORDER_BUY,
            }
        ]
        
        
    },
    
     {
        title:"Allocation",
        url:ADMIN_ALLOCATION,
        icon:FaLayerGroup,

    },
     {
        title:'Shipment',
        url:'#',
        icon:GiCargoShip,
        subMenu:[
            {
                title:'All Shipment',
                url:ADMIN_PURCHASE_LIST,
            },
             {
                title:'Add shipment',
                url:ADMIN_ADD_SHIPMENT,
            }
        ]
        
        
    },
    
    {
        title:'Customers',
        url:ADMIN_CUSTOMERS_SHOW,
        icon:LuUserRound,
    },
    {
        title:'Rating & Reviews',
        url:ADMIN_REVIEW_SHOW,
        icon:IoMdStarOutline,
    },
    {
        title:'Media',
        url:ADMIN_MEDIA_SHOW,
        icon:MdOutlinePermMedia,
    },
    
]
