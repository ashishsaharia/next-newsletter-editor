"use client";

import { useParams, useRouter } from "next/navigation";
import Canvas from "./canvas";
import Header from "./header";
import Sidebar from "./sidebar";
import { useEditorStore } from "../../store";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { getUserDesignByID } from "../../services/desing-service.js";

function MainEditor() {
  const params = useParams();
  const router = useRouter();
  const designId = params?.slug;
  const [isLoading, setIsLoading] = useState(!!designId);
  const [loadAttempted, setLoadAttempted] = useState(false);
  const [error, setError] = useState(null);

  const { canvas, setDesignId, resetStore, setName, } = useEditorStore();

  useEffect(() => {
    // reset the store here
    resetStore();
    if (designId) setDesignId(designId);

    return () => {
      resetStore();
    };

    // set the desing id
  }, []);

  useEffect(() => {
    setLoadAttempted(false);
    setError(null);
  }, [designId]);

  useEffect(() => {
    if (isLoading && !canvas && designId) {
      const timer = setTimeout(() => {
        if (isLoading) {
          console.log("canvas init timeout");
          setIsLoading(false);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, canvas, designId]);

  useEffect(() => {
    if (canvas) {
      console.log("canvas is now available in editor");
    }
  }, [canvas]);

  //load the desing

  const loadDesign = useCallback(async () => {
    if (!canvas || !designId || loadAttempted) return;

    try {
      setIsLoading(true);
      setLoadAttempted(true);
      const response = await getUserDesignByID(designId);

      const design = response.data; 
      
      if(design)
      {
        //todo
        //update the name
        setName(design.name)


        //set the desing id 
        setDesignId(designId); 
        try{

            if(design.canvasData)
            {
                canvas.clear(); 
                if(design.width && design.height) 
                {
                    canvas.setDimensions({
                        width : design.width, 
                        height : design.height, 
                    })

                    const canvasData = typeof design.canvasData === 'string' ? JSON. parse(design.canvasData) : design.canvasData;

                    const hasObjects  = canvasData.objects && canvasData.objects.length > 0 

                    if(canvasData.background)
                    {
                        canvas.backgroundColor = canvasData.background;
                    }
                    else 
                    {
                        canvas.backgroundColor = "#ffffff";
                    }

                    if(!hasObjects)
                    {
                        canvas.renderAll(); 
                        return true; 
                    }

                    canvas.loadFromJSON(design.canvasData).then(canvas=> canvas.requestRenderAll());
                }

            }
            else{
                console.log('no canvas data')
                canvas.clear(); 
                canvas.setWidth(design.width); 
                canvas.setHeight(design.height); 
                canvas.backgroundColor = "#ffffff"
                canvas.renderAll(); 
            }

        }catch(e)
        {
            console.error("error loading canvas",e);
            setError(e)

        }finally
        {
            setIsLoading(false); 
        }

        
      }



      console.log(response);
    } catch (error) {
      console.error("failed to load the design ", error);
      setError(error);
      setIsLoading(false);
    }
  }, [canvas, designId, loadAttempted, setDesignId]);

  useEffect(() => {
    if (designId && canvas && !loadAttempted) {
      loadDesign();
    } else if (!designId) {
      router.replace("/");
    }
  }, [canvas, designId, loadDesign, loadAttempted]);

  return (
    <div className="flex flex-col h-screen overflow-hidden ">
      <Header></Header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar></Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <main className="flex-1 overflow-hidden bg-[#f0f0f0] flex items-center justify-center">
            <Canvas></Canvas>
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainEditor;
