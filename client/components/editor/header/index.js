"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../components/ui/dropdown-menu";
import { ChevronDown, Eye, Pencil, Save, LogOut } from "lucide-react";
import { useEditorStore } from "../../../store";
import { Input } from "../../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import {signOut, useSession} from "next-auth/react"

function Header() {
  const { isEditing, setIsEditing, name, setName } = useEditorStore();
    
  const {data : session} = useSession();
  const handleLogout= ()=>{
     signOut();
  }

  return (
    <header className="header-gradient header flex items-center justify-between px-4 h-14">
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="header-button flex items-center text-white">
              <span className="flex items-center">
                {isEditing ? "Editing" : "Viewing"}
              </span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Editing</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEditing(false)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Viewing</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button className="header-button relative ml-3" title="Save">
          <Save className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 flex justify-center max-w-md">
        <Input
          className="w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center space-x-2 focus:outline-none">
            <Avatar>
              <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
              <AvatarImage
                src={session?.user?.image || "/placeholder-image.jpg"}
              />
            </Avatar>

          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 w-4 h-4"></LogOut>
            <span className="font-bold">Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default Header;
