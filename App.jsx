import { useState } from 'react';

const BLOCKS = [
  {
    id: 'vehicle',
    label: 'Fordonstyp',
    options: ['Personbil', 'Lastbil', 'Släp', 'Buss', 'Ambulans'],
    type: 'tag',
  },
  {
    id: 'trafik',
    label: 'I trafik?',
    options: ['I trafik', 'Avställd'],
    type: 'tag',
  },
  {
    id: 'drivmedel',
    label: 'Drivmedel',
    options: ['BENSIN', 'DIESEL', 'EL', 'HYBRID'],
    type: 'field',
    field: 'DRIVMEDEL',
  },
  {
    id: 'ytanv',
    label: 'Yttre användning',
    options: ['GODS', 'TAXI', 'UR', 'TRAFIKSKOL', 'AMBULANS'],
    type: 'field',
    field: 'YTRANVSATT',
  },
  {
    id: 'kaross',
    label: 'Karosstyp',
    options: ['Husvagn', 'Flak', 'Skåp', 'Container'],
    type: 'field',
    field: 'KAROSSNY',
  },
  {
    id: 'regnr',
    label: 'Registreringsnummer',
    options: [],
    type: 'input',
    field: 'REGNR',
  },
];

export default function App() {
  const [blocks, setBlocks] = useState([]);

  const addBlock = (block) => {
    setBlocks([...blocks, { ...block, value: '' }]);
  };

  const updateValue = (index, value) => {
    const updated = [...blocks];
    updated[index].value = value;
    setBlocks(updated);
  };

  const removeBlock = (index) => {
    const updated = [...blocks];
    updated.splice(index, 1);
    setBlocks(updated);
  };

  const generateCode = () => {
    return blocks
      .filter(b => b.value)
      .map(b => {
        if (b.type === 'tag') return `#${b.value}#`;
        if (b.type === 'field') return `${b.field} in('${b.value}')`;
        if (b.type === 'input') return `${b.field} in('${b.value}')`;
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
        <div key={index} className="bg-gray-100 p-3 rounded flex gap-2 items-center mt-2">
          <strong>{block.label}:</strong>
          {block.type === 'input' ? (
            <input
              className="border px-2 py-1"
              placeholder="Ange..."
              value={block.value}
              onChange={(e) => updateValue(index, e.target.value)}
            />
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
