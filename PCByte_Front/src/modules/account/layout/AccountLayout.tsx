import { Outlet } from "react-router-dom";

import AccountSidebar from "../components/AccountSidebar";

const AccountLayout = () => {
  return (
    <main className="min-h-screen w-full bg-slate-100 text-slate-900">
      <div className="mx-auto grid w-full max-w-[1500px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-8">

        <AccountSidebar />

        <section className="min-w-0">
          <Outlet />
        </section>

      </div>
    </main>
  );
};

export default AccountLayout;