import { NavLink } from "react-router-dom";

import {
  Activity,
  BarChart3,
  BrainCircuit,
  ChevronRight,
  CircleHelp,
  LayoutDashboard,
  Stethoscope,
  X,
} from "lucide-react";

const links = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/predict",
    label: "AI Prediction",
    icon: Stethoscope,
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    to: "/model",
    label: "AI Model",
    icon: BrainCircuit,
  },
  {
    to: "/about",
    label: "About",
    icon: CircleHelp,
  },
];

function Sidebar({ mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-800/80 bg-[#030b1b]/95 px-5 py-6 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-9 flex items-center justify-between">
          <NavLink
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-600/25">
              <Activity size={23} />
            </div>

            <div>
              <div className="text-lg font-black tracking-tight text-white">
                CKD<span className="text-cyan-400">Predict</span>
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                AI Health Lab
              </div>
            </div>
          </NavLink>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
          Navigation
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-600/15 text-blue-300 ring-1 ring-blue-500/20"
                      : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={19}
                      className={
                        isActive
                          ? "text-cyan-400"
                          : "text-slate-500 group-hover:text-blue-400"
                      }
                    />

                    <span className="flex-1">{link.label}</span>

                    {isActive && (
                      <ChevronRight size={16} className="text-blue-400" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="relative overflow-hidden rounded-2xl border border-blue-500/15 bg-gradient-to-br from-blue-950/70 to-cyan-950/40 p-5">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-cyan-400">
              <BrainCircuit size={20} />
            </div>

            <h3 className="text-sm font-bold text-white">AI Engine Online</h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              XGBoost classification with SMOTENC augmentation.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              System operational
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
