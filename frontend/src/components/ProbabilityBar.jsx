function ProbabilityBar({ label, value, type = "blue" }) {
  const styles = {
    blue: "from-blue-500 to-cyan-400",
    green: "from-emerald-500 to-teal-400",
    orange: "from-orange-500 to-amber-400",
  };

  return (
    <div>
      {" "}
      <div className="mb-2 flex items-center justify-between">
        {" "}
        <span className="text-sm font-semibold text-slate-300">{label} </span>
        <span className="text-sm font-black text-white">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${styles[type]} transition-all duration-1000`}
          style={{
            width: `${Math.min(Math.max(Number(value), 0), 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

export default ProbabilityBar;
