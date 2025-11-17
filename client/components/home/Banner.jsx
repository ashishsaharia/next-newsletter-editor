'use client'

import { Crown, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { saveDesign } from "@/services/design-service";
import {useState} from 'react'
import { useRouter } from "next/navigation";
function Banner(){
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
            
            console.log(newDesign , "THIS IS THE DESIGN")

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
        <div className = "rounded-xl overflow-hidden bg-linear-to-r from-[#00c4cc] via-[#8b3dff] to-[#5533ff] text-white p-4 sm:p-6 md:p-8 text-center">
            <div className = "flex flex-col sm:flex-row justify-center items-center mb-2 sm:mb-4">
                <span className = "sm:ml-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight"> BMU NewsLetter</span> 
            </div>
            <h2 className = "text-sm sm:text-base md:text-lg font-bold mb-4 sm:mb-6 max-w-2xl mx-auto ">Create. Design. Deliver. Newsletters made effortless.</h2>
            <Button onClick={handleCreateNewDesign} className = "text-[#8b3dff] bg-white hover:bg-gray-100 rounded-lg px-4 py-4 sm:px-6 sm:py-2.5"> {loading && <Loader className="w-4 h-4"></Loader>} Start Designing </Button>
        </div>
    ); 
}

export default Banner;