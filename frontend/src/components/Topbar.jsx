import { Menu, ShieldCheck } from "lucide-react";

function Topbar({ setMobileOpen }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800/70 bg-[#020617]/80 px-5 backdrop-blur-xl sm:px-8 lg:ml-72">
      <button
        onClick={() => setMobileOpen(true)}
        className="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 text-slate-300 lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-600">
          Intelligent Healthcare System
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Chronic Kidney Disease analysis platform
        </p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/5 px-4 py-2 text-xs font-semibold text-emerald-400 sm:flex">
          <ShieldCheck size={15} />
          Secure AI Environment
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-sm font-bold text-blue-300">
          AI
        </div>
      </div>
    </header>
  );
}

export default Topbar;
