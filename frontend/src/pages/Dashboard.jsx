import { Link } from "react-router-dom";

import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Database,
  Microscope,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Zap,
} from "lucide-react";

import StatCard from "../components/StatCard";

function Dashboard() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-blue-500/15 bg-gradient-to-br from-blue-950/60 via-slate-950 to-cyan-950/30 p-7 shadow-2xl shadow-blue-950/20 sm:p-10">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-300">
              <Sparkles size={14} />
              Next-generation health intelligence
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Predict.
              <span className="text-blue-400"> Analyze.</span>
              <br />
              Understand CKD.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              CKDPredict combines clinical data preprocessing, SMOTENC
              augmentation and XGBoost machine learning to generate an AI-based
              chronic kidney disease prediction.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/predict"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/30"
              >
                Start AI Prediction
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/model"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-sm font-bold text-slate-300 transition hover:border-blue-500/30 hover:bg-slate-800"
              >
                Explore AI Model
                <BrainCircuit size={17} />
              </Link>
            </div>
          </div>

          <div className="absolute bottom-8 right-10 hidden lg:block">
            <div className="relative flex h-44 w-44 animate-float items-center justify-center rounded-full border border-blue-400/10">
              <div className="absolute inset-4 rounded-full border border-cyan-400/10" />

              <div className="absolute inset-9 rounded-full border border-blue-400/20" />

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-300 shadow-2xl shadow-blue-500/20">
                <Microscope size={38} />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<BrainCircuit size={21} />}
            label="ML Algorithm"
            value="XGBoost"
            description="Gradient boosted trees"
            accent="blue"
          />

          <StatCard
            icon={<Database size={21} />}
            label="Dataset"
            value="400"
            description="Clinical patient records"
            accent="cyan"
          />

          <StatCard
            icon={<Zap size={21} />}
            label="Features"
            value="24"
            description="Clinical parameters"
            accent="violet"
          />

          <StatCard
            icon={<ShieldCheck size={21} />}
            label="Augmentation"
            value="SMOTENC"
            description="Mixed-data balancing"
            accent="emerald"
          />
        </section>

        {/* Feature cards */}
        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <FeatureCard
            icon={<Stethoscope />}
            title="AI Prediction"
            text="Enter clinical parameters and receive a real-time machine learning prediction."
            link="/predict"
          />

          <FeatureCard
            icon={<BarChart3 />}
            title="Model Analytics"
            text="Explore performance metrics, model architecture and training methodology."
            link="/analytics"
          />

          <FeatureCard
            icon={<BrainCircuit />}
            title="Explainable Pipeline"
            text="Understand how preprocessing, augmentation and XGBoost work together."
            link="/model"
          />
        </section>

        {/* Pipeline */}
        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              AI workflow
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              From clinical data to prediction
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            {[
              ["01", "Input", "Clinical parameters"],
              ["02", "Preprocess", "Clean & encode"],
              ["03", "SMOTENC", "Balance training data"],
              ["04", "XGBoost", "Learn patterns"],
              ["05", "Result", "Risk probability"],
            ].map(([number, title, text], index) => (
              <div
                key={title}
                className="relative rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
              >
                <span className="text-xs font-black text-blue-500">
                  {number}
                </span>

                <h3 className="mt-3 font-bold text-white">{title}</h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>

                {index < 4 && (
                  <ArrowRight
                    className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-blue-500 md:block"
                    size={16}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-amber-400" size={19} />

            <p className="text-xs leading-6 text-slate-400">
              <span className="font-bold text-amber-300">
                Research disclaimer:
              </span>{" "}
              CKDPredict is a college machine learning project intended for
              educational and research purposes. Its predictions should not be
              treated as a medical diagnosis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text, link }) {
  return (
    <Link
      to={link}
      className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/25 hover:bg-slate-900"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition group-hover:bg-blue-500/15">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>

      <div className="mt-5 flex items-center gap-2 text-xs font-bold text-blue-400">
        Explore
        <ArrowRight
          size={14}
          className="transition group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

export default Dashboard;
