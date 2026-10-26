import {
  Code2,
  Database,
  HeartPulse,
  Layers3,
  Server,
  Cloud,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

function About() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

      <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            Project Information
          </p>

          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
            About CKDPredict
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            A full-stack machine-learning project exploring how clinical tabular
            data can be processed to generate a chronic kidney disease
            classification.
          </p>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-blue-500/15 bg-gradient-to-br from-blue-950/40 via-slate-950 to-cyan-950/20 p-7 sm:p-10">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <HeartPulse size={31} />
            </div>

            <h2 className="mt-7 text-2xl font-black text-white">
              Chronic Kidney Disease Prediction
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
              CKDPredict is an academic demonstration of a machine-learning
              application. It accepts clinical parameters through a React
              interface, sends them to a Flask API, and uses a saved
              preprocessing and classification pipeline to return a prediction.
              The purpose is to demonstrate the complete workflow from user
              input to model output.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Tag>Machine Learning</Tag>
              <Tag>Clinical Data</Tag>
              <Tag>Full-Stack Development</Tag>
              <Tag>Academic Project</Tag>
            </div>
          </div>
        </section>

        <section className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <Tech icon={<Code2 />} title="Frontend" value="React + Vite" />

          <Tech icon={<Server />} title="Backend" value="Flask REST API" />

          <Tech
            icon={<Layers3 />}
            title="ML Pipeline"
            value="Trained classifier"
          />

          <Tech icon={<Database />} title="Data" value="Clinical CKD data" />

          <Tech icon={<Layers3 />} title="ML" value="XGBoost" />
        </section>

        <section className="mt-7 rounded-3xl border border-slate-800 bg-slate-900/60 p-7">
          <div className="flex items-center gap-3">
            <Cloud className="text-cyan-400" size={23} />

            <h2 className="text-xl font-bold text-white">
              Application Architecture
            </h2>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            The frontend and backend are deployed separately and communicate
            over HTTP through the prediction API.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ArchitectureCard
              number="01"
              title="User Interface"
              platform="Vercel"
              description="Collects clinical inputs and displays API results."
            />

            <ArchitectureCard
              number="02"
              title="REST API"
              platform="Render"
              description="Receives requests and runs the saved ML pipeline."
            />

            <ArchitectureCard
              number="03"
              title="Model Pipeline"
              platform="Python"
              description="Processes features and returns the classification."
            />
          </div>
        </section>

        <section className="mt-7 rounded-3xl border border-slate-800 bg-slate-900/60 p-7">
          <h2 className="text-xl font-bold text-white">Technology Stack</h2>

          <p className="mt-2 text-sm text-slate-500">
            Technologies used in the application's frontend, backend and
            machine-learning workflow.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "React",
              "Vite",
              "Tailwind CSS",
              "React Router",
              "Lucide Icons",
              "Python",
              "Flask",
              "Pandas",
              "Scikit-learn",
              "XGBoost",
              "Joblib",
            ].map((tech) => (
              <div
                key={tech}
                className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-slate-300"
              >
                {tech}
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-600">
            Add XGBoost and imbalanced-learn to this list if your actual
            training code uses them.
          </p>
        </section>

        <section className="mt-7 rounded-3xl border border-amber-500/15 bg-amber-500/5 p-7">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-amber-400" size={22} />

            <h2 className="text-lg font-bold text-amber-300">
              Educational Disclaimer
            </h2>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            CKDPredict is a college machine-learning project intended for
            educational and research purposes. Its predictions are generated by
            a statistical model and must not be used to diagnose, treat or rule
            out kidney disease. Consult a qualified healthcare professional for
            medical assessment and decisions.
          </p>
        </section>

        <div className="mt-8 flex flex-col items-center justify-center gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <GraduationCap size={15} />
            <span>Academic Machine Learning Project</span>
          </div>

          <div className="flex items-center gap-2">
            <Code2 size={14} />
            <span>CKDPredict AI Health Lab</span>
          </div>

          <p className="mt-2 text-center">
            © {new Date().getFullYear()} CKDPredict. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-full border border-blue-500/15 bg-blue-500/5 px-3 py-1.5 text-xs font-semibold text-blue-300">
      {children}
    </span>
  );
}

function Tech({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="mb-5 text-blue-400">{icon}</div>

      <p className="text-xs text-slate-500">{title}</p>

      <p className="mt-1 font-bold text-white">{value}</p>
    </div>
  );
}

function ArchitectureCard({ number, title, platform, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
      <span className="text-xs font-black text-blue-400">{number}</span>

      <h3 className="mt-4 font-bold text-white">{title}</h3>

      <p className="mt-1 text-xs font-semibold text-cyan-400">{platform}</p>

      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export default About;
