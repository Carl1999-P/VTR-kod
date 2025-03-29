import { useState } from 'react';

const BLOCKS = [
  { id: 'vehicle', label: 'Fordonstyp', options: ['Personbil', 'Lastbil', 'Lätt lastbil', 'Släp', 'Lätt släp', 'Buss', 'Ambulans', 'Moped'], type: 'tag' },
  { id: 'trafik', label: 'I trafik?', options: ['I trafik', 'Avställd'], type: 'tag' },
  { id: 'drivmedel', label: 'Drivmedel', options: ['BENSIN', 'DIESEL', 'EL', 'HYBRID'], type: 'field', field: 'DRIVMEDEL' },
  { id: 'ytanv', label: 'Yttre användning', options: ['GODS', 'TAXI', 'UR', 'TRAFIKSKOL', 'AMBULANS'], type: 'checkbox', field: 'YTRANVSATT' },
  { id: 'kaross', label: 'Karosstyp', options: ['Husvagn', 'Flak', 'Skåp', 'Container'], type: 'field', field: 'KAROSSNY' },
  { id: 'fabrkod', label: 'Fordonets märke', options: ['RAM', 'VOLVO', 'SCANIA'], type: 'field', field: 'FABRKOD' },
  { id: 'regnr', label: 'Registreringsnummer', options: [], type: 'multiinput', field: 'REGNR' },
  { id: 'totalvikt', label: 'Totalvikt (kg)', options: [], type: 'numeric', field: 'TOTALVIKTSANKT' },
];

export default function App() {
  const [blocks, setBlocks] = useState([]);

  const addBlock = (block) => {
    setBlocks([...blocks, { ...block, value: block.type === 'checkbox' ? [] : '', negate: false, operator: '=' }]);
  };

  const updateValue = (index, value) => {
    const updated = [...blocks];
    updated[index].value = value;
    setBlocks(updated);
  };

  const updateNegate = (index, negate) => {
    const updated = [...blocks];
    updated[index].negate = negate;
    setBlocks(updated);
  };

  const updateOperator = (index, op) => {
    const updated = [...blocks];
    updated[index].operator = op;
    setBlocks(updated);
  };

  const removeBlock = (index) => {
    const updated = [...blocks];
    updated.splice(index, 1);
    setBlocks(updated);
  };

  const handleInputList = (value) => {
    return value.split(/\s+/).map(v => v.trim()).filter(v => v);
  };

  const toggleCheckboxValue = (blockIndex, val) => {
    const updated = [...blocks];
    const values = updated[blockIndex].value;
    updated[blockIndex].value = values.includes(val)
      ? values.filter(v => v !== val)
      : [...values, val];
    setBlocks(updated);
  };

  const generateCode = () => {
    return blocks
      .filter(b => b.value && (Array.isArray(b.value) ? b.value.length : true))
      .map(b => {
        if (b.type === 'tag') return `#${b.value}#`;
        if (b.type === 'checkbox' || b.type === 'multiinput') {
          const valList = (Array.isArray(b.value) ? b.value : handleInputList(b.value)).map(v => `'${v}'`).join(',');
          return `${b.field} ${b.negate ? '!in' : 'in'}(${valList})`;
        }
        if (b.type === 'field') {
          return `${b.field} ${b.negate ? '!in' : 'in'}('${b.value}')`;
        }
        if (b.type === 'numeric') {
          return `${b.field} ${b.operator} ${b.value}`;
        }
        return '';
      })
      .join(' and ');
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Kodblock Builder 🚗</h1>
      <p className="text-sm text-gray-600">Välj vilka block du vill använda för att bygga din kodrad:</p>

      <div className="flex flex-wrap gap-2">
        {BLOCKS.map((block) => (
          <button
            key={block.id}
            onClick={() => addBlock(block)}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            + {block.label}
          </button>
        ))}
      </div>

      {blocks.map((block, index) => (
        <div key={index} className="bg-gray-100 p-3 rounded flex flex-wrap gap-2 items-center mt-2">
          <strong>{block.label}:</strong>

          {block.type === 'multiinput' ? (
            <input
              className="border px-2 py-1"
              placeholder="ABC123 XYZ999 ..."
              value={block.value}
              onChange={(e) => updateValue(index, e.target.value)}
            />
          ) : block.type === 'checkbox' ? (
            <div className="flex gap-1">
              {block.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => toggleCheckboxValue(index, opt)}
                  className={`px-2 py-1 rounded text-sm border ${blocks[index].value.includes(opt) ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : block.type === 'numeric' ? (
            <>
              <select value={block.operator} onChange={(e) => updateOperator(index, e.target.value)} className="border px-2 py-1">
                <option value="=">=</option>
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value=">=">&ge;</option>
                <option value="<=">&le;</option>
              </select>
              <input
                type="number"
                className="border px-2 py-1"
                value={block.value}
                onChange={(e) => updateValue(index, e.target.value)}
              />
            </>
          ) : (
            <select
              className="border px-2 py-1"
              value={block.value}
              onChange={(e) => updateValue(index, e.target.value)}
            >
              <option value="">- Välj -</option>
              {block.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {(block.type !== 'tag') && (
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={block.negate}
                onChange={(e) => updateNegate(index, e.target.checked)}
              /> inte
            </label>
          )}

          <button
            onClick={() => removeBlock(index)}
            className="text-sm text-red-500"
          >
            Ta bort
          </button>
        </div>
      ))}

      <div className="bg-white border mt-6 p-3 rounded shadow text-sm">
        <strong>Genererad kod:</strong><br />
        <code>{generateCode()}</code>
      </div>
    </div>
  );
}
