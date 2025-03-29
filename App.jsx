import React, { useState } from "react";
import "./index.css";

const validateRegNr = (input) => {
  const parts = input.toUpperCase().trim().split(/\s+/);
  const valid = [];
  const invalid = [];

  parts.forEach((reg) => {
    if (/^[A-Z]{3}[0-9]{3}$/.test(reg) || /^[A-Z]{3}[0-9]{2}[A-Z]{1}$/.test(reg)) {
      valid.push(reg);
    } else {
      invalid.push(reg);
    }
  });

  return { valid, invalid };
};

const DraggableBlock = ({ label, value, onRemove, dragHandleProps }) => (
  <div className="draggable-block">
    <span className="drag-icon" {...dragHandleProps}>☰</span>
    <span>{label}</span>
    <span className="code-value">{value}</span>
    <button onClick={onRemove}>❌</button>
  </div>
);

export default function App() {
  const [blocks, setBlocks] = useState([]);
  const [regInput, setRegInput] = useState("");
  const [invalidRegs, setInvalidRegs] = useState([]);

  const handleAddRegBlock = () => {
    const { valid, invalid } = validateRegNr(regInput);
    setInvalidRegs(invalid);

    if (valid.length > 0) {
      setBlocks([
        ...blocks,
        {
          id: Date.now(),
          label: "REGNR",
          value: `in('${valid.join("','")}')`,
        },
      ]);
      setRegInput("");
    }
  };

  const handleRemoveBlock = (id) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const handleDragStart = (index) => (e) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDrop = (index) => (e) => {
    const fromIndex = e.dataTransfer.getData("text/plain");
    if (fromIndex === "") return;

    const updated = [...blocks];
    const movedItem = updated.splice(fromIndex, 1)[0];
    updated.splice(index, 0, movedItem);
    setBlocks(updated);
  };

  return (
    <div className="app">
      <h1>Kodblock Builder 🚗</h1>

      <div className="regnr-input">
        <input
          type="text"
          value={regInput}
          placeholder="Ange registreringsnummer (ex: ABC123 XYZ999)"
          onChange={(e) => setRegInput(e.target.value)}
        />
        <button onClick={handleAddRegBlock}>+ Lägg till REGNR</button>
      </div>

      {invalidRegs.length > 0 && (
        <div className="warning">
          ❗ Ogiltiga regnummer: {invalidRegs.join(", ")}
        </div>
      )}

      <div className="block-list">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="block-wrapper"
            draggable
            onDragStart={handleDragStart(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop(index)}
          >
            <DraggableBlock
              {...block}
              dragHandleProps={{ onMouseDown: (e) => e.stopPropagation() }}
              onRemove={() => handleRemoveBlock(block.id)}
            />
          </div>
        ))}
      </div>

      <div className="generated-code">
        <h3>Genererad kod:</h3>
        <code>
          {blocks.map((b) => `${b.label} ${b.value}`).join(" AND ")}
        </code>
      </div>
    </div>
  );
}
