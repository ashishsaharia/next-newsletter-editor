"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { colorPresets } from "@/config";
import { centerCanvas } from "@/fabric/fabric-utils";
import { useEditorStore } from "@/store";
import { Check, Palette } from "lucide-react";
import { useState } from "react";

function SettingsPanel() {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  // NEW STATE for canvas size
  
  const { canvas, markAsModified } = useEditorStore();
  const [canvasWidth, setCanvasWidth] = useState(canvas.getWidth());
  const [canvasHeight, setCanvasHeight] = useState(canvas.getHeight());

  const handleColorChange = (event) => {
    setBackgroundColor(event.target.value);
  };

  const handleColorPresetApply = (color) => {
    setBackgroundColor(color);
  };

  const handleApplyChanges = () => {
    if (!canvas) return;

    canvas.set("backgroundColor", backgroundColor);
    canvas.renderAll();

    centerCanvas(canvas);
    markAsModified();
  };

  // NEW: apply canvas width and height
  const handleSizeApply = () => {
    if (!canvas) return;

    canvas.setWidth(parseInt(canvasWidth));
    canvas.setHeight(parseInt(canvasHeight));

    canvas.calcOffset();
    canvas.renderAll();

    centerCanvas(canvas);
    canvas.calcOffset();

    markAsModified();
  };

  return (
    <div className="p-4 space-y-6">

      <div className="flex items-center space-x-2 mb-4">
        <Palette className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Choose Background Color</h3>
      </div>

      <div className="space-y-2">

        {/* COLOR PRESETS */}
        <div className="grid grid-cols-6 gap-2 mb-3">
          {colorPresets.map((color) => (
            <TooltipProvider key={color}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`w-8 h-8 rounded-md border transition-transform hover:scale-110 ${
                      color === backgroundColor
                        ? "ring-2 ring-offset-2 ring-primary"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorPresetApply(color)}
                  >
                    {color === backgroundColor && (
                      <Check className="w-4 h-4 text-white mx-auto drop-shadow-md" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{color}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* CUSTOM COLOR INPUT */}
        <div className="flex mt-3 space-x-2">
          <Input
            type="color"
            value={backgroundColor}
            onChange={handleColorChange}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={backgroundColor}
            onChange={handleColorChange}
            placeholder="#FFFFFF"
          />
        </div>

        <Separator className="my-4" />

        {/* CANVAS SIZE SETTINGS */}
        <h3 className="text-lg font-semibold">Canvas Size</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm mb-1">Width</p>
            <Input
              type="number"
              value={canvasWidth}
              onChange={(e) => setCanvasWidth(e.target.value)}
              placeholder="Canvas Width"
            />
          </div>

          <div>
            <p className="text-sm mb-1">Height</p>
            <Input
              type="number"
              value={canvasHeight}
              onChange={(e) => setCanvasHeight(e.target.value)}
              placeholder="Canvas Height"
            />
          </div>
        </div>

        <Button className="w-full mt-2" onClick={handleSizeApply}>
          Apply Canvas Size
        </Button>

        <Separator className="my-4" />

        {/* APPLY COLOR BUTTON */}
        <Button className="w-full" onClick={handleApplyChanges}>
          Apply Background
        </Button>
      </div>
    </div>
  );
}

export default SettingsPanel;
