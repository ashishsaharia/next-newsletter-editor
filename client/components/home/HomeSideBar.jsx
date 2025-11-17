'use client'
// import Home from "@/app/page";n
import { FolderOpen, Plus, Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveDesign } from "@/services/design-service";

function HomeSideBar(){
        const [loading, setLoading] = useState(false); 
        const router = useRouter()
    
        const handleCreateNewDesign = async()=>{
            if(loading) return ; 
            try{
                setLoading(true); 
                
                const initialDesingData = {
                    name: 'untitled Desing',
                    canvasData : null, 
                    width : 825, 
                    height : 465, 
                }
                const newDesign = await saveDesign(initialDesingData); 
                
    
                if(newDesign?.success)
                {
                    router.push(`/editor/${newDesign?.data?._id}`)
                }
                else 
                {
                    throw new Error ("faild to create new design")
                }
                setLoading(false);
    
            }
            catch(e)
            {
                console.error(e);
                setLoading(false);
            }
    
        }
    

    return (
        <aside className = "w-[72px] bg-[#f8f8fc] border-r flex flex-col items-center py-4 fixed left-0 top-0 h-full z-20 ">
            <div className="flex flex-col items-center">
                <button onClick={handleCreateNewDesign} className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors">
                    <Plus className = "w-6 h-6"></Plus>
                </button>
                <div className="text-xs font-medium text-center mt-1 text-gray-700">Create</div>
            </div>
            <nav className="mt-8 flex flex-col items-center space-y-6 w-full">
                {
                    [
                        {
                            icon : <Home className = "h-6 w-6"></Home>,
                            label : 'Home',
                             active: true,
                        },
                        {
                            icon : <FolderOpen className = "h-6 w-6"></FolderOpen>,
                            label : 'projects',
                             active: false,
                        },
                    ].map((menuItem, index) => (
                        <div key={index} className="flex flex-col items-center w-full">
                            <Link href = "#"
                            className = 'w-full flex flex-col items-center py-2 text-gray-600 hover:bg-gray-100 hover:text-purple-600'
                            >
                                <div className="relative">
                                    {menuItem.icon}
                                </div>
                                <span className="text-xs font-medium mt-1">{menuItem.label}</span>
                            </Link>
                        </div>
                    ))
                }
            </nav>
        </aside>
    ); 
}

export default HomeSideBar;