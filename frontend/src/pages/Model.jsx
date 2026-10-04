import {
  BrainCircuit,
  Check,
  GitBranch,
  Layers3,
  Settings2,
  Sparkles,
} from "lucide-react";

function Model() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            Artificial Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
            Inside the AI Engine
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Understand how the CKD prediction model transforms raw clinical
            information into a classification.
          </p>
        </div>

        {/* Model hero */}
        <section className="relative overflow-hidden rounded-3xl border border-blue-500/15 bg-gradient-to-br from-blue-950/50 to-slate-950 p-7 sm:p-10">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <BrainCircuit size={29} />
              </div>

              <h2 className="text-3xl font-black text-white">
                XGBoost Classifier
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
                XGBoost is a gradient boosting algorithm based on decision
                trees. Multiple weak learners are built sequentially, with each
                stage improving the errors made by previous stages.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Tag text="Gradient Boosting" />
                <Tag text="Decision Trees" />
                <Tag text="Binary Classification" />
                <Tag text="Tabular ML" />
              </div>
            </div>

            <div className="rounded-3xl border border-blue-500/10 bg-slate-950/70 p-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Model Configuration
                </span>

                <Settings2 size={17} className="text-blue-400" />
              </div>

              <Config name="Estimators" value="300" />

              <Config name="Max Depth" value="4" />

              <Config name="Learning Rate" value="0.05" />

              <Config name="Subsample" value="0.8" />

              <Config name="Random State" value="42" />
            </div>
          </div>
        </section>

        {/* Pipeline */}
        <section className="mt-7 rounded-3xl border border-slate-800 bg-slate-900/60 p-7">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white">Training Pipeline</h2>

            <p className="mt-2 text-sm text-slate-500">
              The model follows a leakage-safe training workflow.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            <Pipeline
              icon={<Layers3 />}
              number="01"
              title="Raw Data"
              text="Clinical CKD dataset"
            />

            <Pipeline
              icon={<Settings2 />}
              number="02"
              title="Preprocess"
              text="Impute and encode"
            />

            <Pipeline
              icon={<Sparkles />}
              number="03"
              title="SMOTENC"
              text="Augment training data"
            />

            <Pipeline
              icon={<GitBranch />}
              number="04"
              title="XGBoost"
              text="Train classifier"
            />

            <Pipeline
              icon={<Check />}
              number="05"
              title="Evaluate"
              text="Test on untouched data"
            />
          </div>
        </section>

        {/* Why SMOTENC */}
        <section className="mt-7 grid gap-6 lg:grid-cols-2">
          <InfoSection
            title="Why SMOTENC?"
            text="The dataset contains both numerical and categorical clinical features. SMOTENC is specifically designed to generate synthetic minority samples while handling categorical variables appropriately."
            points={[
              "Handles mixed feature types",
              "Reduces class imbalance",
              "Applied only to training data",
              "Helps avoid test-data leakage",
            ]}
          />

          <InfoSection
            title="Why XGBoost?"
            text="XGBoost is particularly effective for structured tabular datasets. It can model nonlinear relationships and feature interactions while providing strong classification performance."
            points={[
              "Excellent for tabular data",
              "Captures nonlinear relationships",
              "Efficient gradient boosting",
              "Probability-based predictions",
            ]}
          />
        </section>
      </div>
    </div>
  );
}

function Tag({ text }) {
  return (
    <span className="rounded-full border border-blue-500/15 bg-blue-500/5 px-3 py-1.5 text-xs font-semibold text-blue-300">
      {text}
    </span>
  );
}

function Config({ name, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 py-3 last:border-0">
      <span className="text-xs text-slate-500">{name}</span>

      <span className="font-mono text-xs font-bold text-cyan-400">{value}</span>
    </div>
  );
}

function Pipeline({ icon, number, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-blue-500">{number}</span>

        <span className="text-blue-400">{icon}</span>
      </div>

      <h3 className="mt-5 font-bold text-white">{title}</h3>

      <p className="mt-1 text-xs text-slate-600">{text}</p>
    </div>
  );
}

function InfoSection({ title, text, points }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7">
      <h2 className="text-xl font-bold text-white">{title}</h2>

      <p className="mt-3 text-sm leading-7 text-slate-500">{text}</p>

      <div className="mt-6 space-y-3">
        {points.map((point) => (
          <div
            key={point}
            className="flex items-center gap-3 text-sm text-slate-300"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <Check size={14} />
            </span>

            {point}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Model;
