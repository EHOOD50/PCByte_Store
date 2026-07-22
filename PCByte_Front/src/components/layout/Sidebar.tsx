import React from "react";
import { useMenu } from "../../hooks/useMenu";
import {
  ChevronRight,
  LayoutGrid,
  ShieldCheck,
} from "lucide-react";

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (categoryName: string) => void;
  variant?: "desktop" | "mobile";
}

const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  onSelectCategory,
  variant = "desktop",
}) => {
  const { menuGroups, loading } = useMenu();

  const handleSelect = (category: string) => {
    onSelectCategory(category);
  };

  const asideClassName =
  variant === "desktop"
    ? "hidden h-[calc(100vh-106px)] w-72 shrink-0 self-start flex-col gap-6 lg:sticky lg:top-[106px] lg:flex"
    : "flex h-[calc(100vh-85px)] w-full flex-col gap-6";

  const containerClassName = `
    flex h-full flex-col overflow-y-auto
    border border-white/5
    bg-[#111111]/80
    shadow-2xl
    backdrop-blur-xl
    custom-scrollbar
    ${
      variant === "desktop"
        ? "rounded-[2.5rem] p-8"
        : "rounded-[2rem] p-5"
    }
  `;

  if (loading) {
    return (
      <aside className={asideClassName}>
        <div className={containerClassName}>
          <div className="mb-6 h-4 w-24 rounded-full bg-white/10" />

          <div className="space-y-4">
            <div className="h-12 rounded-2xl bg-white/5" />
            <div className="h-12 rounded-2xl bg-white/5" />
            <div className="h-12 rounded-2xl bg-white/5" />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={asideClassName}>
      <div className={containerClassName}>
        <nav className="flex flex-col gap-8">
          <button
            type="button"
            onClick={() => handleSelect("TODOS")}
            className={`group flex w-full items-center gap-4 rounded-2xl p-4 transition-all duration-500 ${
              activeCategory === "TODOS"
                ? "bg-[#0066FF] text-white shadow-[0_15px_30px_rgba(0,102,255,0.25)]"
                : "bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white"
            }`}
          >
            <LayoutGrid
              size={18}
              className={
                activeCategory === "TODOS"
                  ? "scale-110"
                  : "group-hover:rotate-12"
              }
            />

            <span className="flex-1 text-left text-[11px] font-black uppercase tracking-widest">
              Mostrar todo
            </span>
          </button>

          {menuGroups.map((group) => (
            <div
              key={group.id}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-2 px-1">
                <div
                  className="h-3 w-1 rounded-full"
                  style={{
                    backgroundColor: group.color,
                  }}
                />

                <h3
                  className="text-[10px] font-black uppercase italic tracking-[0.2em] opacity-80"
                  style={{
                    color: group.color,
                  }}
                >
                  {group.title}
                </h3>
              </div>

              <div className="flex flex-col gap-1.5 pl-1">
                {group.cats?.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      handleSelect(category)
                    }
                    className={`group flex items-center justify-between rounded-xl px-4 py-3 text-[10px] font-black uppercase transition-all duration-300 ${
                      activeCategory === category
                        ? "translate-x-2 border-l-2 bg-white/10 text-white"
                        : "text-slate-500 hover:bg-white/5 hover:text-white"
                    }`}
                    style={{
                      borderLeftColor:
                        activeCategory === category
                          ? group.color
                          : "transparent",
                    }}
                  >
                    <span>{category}</span>

                    <ChevronRight
                      size={14}
                      className={`transition-all duration-500 ${
                        activeCategory === category
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                      style={{
                        color: group.color,
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto shrink-0 pt-10">
          <div className="flex flex-col items-center rounded-[2rem] border border-white/5 bg-white/5 p-4">
            <ShieldCheck
              size={20}
              className="mb-2 text-[#97cf00] opacity-50"
            />

            <p className="text-center text-[8px] font-black uppercase tracking-tighter text-slate-500">
              Core_Engine_v1.0
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;