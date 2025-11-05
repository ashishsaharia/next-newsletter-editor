'use client'

import { useRef, useEffect } from "react";
import { useEditorStore } from "../../../store";
import { initializeFabric } from "../../../fabric/fabric-utils";

function Canvas(){
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null); 
    const fabricCanvasRef = useRef(null);
    const initAttemptedRef = useRef(false);
    const { setCanvas } = useEditorStore();

    useEffect(()=>{
       const cleanUpCanvas = ()=>{
        if(fabricCanvasRef.current)
        {
            try{
                // safe dispose if available
                if (typeof fabricCanvasRef.current.dispose === 'function') {
                    fabricCanvasRef.current.dispose();
                } else if (typeof fabricCanvasRef.current.clear === 'function') {
                    fabricCanvasRef.current.clear();
                }
            }
            catch(e)
            {
                console.error('error disposing canvas', e);
            }
            fabricCanvasRef.current = null;
            setCanvas(null);
        }
       }

       // ensure any previous canvas is cleaned
       cleanUpCanvas();

       // reset init flag correctly
       initAttemptedRef.current = false;
       
       const initCanvas = async()=>{
        // correct window check
        if (typeof window === 'undefined' || !canvasRef.current || initAttemptedRef.current) {
            return;
        }

        initAttemptedRef.current = true;

        try{
            const fabricCanvas = await initializeFabric(canvasRef.current, canvasContainerRef.current); 

            if(!fabricCanvas){
                console.error('failed to initialize fabric js canvas');
                return ;
            }

            fabricCanvasRef.current = fabricCanvas;

            // putting the canvas in store 
            setCanvas(fabricCanvas);

            console.log("canvas init done and set in store");

            // TODO: apply custom style for the controls and set up event listeners

        }catch(e)
        {
            console.error('failed to init the canvas', e);
        }
       }

       const timer = setTimeout(initCanvas, 50);

       return ()=>{
        clearTimeout(timer); 
        cleanUpCanvas();
       }
    // include setCanvas to be safe (Zustand setters are stable but it's okay)
    }, [setCanvas]);

    return(
        <div className="relative w-full h-[600px] overflow-auto " ref={canvasContainerRef}>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}

export default Canvas;
