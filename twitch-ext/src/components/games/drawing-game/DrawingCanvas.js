// client/src/components/DrawingCanvas.js
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import io from "socket.io-client";
// import "./DrawingCanvas.css";

const socket = io("http://localhost:3000");

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(5);

  useEffect(() => {
    const canvas = new fabric.Canvas("drawingCanvas", {
      isDrawingMode: true,
      backgroundColor: "#ffffff",
    });
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = brushWidth;

    canvasRef.current = canvas;

    // Update canvas on brush color/width change
    canvas.on("mouse:up", () => {
      socket.emit("drawing", canvas.toJSON());
    });

    // Handle incoming drawing data
    socket.on("drawing", (data) => {
      canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
    });

    // Handle clear canvas event
    socket.on("clearCanvas", () => {
      canvas.clear().setBackgroundColor("#ffffff", canvas.renderAll.bind(canvas));
    });

    return () => {
      socket.off("drawing");
      socket.off("clearCanvas");
    };
  }, [color, brushWidth]);

  const handleClearCanvas = () => {
    canvasRef.current.clear().setBackgroundColor("#ffffff", canvasRef.current.renderAll.bind(canvasRef.current));
    socket.emit("clearCanvas");
  };

  return (
    <div className="drawing-container">
      <canvas id="drawingCanvas" width="800" height="600"></canvas>
      <div className="controls">
        <label>
          Color:
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label>
          Brush Width:
          <input type="range" min="1" max="50" value={brushWidth} onChange={(e) => setBrushWidth(e.target.value)} />
        </label>
        <button onClick={handleClearCanvas}>Clear Canvas</button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
