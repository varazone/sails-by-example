import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Counter from "./pages/Counter";
import DNS from "./pages/DNS";
import LuckyDraw from "./pages/LuckyDraw";
import Chat from "./pages/Chat";
import Debug from "./pages/Debug";
import StickyNavbar from "./components/StickyNavbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { useState } from "react";
import withProviders from "./withProviders";
import "./App.css";

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="p-4 h-16 sticky navbar top-0 z-50 glass">
        <StickyNavbar toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </nav>

      <main className="grow -mt-16 pt-16 shadow-none flex flex-col items-center justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/counter" element={<Counter />} />
          <Route path="/dns" element={<DNS />} />
          <Route path="/lucky-draw" element={<LuckyDraw />} />
          <Route path="/debug" element={<Debug />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

const App = withProviders(AppContent);

export default App;
