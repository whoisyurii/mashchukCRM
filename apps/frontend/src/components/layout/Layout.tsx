import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen max-h-screen overflow-hidden bg-dark-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 p-6 overflow-auto min-h-0 bg-gradient-to-b from-dark-900 to-emerald-600 ">
          {children}
        </main>
      </div>
    </div>
  );
};
