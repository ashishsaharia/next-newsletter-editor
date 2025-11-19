"use client";

import { customizeBoundingBox, initializeFabric } from "@/fabric/fabric-utils";
import { useEditorStore } from "@/store";
import { useEffect, useRef } from "react";

function Canvas() {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const initAttemptedRef = useRef(false);

  const { canvas, setCanvas, markAsModified } = useEditorStore();

  useEffect(() => {
    const cleanUpCanvas = () => {
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.off("object:added");
          fabricCanvasRef.current.off("object:modified");
          fabricCanvasRef.current.off("object:removed");
          fabricCanvasRef.current.off("path:created");
        } catch (e) {
          console.error("Error remvoing event listeners", e);
        }

        try {
          fabricCanvasRef.current.dispose();
        } catch (e) {
          console.error("Error disposing canvas", e);
        }

        fabricCanvasRef.current = null;
        setCanvas(null);
      }
    };

    cleanUpCanvas();

    //reset init flag
    initAttemptedRef.current = false;

    //init our canvas
    const initcanvas = async () => {
      if (
        typeof window === undefined ||
        !canvasRef.current ||
        initAttemptedRef.current
      ) {
        return;
      }

      initAttemptedRef.current = true;

      try {
        const fabricCanvas = await initializeFabric(
          canvasRef.current,
          canvasContainerRef.current
        );

        if (!fabricCanvas) {
          console.error("Failed to initialize Fabric.js canvas");

          return;
        }

        fabricCanvasRef.current = fabricCanvas;
        //set the canvas in store
        setCanvas(fabricCanvas);

        console.log("Canvas init is done and set in store");

        //apply custom style for the controls
        customizeBoundingBox(fabricCanvas);

        //set up event listeners
        const handleCanvasChange = () => {
          markAsModified();
        };

        fabricCanvas.on("object:added", handleCanvasChange);
        fabricCanvas.on("object:modified", handleCanvasChange);
        fabricCanvas.on("object:removed", handleCanvasChange);
        fabricCanvas.on("path:created", handleCanvasChange);
      } catch (e) {
        console.error("Failed to init canvas", e);
      }
    };

    const timer = setTimeout(() => {
      initcanvas();
    }, 50);

    return () => {
      clearTimeout(timer);
      cleanUpCanvas();
    };
  }, []);
  let width = 0 ; 
  let height = 0 ; 


  if(canvas)
  {
    width = canvas.getWidth();
    height = canvas.getHeight();
  }
  else 
  {
    height = 600; 
  }


return (
  <div
    ref={canvasContainerRef}
    className="relative overflow-auto"
    style={{
      width: width === 0 ? "100%" : `${width}px`,
      height: `${height}px`
    }}
  >
    <canvas ref={canvasRef} />
  </div>
);


}

export default Canvas;
