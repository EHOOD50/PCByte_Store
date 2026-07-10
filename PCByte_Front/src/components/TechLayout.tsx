import React from "react";

interface TechLayoutProps {
  children: React.ReactNode;
}

const TechLayout: React.FC<TechLayoutProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 w-full h-full bg-slate-950 flex flex-col font-sans overflow-hidden">

      {/* FONDO GLOBAL UNIFICADO */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/fondo2.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/80"></div>
      </div>

      {/* CONTENIDO */}
      <div className="relative z-10 flex flex-col h-full w-full p-4 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default TechLayout;