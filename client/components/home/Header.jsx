'use client'
import { LogOut, Search } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
 
function Header() {
  const { data: session } = useSession();

  const handleLogout = async()=>{
    await signOut();
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 fixed top-0 right-0 left-[72px] z-10">
      {/* Left side can be empty or have logo later */}
      <div className="flex-1"></div>

      {/* Search bar on the right */}
      <div className="flex items-center gap-4">
        <div className="relative w-[280px]">
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            className="pl-10 py-2 border-gray-200 bg-gray-50 focus-visible:ring-blue-200 text-base"
            placeholder="Search Your Designs"
          />
        </div>

        {/* Avatar to the right of search bar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 focus:outline-none">
              <Avatar>
                <AvatarFallback>
                  {session?.user?.name?.[0] || 'U'}
                </AvatarFallback>
                <AvatarImage src={session?.user?.image || '/placeholder-image.jpg'} />
              </Avatar>
              <span className='text-sm font-bold hidden lg:block'>
                {
                    session?.user?.name || "userName "
                }
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
                <LogOut className='mr-2 w-4 h-4'></LogOut>
                <span className='font-bold'>Log Out</span>
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
