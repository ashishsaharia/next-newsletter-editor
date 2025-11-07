'use client'

import { Check, Palette, Ruler } from "lucide-react";
import { useState, useEffect } from "react";
import { colorPresets } from "../../../../config/index"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Separator } from '../../../ui/separator';
import { useEditorStore } from '../../../../store/index';
import { centerCanvas } from "../../../../fabric/fabric-utils";

function SettingsPanel (){

    const { canvas } = useEditorStore();

    // default empty values until canvas loads
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [canvasWidth, setCanvasWidth] = useState("");
    const [canvasHeight, setCanvasHeight] = useState("");

    const [orientation, setOrientation] = useState("portrait");

    // Load width/height from canvas when available
    useEffect(() => {
        if (!canvas) return;
        setCanvasWidth(canvas.getWidth());
        setCanvasHeight(canvas.getHeight());
        setBackgroundColor(canvas.backgroundColor || '#ffffff');
    }, [canvas]);

    const handleColorChange = (e) => {
        setBackgroundColor(e.target.value);
    };

    // A4 preset at ~110 DPI
    const applyA4Preset = () => {
        const portrait = { w: 910, h: 1286 };
        const landscape = { w: 1286, h: 910 };

        if (orientation === "portrait") {
            setCanvasWidth(portrait.w);
            setCanvasHeight(portrait.h);
        } else {
            setCanvasWidth(landscape.w);
            setCanvasHeight(landscape.h);
        }
    };

    // Flip width/height on orientation switch
    const flipOrientation = (newOrientation) => {
        setOrientation(newOrientation);
        setCanvasWidth(prevWidth => {
            const oldW = prevWidth;
            const oldH = canvasHeight;
            setCanvasHeight(oldW);
            return oldH;
        });
    };

    const handleApplyChange = () => {
        if(!canvas) return;

        canvas.set('backgroundColor', backgroundColor);
        canvas.setWidth(Number(canvasWidth));
        canvas.setHeight(Number(canvasHeight));

        canvas.renderAll();
        centerCanvas(canvas);
    };

    return (
        <div className="p-4 space-y-6">

            {/* Background */}
            <div className="flex items-center space-x-2 mb-4">
                <Palette className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Background Color</h3>
            </div>

            <div className="space-y-2">
                <div className="grid grid-cols-6 gap-2 mb-3">
                    {colorPresets.map(color => (
                        <TooltipProvider key={color}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => setBackgroundColor(color)}
                                        className={`w-8 h-8 rounded-md transition-transform hover:scale-110 ${color === backgroundColor ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                                        style={{ backgroundColor: color }}
                                    >
                                        {color === backgroundColor && (
                                            <Check className="w-4 h-4 text-white mx-auto drop-shadow-md" />
                                        )}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>{color}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>

                <div className="flex items-center space-x-2">
                    <Input type="color" value={backgroundColor} onChange={handleColorChange} className="w-12 h-10 p-1" />
                    <Input type="text" value={backgroundColor} onChange={handleColorChange} className="flex-1" placeholder="#ffffff" />
                </div>
            </div>

            <Separator className="my-4" />

            {/* Canvas Size */}
            <div className="flex items-center space-x-2 mb-2">
                <Ruler className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Canvas Size</h3>
            </div>

            <div className="flex space-x-2">
                <Input
                    type="number"
                    value={canvasWidth}
                    onChange={(e) => setCanvasWidth(e.target.value)}
                    className="w-24"
                    placeholder="Width"
                />
                <Input
                    type="number"
                    value={canvasHeight}
                    onChange={(e) => setCanvasHeight(e.target.value)}
                    className="w-24"
                    placeholder="Height"
                />
            </div>

            {/* Orientation + A4 */}
            <div className="flex items-center space-x-3 pt-2">
                <select
                    value={orientation}
                    onChange={(e) => flipOrientation(e.target.value)}
                    className="border rounded-md px-2 py-1"
                >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                </select>

                <Button variant="outline" onClick={applyA4Preset}>
                    A4 Size
                </Button>
            </div>

            <Separator className="my-4" />

            <Button className="w-full" onClick={handleApplyChange}>
                Apply Changes
            </Button>

        </div>
    );
}

export default SettingsPanel;
