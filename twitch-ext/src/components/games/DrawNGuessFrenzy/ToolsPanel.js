// ToolsPanel.js
import React, { useState } from "react";
// import './Canvas'
import "./DrawNGuessFrenzy.css";

function ToolsPanel({ setDrawingColor, setBrushType, setBrushSize, setBackground, undo }) {
  const [currentColor, updateCurrentColor] = useState("#000000");
  const [currentBrushType, updateCurrentBrushType] = useState("pen");
  const [currentBrushSize, updateCurrentBrushSize] = useState(5);
  const [currentBackground, updateCurrentBackground] = useState("white");

  const handleColorChange = (e) => {
    updateCurrentColor(e.target.value);
    setDrawingColor(e.target.value);
  };

  const handleBrushTypeChange = (e) => {
    updateCurrentBrushType(e.target.value);
    setBrushType(e.target.value);
  };

  const handleBrushSizeChange = (e) => {
    updateCurrentBrushSize(Number(e.target.value));
    setBrushSize(Number(e.target.value));
  };

  const handleBackgroundChange = (e) => {
    updateCurrentBackground(e.target.value);
    setBackground(e.target.value);
  };

  return (
    <div className="tools-panel">
      <div className="tool-group">
        <label>Brush Type:</label>
        <select value={currentBrushType} onChange={handleBrushTypeChange}>
          <option value="pen">Pen</option>
          <option value="pencil">Pencil</option>
          <option value="spray">Spray</option>
          <option value="marker">Marker</option>
          <option value="eraser">Eraser</option>
        </select>
      </div>

      <div className="tool-group">
        <label>Color:</label>
        <input type="color" value={currentColor} onChange={handleColorChange} />
      </div>

      <div className="tool-group">
        <label>Brush Size:</label>
        <input
          type="range"
          min="1"
          max="20"
          value={currentBrushSize}
          onChange={handleBrushSizeChange}
        />
      </div>

      <div className="tool-group">
        <label>Background:</label>
        <select value={currentBackground} onChange={handleBackgroundChange}>
          <option value="white">White</option>
          <option value="lightgrey">Light Grey</option>
          <option value="yellow">Yellow</option>
          <option value="blue">Blue</option>
        </select>
      </div>

      <button onClick={undo}>Undo</button>
    </div>
  );
}

export default ToolsPanel;
