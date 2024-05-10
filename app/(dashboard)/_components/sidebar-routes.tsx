"use client "

import { SidebarItem } from "./sidebar-item"
import Lucide from 'lucide-react';

const guestRoutes = [
    {
        icon: "Layout",
        label: "Dashboard",
        href: "/",
    },
    {
        icon: "Compass",
        label: "Browse",
        href: "/search",
    },
]



export const SidebarRoutes = () => {
    const routes = guestRoutes
    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon as keyof typeof Lucide.icons}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}