import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";

const MobileSidebar = () => {
    return ( 
       <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
            <Menu size={20} />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white">
            <Sidebar />
        </SheetContent>
       </Sheet>
     );
}
 
export default MobileSidebar;