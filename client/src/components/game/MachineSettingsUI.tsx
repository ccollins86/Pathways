import { useState, useEffect } from "react";
import { useGame } from "@/lib/stores/useGame";

const COLOR_OPTIONS = [
  { label: "White", value: "white" },
  { label: "Black", value: "black" },
  { label: "Red", value: "#e53935" },
  { label: "Blue", value: "#1e88e5" },
  { label: "Green", value: "#43a047" },
  { label: "Yellow", value: "#fdd835" },
  { label: "Orange", value: "#fb8c00" },
  { label: "Purple", value: "#8e24aa" },
  { label: "Pink", value: "#ec407a" },
  { label: "Gray", value: "#757575" },
  { label: "Navy", value: "#1a237e" },
  { label: "Gold", value: "#ffc107" },
];

const SIZE_OPTIONS = ["Small", "Medium", "Large"];

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}

function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#b0bec5", marginBottom: 4 }}>{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,152,0,0.3)",
          borderRadius: 6,
          color: "white",
          fontSize: 14,
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="">-- Select --</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "#222" }}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumberStepper({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#b0bec5", marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          onClick={() => onChange(Math.max(min, value - 1))}
          style={{
            width: 32,
            height: 32,
            background: "rgba(255,152,0,0.3)",
            border: "1px solid rgba(255,152,0,0.5)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 18,
            fontWeight: 700,
            color: "white",
            userSelect: "none",
          }}
        >
          ▼
        </div>
        <div
          style={{
            width: 48,
            height: 32,
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,152,0,0.3)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 700,
            color: "white",
          }}
        >
          {value}
        </div>
        <div
          onClick={() => onChange(Math.min(max, value + 1))}
          style={{
            width: 32,
            height: 32,
            background: "rgba(255,152,0,0.3)",
            border: "1px solid rgba(255,152,0,0.5)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 18,
            fontWeight: 700,
            color: "white",
            userSelect: "none",
          }}
        >
          ▲
        </div>
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#b0bec5", marginBottom: 4 }}>{label}</div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "8px 12px",
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,152,0,0.3)",
          borderRadius: 6,
          color: "white",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export function MachineSettingsUI() {
  const activeMachine = useGame((s) => s.activeMachine);
  const closeMachineSettings = useGame((s) => s.closeMachineSettings);
  const submitMachineOrder = useGame((s) => s.submitMachineOrder);

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [color3, setColor3] = useState("");
  const [lettering, setLettering] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (activeMachine) {
      setQuantity(1);
      setSize("");
      setColor1("");
      setColor2("");
      setColor3("");
      setLettering("");
      setErrorMessage(null);
    }
  }, [activeMachine]);

  if (!activeMachine) return null;

  const isHat = activeMachine === "hat";
  const isTshirt = activeMachine === "tshirt";
  const isJacket = activeMachine === "jacket";

  const machineName = isHat ? "Hat Maker" : isTshirt ? "T-Shirt Maker" : "Jacket Maker";
  const accentColor = isHat ? "#f44336" : isTshirt ? "#2196f3" : "#4caf50";

  const isFormValid = () => {
    if (quantity < 1) return false;
    if (!size) return false;
    if (!color1 || !color2) return false;
    if (isHat && !lettering) return false;
    if ((isTshirt || isJacket) && (!color3 || !lettering)) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;
    setErrorMessage(null);
    const result = submitMachineOrder(activeMachine, {
      quantity,
      size,
      color1,
      color2,
      color3: color3 || undefined,
      lettering,
    });
    if (result) {
      setErrorMessage(result);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(30, 25, 15, 0.97)",
        borderRadius: 16,
        padding: "24px 32px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 200,
        border: `3px solid ${accentColor}`,
        boxShadow: `0 0 40px ${accentColor}44`,
        width: 420,
        maxHeight: "85vh",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: accentColor }}>
          {machineName} Settings
        </div>
        <div
          onClick={closeMachineSettings}
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 14,
            color: "#999",
          }}
        >
          X
        </div>
      </div>

      <NumberStepper label="Quantity" value={quantity} onChange={setQuantity} min={1} max={20} />

      <Select
        label="Size"
        value={size}
        onChange={setSize}
        options={SIZE_OPTIONS.map((s) => ({ label: s, value: s.toLowerCase() }))}
      />

      {isHat && (
        <>
          <Select label="Top Color" value={color1} onChange={setColor1} options={COLOR_OPTIONS} />
          <Select label="Brim Color" value={color2} onChange={setColor2} options={COLOR_OPTIONS} />
          <TextInput label="Lettering" value={lettering} onChange={setLettering} placeholder="Enter text" />
        </>
      )}

      {isTshirt && (
        <>
          <Select label="Sleeve Color" value={color1} onChange={setColor1} options={COLOR_OPTIONS} />
          <Select label="Body Color" value={color2} onChange={setColor2} options={COLOR_OPTIONS} />
          <Select label="Lettering Color" value={color3} onChange={setColor3} options={COLOR_OPTIONS} />
          <TextInput label="Text on T-Shirt" value={lettering} onChange={setLettering} placeholder="Enter text" />
        </>
      )}

      {isJacket && (
        <>
          <Select label="Sleeve Color" value={color1} onChange={setColor1} options={COLOR_OPTIONS} />
          <Select label="Body Color" value={color2} onChange={setColor2} options={COLOR_OPTIONS} />
          <Select label="Lettering Color" value={color3} onChange={setColor3} options={COLOR_OPTIONS} />
          <TextInput label="Text on Jacket" value={lettering} onChange={setLettering} placeholder="Enter text" />
        </>
      )}

      {errorMessage && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 14px",
            background: "rgba(244, 67, 54, 0.2)",
            border: "1px solid #f44336",
            borderRadius: 8,
            color: "#ff8a80",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {errorMessage}
        </div>
      )}

      <div
        onClick={handleSubmit}
        style={{
          marginTop: 16,
          padding: "12px 24px",
          background: isFormValid() ? accentColor : "rgba(255,255,255,0.1)",
          border: "none",
          borderRadius: 8,
          color: isFormValid() ? "white" : "#666",
          fontSize: 16,
          fontWeight: 700,
          cursor: isFormValid() ? "pointer" : "default",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: 1,
          transition: "all 0.2s",
        }}
      >
        Submit Order
      </div>
    </div>
  );
}
