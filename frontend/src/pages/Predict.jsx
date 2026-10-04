import { useState } from "react";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import ProbabilityBar from "../components/ProbabilityBar";

const API_URL = import.meta.env.VITE_API_URL;

const numericFields = [
  ["age", "Age", "e.g. 48"],
  ["bp", "Blood Pressure", "e.g. 80"],
  ["sg", "Specific Gravity", "e.g. 1.020"],
  ["al", "Albumin", "e.g. 1"],
  ["su", "Sugar", "e.g. 0"],
  ["bgr", "Blood Glucose Random", "e.g. 120"],
  ["bu", "Blood Urea", "e.g. 40"],
  ["sc", "Serum Creatinine", "e.g. 1.2"],
  ["sod", "Sodium", "e.g. 140"],
  ["pot", "Potassium", "e.g. 4.5"],
  ["hemo", "Hemoglobin", "e.g. 13.5"],
  ["pcv", "Packed Cell Volume", "e.g. 40"],
  ["wc", "White Blood Cell Count", "e.g. 8000"],
  ["rc", "Red Blood Cell Count", "e.g. 5.0"],
];

const categoricalFields = [
  ["rbc", "Red Blood Cells", ["normal", "abnormal"]],
  ["pc", "Pus Cell", ["normal", "abnormal"]],
  ["pcc", "Pus Cell Clumps", ["notpresent", "present"]],
  ["ba", "Bacteria", ["notpresent", "present"]],
  ["htn", "Hypertension", ["no", "yes"]],
  ["dm", "Diabetes Mellitus", ["no", "yes"]],
  ["cad", "Coronary Artery Disease", ["no", "yes"]],
  ["appet", "Appetite", ["good", "poor"]],
  ["pe", "Pedal Edema", ["no", "yes"]],
  ["ane", "Anemia", ["no", "yes"]],
];

const initialForm = {
  age: "",
  bp: "",
  sg: "",
  al: "",
  su: "",
  bgr: "",
  bu: "",
  sc: "",
  sod: "",
  pot: "",
  hemo: "",
  pcv: "",
  wc: "",
  rc: "",
  rbc: "",
  pc: "",
  pcc: "",
  ba: "",
  htn: "",
  dm: "",
  cad: "",
  appet: "",
  pe: "",
  ane: "",
};

function Predict() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const reset = () => {
    setForm(initialForm);
    setResult(null);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {};

      numericFields.forEach(([key]) => {
        payload[key] = form[key] === "" ? null : Number(form[key]);
      });

      categoricalFields.forEach(([key]) => {
        payload[key] = form[key] === "" ? null : form[key];
      });

      const response = await fetch(`${API_URL}/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Could not connect to the prediction server.");
    } finally {
      setLoading(false);
    }
  };

  const positive = result?.prediction === 1;

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {/* Page heading */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            <Activity size={15} />
            AI Prediction Workspace
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Clinical Risk Analysis
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Enter the clinical parameters used by the trained XGBoost model.
            Your data is processed by the local prediction API.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.55fr_0.75fr]">
          {/* Form */}
          <form
            onSubmit={submit}
            className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-7 flex items-center justify-between border-b border-slate-800 pb-5">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Patient Parameters
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  24 features required by the ML pipeline
                </p>
              </div>

              <div className="hidden rounded-xl border border-blue-500/15 bg-blue-500/5 px-4 py-2 text-right sm:block">
                <div className="text-lg font-black text-blue-300">24</div>

                <div className="text-[10px] uppercase tracking-wider text-slate-600">
                  Features
                </div>
              </div>
            </div>

            <div className="mb-8">
              <SectionTitle number="01" title="Laboratory Data" />

              <div className="grid gap-4 sm:grid-cols-2">
                {numericFields.map(([key, label, placeholder]) => (
                  <InputField
                    key={key}
                    name={key}
                    label={label}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-8">
              <SectionTitle number="02" title="Clinical Conditions" />

              <div className="grid gap-4 sm:grid-cols-2">
                {categoricalFields.map(([key, label, options]) => (
                  <SelectField
                    key={key}
                    name={key}
                    label={label}
                    options={options}
                    value={form[key]}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Running AI Analysis...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Generate Prediction
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={reset}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3.5 text-sm font-bold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800"
              >
                <RotateCcw size={17} />
                Reset
              </button>
            </div>
          </form>

          {/* Result */}
          <div className="h-fit xl:sticky xl:top-24">
            <ResultPanel result={result} error={error} positive={positive} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ number, title }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-xs font-black text-blue-400">
        {number}
      </div>

      <h3 className="font-bold text-white">{title}</h3>
    </div>
  );
}

function InputField({ name, label, placeholder, value, onChange }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold text-slate-400"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type="number"
        step="any"
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}

function SelectField({ name, label, options, value, onChange }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold text-slate-400"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        required
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
      >
        <option value="">Select option</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

function ResultPanel({ result, error, positive }) {
  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6">
        <AlertTriangle className="mb-4 text-red-400" size={30} />

        <h3 className="text-lg font-bold text-red-300">Prediction Error</h3>

        <p className="mt-2 text-sm leading-6 text-red-300/70">{error}</p>

        <p className="mt-4 text-xs text-slate-500">
          Check that the Flask backend is running on the configured API URL.
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60">
        <div className="relative flex min-h-[500px] flex-col items-center justify-center p-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />

          <div className="relative mb-7 flex h-28 w-28 items-center justify-center rounded-full border border-blue-500/10 bg-blue-500/5">
            <div className="absolute inset-3 animate-spin-slow rounded-full border border-dashed border-cyan-400/20" />

            <Sparkles size={38} className="text-blue-400" />
          </div>

          <h3 className="relative text-xl font-bold text-white">
            AI Engine Ready
          </h3>

          <p className="relative mt-3 max-w-xs text-sm leading-6 text-slate-500">
            Complete the clinical parameters and run the prediction to generate
            your result.
          </p>

          <div className="relative mt-7 flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/5 px-4 py-2 text-xs font-bold text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            XGBoost engine online
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl">
      <div
        className={`p-6 ${
          positive
            ? "bg-gradient-to-br from-orange-500/10 to-transparent"
            : "bg-gradient-to-br from-emerald-500/10 to-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              AI Assessment
            </p>

            <h3 className="mt-1 text-xl font-black text-white">
              Prediction Result
            </h3>
          </div>

          {positive ? (
            <AlertTriangle size={27} className="text-orange-400" />
          ) : (
            <CheckCircle2 size={27} className="text-emerald-400" />
          )}
        </div>

        <div
          className={`mt-6 rounded-2xl border p-6 ${
            positive
              ? "border-orange-500/20 bg-orange-500/5"
              : "border-emerald-500/20 bg-emerald-500/5"
          }`}
        >
          <p className="text-xs text-slate-500">Predicted classification</p>

          <div
            className={`mt-2 text-4xl font-black ${
              positive ? "text-orange-400" : "text-emerald-400"
            }`}
          >
            {result.result}
          </div>
        </div>

        <div className="mt-7 space-y-6">
          <ProbabilityBar
            label="CKD Probability"
            value={result.ckd_probability}
            type="orange"
          />

          <ProbabilityBar
            label="Not CKD Probability"
            value={result.not_ckd_probability}
            type="green"
          />
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <InfoBox label="Model" value={result.model} />

          <InfoBox label="Augmentation" value="SMOTENC" />
        </div>
      </div>

      <div className="border-t border-slate-800 p-5">
        <div className="flex gap-3">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-blue-400" />

          <p className="text-xs leading-5 text-slate-500">
            This AI prediction is for educational and research purposes only and
            should not be considered a medical diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-200">{value}</p>
    </div>
  );
}

export default Predict;
