import React, { useState, useRef, useEffect } from 'react';
import CanvasDraw from "react-canvas-draw";
import '../styles/Canvas.css';

const Canvas = ({userID, username, socket}) => {
    return (
        <div className="canvas">
            <p>Work in progress!</p><img src="https://img.icons8.com/ios-filled/100/000000/road-worker.png"/>
        </div>
    )
}

export default Canvas

/*
<CanvasDraw
    ref={canvasRef}
    onChange={handleCanvas}
    className='canvas__canvas'
    brushRadius={brushRadius}
    brushColor="#000"
    canvasWidth={1100}
    canvasHeight={600}
    gridColor="rgba(0,0,0,0.5)"
    lazyRadius={0}
/>
*/