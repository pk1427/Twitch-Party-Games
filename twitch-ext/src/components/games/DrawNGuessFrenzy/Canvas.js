import React, { useRef, useEffect, useState } from "react";
import "./DrawNGuessFrenzy.css";

import ToolsPanel from "./ToolsPanel";

function Canvas({ socket, roomId }) {
  const canvasRef = useRef(null);
  const [drawingColor, setDrawingColor] = useState("#000000");
  const [brushType, setBrushType] = useState("pen");
  const [brushSize, setBrushSize] = useState(5);
  const [background, setBackground] = useState("white");
  const [history, setHistory] = useState([]);
  const drawingRef = useRef(false); // Use useRef to manage drawing state

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Initialize canvas
    canvas.width = 500;
    canvas.height = 500;
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineJoin = "round";
    context.lineCap = "round";
    context.strokeStyle = drawingColor;
    context.lineWidth = brushSize;

    const draw = (x, y, emit = true) => {
      if (brushType === "eraser") {
        context.globalCompositeOperation = "destination-out";
        context.lineWidth = brushSize;
        context.strokeStyle = "rgba(0,0,0,1)";
      } else {
        context.globalCompositeOperation = "source-over";
        context.strokeStyle = drawingColor;
        context.lineWidth = brushSize;
      }

      if (brushType === "spray") {
        for (let i = 0; i < 10; i++) {
          const offsetX = Math.random() * brushSize - brushSize / 2;
          const offsetY = Math.random() * brushSize - brushSize / 2;
          context.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
      } else {
        context.lineTo(x, y);
        context.stroke();
      }

      if (emit) {
        socket.emit("draw", roomId, { x, y, brushType, brushSize, drawingColor });
      }
    };

    const handleMouseDown = (event) => {
      drawingRef.current = true; // Set drawing to true
      // Check if event and nativeEvent are defined
      if (event && event.nativeEvent) {
        const { offsetX, offsetY } = event.nativeEvent; // Use nativeEvent to access offsetX and offsetY
        context.beginPath(); // Begin the path for drawing
        context.moveTo(offsetX, offsetY); // Move to the starting point
        draw(offsetX, offsetY); // Draw at the starting point
      }
    };

    const handleMouseMove = (e) => {
      if (!drawingRef.current) return; // Only draw if mouse is down
      if (e && e.nativeEvent) {
        draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      }
    };

    const handleMouseUp = () => {
      if (!drawingRef.current) return; // Check if currently drawing
      drawingRef.current = false; // Set drawing to false
      context.closePath(); // Close the path
      // Save state for undo
      const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
      setHistory((prevHistory) => [...prevHistory, imgData]);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Listen for draw events from server
    socket.on("draw", ({ x, y, brushType, brushSize, drawingColor }) => {
      const ctx = canvas.getContext("2d");
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = drawingColor;

      if (brushType === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = "rgba(0,0,0,1)";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = drawingColor;
        ctx.lineWidth = brushSize;
      }

      if (brushType === "spray") {
        for (let i = 0; i < 10; i++) {
          const offsetX = Math.random() * brushSize - brushSize / 2;
          const offsetY = Math.random() * brushSize - brushSize / 2;
          ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    });

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      socket.off("draw");
    };
  }, [socket, roomId, drawingColor, brushSize, brushType, background]);

  const undo = () => {
    if (history.length > 0) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const previous = history[history.length - 1];
      context.putImageData(previous, 0, 0);
      setHistory(history.slice(0, -1));
    }
  };

  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} className="canvas" />
      {/* The ToolsPanel is now separate */}
    </div>
  );
}

export default Canvas;
