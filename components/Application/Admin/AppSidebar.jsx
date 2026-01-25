'use client'
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
  } from "@/components/ui/sidebar"
import Image from "next/image"
import logoBlack from '@/public/assets/images/black.png';
import logoWhite from '@/public/assets/images/white.png'
import { Button } from "@/components/ui/button";
import { LuChevronRight, LucideChevronRight } from "react-icons/lu";
import {IoMdClose} from "react-icons/io"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";
import { adminAppSidebarMenu } from "@/lib/AdminSidebarMenu";

function AppSidebar() {
    const {toggleSidebar} = useSidebar();
    return (
        <Sidebar className="z-50">
            <SidebarHeader className="border-b h-14 p-0">
                <div className="flex justify-between items-center px-4">
                  <Image src={logoBlack.src} height={50} width={logoBlack.width}
                   className="block dark:hidden h-[70px] w-auto" alt="logo dark"/>

                  <Image src={logoWhite.src} height={50} width={logoWhite.width}
                   className="hidden dark:block h-[70px] w-auto" alt="logo white"/>
                   <Button onClick={toggleSidebar} type="button" size="icon" className="md:hidden">
                    <IoMdClose/>
                   </Button>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-3">
                <SidebarMenu>
                    {adminAppSidebarMenu.map((menu, index)=>
                         <Collapsible key={index} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton asChild
                                     className="font-semibold px-2 py-2">
                                        <Link href={menu?.url}>
                                            <menu.icon />
                                            {menu.title}
                                            {menu.subMenu && menu.subMenu.length && 
                                            <LuChevronRight 
                                            className="ml-auto 
                                            transition-transform 
                                            duration-200
                                            group-data-[state=open]/collapsible:rotate-90"/>
                                            }
                                        </Link>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                {menu.subMenu && menu.subMenu.length > 0 &&
                                    <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {menu.subMenu.map((subMenuItem,subMenuIndex)=>(
                                                <SidebarMenuSubItem key={subMenuIndex}>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link href={subMenuItem.url}>
                                                        {subMenuItem.title}
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                    </CollapsibleContent>
                                }
                            </SidebarMenuItem>
                        </Collapsible>
                    )}
                </SidebarMenu>
            </SidebarContent>
    </Sidebar>
    )
}

export default AppSidebar;
