import { useState } from "react";

import AdminHeader from "./AdminHeader";
import AdminSidebar, {
  type AdminTab,
} from "./AdminSidebar";

interface AdminLayoutProps {
  activeTab: AdminTab;
  onChangeTab: (tab: AdminTab) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const AdminLayout = ({
  activeTab,
  onChangeTab,
  onLogout,
  children,
}: AdminLayoutProps) => {
  const [collapsed, setCollapsed] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const sidebarWidth = collapsed
    ? 92
    : 280;

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <AdminSidebar
        activeTab={activeTab}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onChangeTab={onChangeTab}
        onToggleCollapsed={() =>
          setCollapsed((value) => !value)
        }
        onCloseMobile={() =>
          setMobileOpen(false)
        }
        onLogout={onLogout}
      />

      <div
        className="transition-all duration-300"
        style={{
          marginLeft: collapsed
            ? undefined
            : undefined,
        }}
      >
        <div
          className={`hidden lg:block`}
          style={{
            marginLeft: sidebarWidth,
          }}
        >
          <AdminHeader
            onOpenSidebar={() =>
              setMobileOpen(true)
            }
          />

          <main className="p-8">
            {children}
          </main>
        </div>

        <div className="lg:hidden">
          <AdminHeader
            onOpenSidebar={() =>
              setMobileOpen(true)
            }
          />

          <main className="p-5">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;