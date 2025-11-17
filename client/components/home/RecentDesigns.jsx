'use client'

import { useEffect } from "react";
import { getUserDesigns } from '@/services/design-service'
import { useState } from "react";
import { useRouter } from "next/navigation";
import DesignPreview from './design-preview.js'

function RecentDesigns()
{

    const router = useRouter(); 
    const [userDesigns, setUserDesigns] = useState([]); 

    async function fetchUserDesings(){
        const result = await getUserDesigns()
        console.log(result); 

        if(result?.success)
        {
            setUserDesigns(result.data); 
        }
    }

    useEffect(()=>{
        fetchUserDesings(); 
    },[])


    return (
        <div className="mt-4">
            <h2 className = "text-xl font-bold mb-4"> Recent Designs</h2>
            <div className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {
                    !userDesigns.length && <h1>No user designs found</h1>
                }
                {
                    userDesigns.map(design => (
                        <div onClick={()=>router.push(`/editor/${design._id}`)} key={design._id} className = "group cursor-pointer"> 
                        <div className="w-[250px] h-[200px] rounded-lg mb-2 overflow-hidden transition-shadow group-hover:shadow-lg shadow-md">
                            {
                                design?.canvasData && <DesignPreview key = {design._id} design = {design}></DesignPreview>
                            }
                        </div>
                            <p className = "font-bold text-sm truncate">{design.name}</p>
                        </div>
                        
                    ))
                }
            </div>
        </div>
    )
}

export default RecentDesigns; 
