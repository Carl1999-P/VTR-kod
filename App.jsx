import React, { useState } from 'react';
import './index.css';

const REGNR_PATTERN = /^[A-Z]{3}\d{3}$|^[A-Z]{3}\d{2}[A-Z]{1}$/;

const validateRegNumber = (reg) => REGNR_PATTERN.test(reg.toUpperCase());

const initialBlocks = [];

function App() {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [input, setInput] = useState('');
  const [warning, setWarning] = useState('');

  const handleAddBlock = () => {
    if (!input) return;

    const inputs = input.trim().toUpperCase().split(/\s+/);
    const validInputs = [];
    const invalidInputs = [];

    inputs.forEach(reg => {
      if (validateRegNumber(reg)) {
        validInputs.push(reg);
      } else {
        invalidInputs.push(reg);
      }
    });

    if (invalidInputs.length > 0) {
      setWarning(`Ogiltigt regnr: ${invalidInputs.join(', ')}`);
    } else {
      setWarning('');
    }

    if (validInputs.length > 0) {
      const newBlock = {
        id: Date.now(),
        type: 'REGNR',
        values: validInputs,
      };
      setBlocks([...blocks, newBlock]);
      setInput('');
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('dragIndex', index);
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData('dragIndex');
    if (dragIndex === dropIndex) return;

    const updatedBlocks = [...blocks];
    const [moved] = updatedBlocks.splice(dragIndex, 1);
    updatedBlocks.splice(dropIndex, 0, moved);
    setBlocks(updatedBlocks);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="app">
      <h1>Kodblock Builder 🚗</h1>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="Ange registreringsnummer"
        />
        <button onClick={handleAddBlock}>+ Lägg till REGNR</button>
        {warning && <div className="warning">{warning}</div>}
      </div>

      <div>
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="draggable-block"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
          >
            <span className="drag-icon">☰</span>
            <strong>{block.type}:</strong> in({block.values.map(v => `'${v}'`).join(', ')})
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <strong>Genererad kod:</strong>
        <div style={{ marginTop: '8px' }}>
          {blocks.map(block => `${block.type} in(${block.values.map(v => `'${v}'`).join(', ')})`).join(' AND ')}
        </div>
      </div>
    </div>
  );
}

export default App;
