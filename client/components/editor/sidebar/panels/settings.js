'use client'

import { Check, Palette } from "lucide-react";
import { useState } from "react";
import { colorPresets } from "../../../../config "
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip';

function SettingsPanel (){

    const [backgroundColor, setBackgroundColor] = useState('#ffffff');

    return (
        <div className="p-4 space-y-6">
            <div className="flex items-center space-x-2 mb-4">
                <Palette className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Choose Background Color</h3>
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
                
            </div>
        </div>
    );
}

export default SettingsPanel;
