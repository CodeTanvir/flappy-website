import {
    ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_SHOW,
    ADMIN_COUPON_ADD,
    ADMIN_COUPON_SHOW,
    ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW,
    ADMIN_PRODUCT_ADD,
    ADMIN_PRODUCT_SHOW,
    ADMIN_PRODUCT_VARIANT_ADD,
    ADMIN_PRODUCT_VARIANT_SHOW
} from "@/routes/AdminPanelRoute";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoMdStarOutline } from "react-icons/io";
import { IoShirtOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { MdOutlinePermMedia, MdOutlineShoppingBag } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";



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
        icon:IoShirtOutline,
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
        url:'#',
        icon:MdOutlineShoppingBag,
    },
    {
        title:'Customers',
        url:'#',
        icon:LuUserRound,
    },
    {
        title:'Rating & Reviews',
        url:'#',
        icon:IoMdStarOutline,
    },
    {
        title:'Media',
        url:ADMIN_MEDIA_SHOW,
        icon:MdOutlinePermMedia,
    }
]
