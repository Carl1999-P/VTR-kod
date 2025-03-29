import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const kriterier = [
  { label: "Fordonstyp", field: "FORDONSTYP", values: ["Personbil", "Lastbil", "Släp", "Motorcykel"] },
  { label: "I trafik", field: "ITRAFIK", values: ["Ja", "Nej"] },
  { label: "Fabrikat", field: "FABRKOD", values: ["Volvo", "Scania", "Volkswagen"] },
  { label: "Yttre användning", field: "YTRANVSATT", values: ["TAXI", "UR", "GODS", "PRIVAT"] }
];

const valideraRegNr = (reg) => {
  const regnrRegex = /^[A-Z]{3}[0-9]{2}[A-Z0-9]{1}$|^[A-Z]{3}[0-9]{3}$/;
  return regnrRegex.test(reg.toUpperCase());
};

const App = () => {
  const [block, setBlock] = useState([]);
  const [regInput, setRegInput] = useState("");
  const [regList, setRegList] = useState([]);

  const läggTillBlock = (kriterie) => {
    setBlock([...block, { ...kriterie, selected: [], not: false }]);
  };

  const uppdateraVal = (index, value) => {
    const uppd = [...block];
    if (uppd[index].selected.includes(value)) {
      uppd[index].selected = uppd[index].selected.filter(v => v !== value);
    } else {
      uppd[index].selected.push(value);
    }
    setBlock(uppd);
  };

  const läggTillReg = () => {
    const reg = regInput.trim().toUpperCase();
    const split = reg.split(/\s+/).filter(val => valideraRegNr(val));
    setRegList([...regList, ...split]);
    setRegInput("");
  };

  const genereraKod = () => {
    const parts = [];

    if (regList.length > 0) {
      parts.push(`REGNR in('${regList.join("','")}')`);
    }

    block.forEach(({ field, selected, not }) => {
      if (selected.length > 0) {
        const join = selected.map(val => `'${val}'`).join(",");
        const kod = `${field} ${not ? "!in" : "in"}(${join})`;
        parts.push(kod);
      }
    });

    return parts.join(" and ");
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Kodblock Builder 🚗</h1>

      <div className="flex space-x-2 mb-4">
        {kriterier.map((k, i) => (
          <button key={i} onClick={() => läggTillBlock(k)} className="bg-blue-500 text-white px-3 py-1 rounded">
            + {k.label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <input value={regInput} onChange={(e) => setRegInput(e.target.value)} className="border p-2 mr-2" placeholder="Ange registreringsnummer" />
        <button onClick={läggTillReg} className="bg-green-500 text-white px-3 py-1 rounded">+ Lägg till REGNR</button>
      </div>

      {block.map((b, idx) => (
        <div key={idx} className="mb-2 border p-2 rounded bg-gray-100">
          <label className="font-semibold">{b.label}</label>
          <div className="flex gap-2 flex-wrap mt-1">
            {b.values.map((val, i) => (
              <button
                key={i}
                onClick={() => uppdateraVal(idx, val)}
                className={`px-2 py-1 border rounded ${b.selected.includes(val) ? "bg-blue-400 text-white" : "bg-white"}`}
              >
                {val}
              </button>
            ))}
          </div>
          <div className="mt-1">
            <label className="mr-2">Inte?</label>
            <input type="checkbox" checked={b.not} onChange={(e) => {
              const uppd = [...block];
              uppd[idx].not = e.target.checked;
              setBlock(uppd);
            }} />
          </div>
        </div>
      ))}

      <div className="mt-6">
        <h2 className="font-bold">Genererad kod:</h2>
        <pre className="bg-white border p-2 mt-2">{genereraKod()}</pre>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

