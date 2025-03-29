import { useState } from 'react';

export default function App() {
  const [blocks, setBlocks] = useState([]);

  const addBlock = (type) => {
    const id = Date.now();
    if (type === 'tag') {
      setBlocks([...blocks, { id, type: 'tag', value: '' }]);
    } else if (type === 'field') {
      setBlocks([...blocks, { id, type: 'field', field: '', operator: '=', value: '' }]);
    } else if (type === 'logic') {
      setBlocks([...blocks, { id, type: 'logic', value: 'and' }]);
    }
  };

  const updateBlock = (id, key, val) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [key]: val } : b));
  };

  const generateCode = () => {
    return blocks.map(b => {
      if (b.type === 'tag') return `#${b.value}#`;
      if (b.type === 'field') return `${b.field} ${b.operator} ${b.value}`;
      if (b.type === 'logic') return b.value;
      return '';
    }).join(' ');
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Kodblock Builder 🚗</h1>

      <div className="flex gap-2">
        <button onClick={() => addBlock('tag')} className="bg-blue-500 text-white px-3 py-1 rounded">+ Tagg</button>
        <button onClick={() => addBlock('field')} className="bg-green-500 text-white px-3 py-1 rounded">+ Villkor</button>
        <button onClick={() => addBlock('logic')} className="bg-purple-500 text-white px-3 py-1 rounded">+ AND/OR</button>
      </div>

      {blocks.map((block) => (
        <div key={block.id} className="bg-gray-100 p-3 rounded flex gap-2 items-center">
          {block.type === 'tag' && (
            <>
              <span>#</span>
              <input
                value={block.value}
                onChange={(e) => updateBlock(block.id, 'value', e.target.value)}
                placeholder="t.ex. Personbil"
                className="border px-2 py-1"
              />
              <span>#</span>
            </>
          )}
          {block.type === 'field' && (
            <>
              <input
                value={block.field}
                onChange={(e) => updateBlock(block.id, 'field', e.target.value)}
                placeholder="Fält"
                className="border px-2 py-1"
              />
              <select
                value={block.operator}
                onChange={(e) => updateBlock(block.id, 'operator', e.target.value)}
                className="border px-2 py-1"
              >
                <option value="=">=</option>
                <option value="!=">!=</option>
                <option value="<">&lt;</option>
                <option value=">">&gt;</option>
                <option value="in">in</option>
                <option value="!in">!in</option>
              </select>
              <input
                value={block.value}
                onChange={(e) => updateBlock(block.id, 'value', e.target.value)}
                placeholder="Värde"
                className="border px-2 py-1"
              />
            </>
          )}
          {block.type === 'logic' && (
            <select
              value={block.value}
              onChange={(e) => updateBlock(block.id, 'value', e.target.value)}
              className="border px-2 py-1"
            >
              <option value="and">and</option>
              <option value="or">or</option>
            </select>
          )}
        </div>
      ))}

      <div className="bg-white border mt-6 p-3 rounded shadow text-sm">
        <strong>Genererad kod:</strong><br />
        <code>{generateCode()}</code>
      </div>
    </div>
  );
}
