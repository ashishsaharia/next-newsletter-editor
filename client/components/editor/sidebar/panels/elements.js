'use client'


import { useEditorStore } from "../../../../store";
import { useEffect, useRef } from "react";




function ElementsPanel (){

    const {canvas} = useEditorStore(); 
    const miniCanvasRef = useRef(null); 
    const canvasElementRef = useRef(null); 
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() =>{
        if(isInitialized) return 
        const timer = setTimeout(async ()=>{
            try {
                const fabric = await import('fabric'); 
                for(const shapeType of shapeTypes)
                {
                    const canvasElement = canvasElementRef.current[shapeType];
                    if(!canvasElement) continue;
                    const canvasId = `mini-canvas-${shapeType}-${Date.now()}`
                    canvasElement.id = canvasId; 
                    try{
                        const definition = shapeDEfinitions[shapeType]

                        const miniCanvas = new fabric.StaticCanvas(canvasId, {
                            width : 100, 
                            height : 100, 
                            backgroundColor: 'transparent', 
                            renderOnAddRemove : true,
                        })
                        

                        miniCanvasRef.current[shapeType] = miniCanvas
                        definition.thumbnail(fabric, miniCanvas)
                        miniCanvas.renderAll();


                    }catch(err)
                    {
                        console.error("error while creating defination", err);
                    }

                }
                setIsInitialized(true);
            } catch (error) {
                console.error("failed to init" , error);
            }
    }, 100);

    return ()=> clearTimeout(timer)
    }, [isInitialized])



    useEffect(()=>{
        return()=>{
            Object.values(miniCanvasRef.current).forEach(miniCanvas =>{
                if(miniCanvas && typeof miniCanvas.dispose === 'function'){
                    try {
                        miniCanvas.dispose();
                    } catch (error) {
                        console.error('error disposign canvas', error);
                    }
                }
            })
        }

        miniCanvasRef.current = {}
        setIsInitialized(false);

    },[])


    return (
        <div className = "h-full overflow-y-auto">
            <div className = 'p-4'>
                <div className="grid grid-cols-3 gap-1 ">
                    {
                        shapeTypes.map(shape =>{
                            <div key = {shape}>
                                
                            </div>
                        })
                    }

                </div>
            </div>

        </div>
    );
}

export default ElementsPanel;