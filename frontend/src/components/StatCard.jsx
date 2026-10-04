function StatCard({ icon, label, value, description, accent = "blue" }) {
  const accents = {
    blue: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/15",
    cyan: "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/15",
    violet:
      "from-violet-500/20 to-violet-500/5 text-violet-400 border-violet-500/15",
    emerald:
      "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/15",
  };

  return (
    <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:bg-slate-900/80">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-white">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border bg-gradient-to-br ${accents[accent]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
