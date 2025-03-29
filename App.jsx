import { useState } from 'react';

export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const vehicleTypes = ['Personbil', 'Lastbil', 'Släp', 'Buss', 'Ambulans'];
  const drivmedel = ['BENSIN', 'DIESEL', 'EL', 'HYBRID'];
  const karosser = ['Husvagn', 'Flak', 'Skåp', 'Container'];
  const ytanv = ['GODS', 'TAXI', 'UR', 'TRAFIKSKOL', 'AMBULANS'];

  const handleSelect = (field, value) => {
    setAnswers({ ...answers, [field]: value });
    setStep(step + 1);
  };

  const handleInput = (field, value) => {
    setAnswers({ ...answers, [field]: value });
  };

  const generateCode = () => {
    let code = [];
    if (answers.typ) code.push(`#${answers.typ}#`);
    if (answers.trafik === 'Ja') code.push(`#I trafik#`);
    if (answers.trafik === 'Nej') code.push(`#Avställd#`);
    if (answers.drivmedel) code.push(`DRIVMEDEL in('${answers.drivmedel}')`);
    if (answers.ytanv) code.push(`YTRANVSATT in('${answers.ytanv}')`);
    if (answers.kaross) code.push(`KAROSSNY in('${answers.kaross}')`);
    if (answers.regnr) code.push(`REGNR in('${answers.regnr}')`);
    return code.join(' and ');
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Kodblock Builder 🚗</h1>

      {step === 0 && (
        <div>
          <p>1. Vilket typ av fordon är det?</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {vehicleTypes.map(v => (
              <button
                key={v}
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => handleSelect('typ', v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <p>2. Är fordonet i trafik?</p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => handleSelect('trafik', 'Ja')} className="bg-green-500 text-white px-3 py-1 rounded">Ja</button>
            <button onClick={() => handleSelect('trafik', 'Nej')} className="bg-red-500 text-white px-3 py-1 rounded">Nej</button>
          </div>
        </div>
      )}

      {step === 2 && answers.typ !== 'Släp' && (
        <div>
          <p>3. Välj drivmedel</p>
          <select className="border px-2 py-1" onChange={e => handleSelect('drivmedel', e.target.value)}>
            <option value="">- Välj -</option>
            {drivmedel.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      )}

      {step === 2 && answers.typ === 'Släp' && (
        <div>
          <p>3. Välj karosstyp</p>
          <select className="border px-2 py-1" onChange={e => handleSelect('kaross', e.target.value)}>
            <option value="">- Välj -</option>
            {karosser.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      )}

      {step === 3 && (
        <div>
          <p>4. Välj yttre användning (valfritt)</p>
          <select className="border px-2 py-1" onChange={e => handleSelect('ytanv', e.target.value)}>
            <option value="">- Hoppa över -</option>
            {ytanv.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      )}

      {step >= 3 && (
        <div>
          <p>5. REGNR (valfritt):</p>
          <input
            placeholder="t.ex. ABC123"
            className="border px-2 py-1"
            onChange={(e) => handleInput('regnr', e.target.value)}
          />
        </div>
      )}

      <div className="bg-white border mt-6 p-3 rounded shadow text-sm">
        <strong>Genererad kod:</strong><br />
        <code>{generateCode()}</code>
      </div>
    </div>
  );
}
