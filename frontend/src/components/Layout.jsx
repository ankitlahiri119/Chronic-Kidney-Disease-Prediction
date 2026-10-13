import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <Topbar setMobileOpen={setMobileOpen} />

      <main className="min-h-[calc(100vh-5rem)] lg:ml-72">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
