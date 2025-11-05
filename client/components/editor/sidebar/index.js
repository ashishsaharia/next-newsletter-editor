'use client'

import { useState } from "react";
import ElementsPanel from "./panels/elements";
import TextPanel from "./panels/text";
import UploadsPanel from "./panels/upload";
import DrawPanel from "./panels/draw";
import SettingsPanel from "./panels/settings";
import { Pencil, Settings, Text, Upload, Grid, ArrowLeft, ChevronLeft } from "lucide-react";

function Sidebar(){

    const [isPanelCollapsed, setIsPanelCollapsed] = useState(false); 
    const [activeSidebar, setActiveSidebar] = useState(null);

    const sidebarItems = [
        {
            id: 'elements', 
            icon : Grid, 
            label : "Elements",
            panel : () => <ElementsPanel></ElementsPanel>
        },
        {
            id: 'text', 
            icon : Text, 
            label : "Texts",
            panel : () => <TextPanel></TextPanel>
        },
        {
            id: 'uploads', 
            icon : Upload, 
            label : "uploads",
            panel : () => <UploadsPanel></UploadsPanel> 
        },
        {
            id: 'draw', 
            icon : Pencil, 
            label : "draw",
            panel : () => <DrawPanel/> 
        },
        {
            id: 'settings', 
            icon : Settings, 
            label : "settings",
            panel : () => <SettingsPanel/> 
        },
    ]


    const handleItemClick = (id) =>{
        if(id === activeSidebar && !isPanelCollapsed) return 
        setActiveSidebar(id); 
        setIsPanelCollapsed(false);
    }
    

    const activeItem = sidebarItems.find(item => item.id === activeSidebar)


    const closeSecondaryPanel = () =>{
        setActiveSidebar(null)
    }

    const togglePanelCollapse = (e) =>{
        e.stopPropagation(); 
        setIsPanelCollapsed(!isPanelCollapsed)
    }


    return(
        <div className="flex h-full">
            <aside className = "sidebar ">
            {
                sidebarItems.map(item=>(
                    <div onClick={()=>handleItemClick(item.id)} key = {item.id} className= {`sidebar-item ${activeSidebar === item.id ? 'active' : ""}`}>
                        <item.icon className = 'sidebar-item-icon h-5 w-5'></item.icon>
                        <span className="sidebar-item-label">{item.label}</span>
                    </div>
                ))
            }
            </aside>
            {
                activeSidebar && <div className={`secondary-panel ${isPanelCollapsed ? 'collapsed' : ''}`}
                style={{
                    width : isPanelCollapsed ? '0' : '300px', 
                    opacity : isPanelCollapsed ? 0 : 1, 
                    overflow : isPanelCollapsed ? 'hidden' : ''
                }}
                >
                    <div className= "panel-header">
                        <button className="back-button" onClick={closeSecondaryPanel}>
                            <ArrowLeft className="h-5 w-5"></ArrowLeft>
                        </button>
                        <span className="panel-title">{activeItem.label}</span>
                    </div>
                    <div className="panel-content">
                        {activeItem?.panel()}
                    </div>
                    <button className="collapse-button" onClick={togglePanelCollapse}>
                        <ChevronLeft className="h-5 w-5"></ChevronLeft>
                    </button>
                </div>
            }
        </div>
    )
}

export default Sidebar;