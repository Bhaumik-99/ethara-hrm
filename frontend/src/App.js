import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "sonner";
import DashboardPage from "@/pages/DashboardPage";
import EmployeesPage from "@/pages/EmployeesPage";
import AttendancePage from "@/pages/AttendancePage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FAFAFA]">
        <Sidebar />
        <main className="lg:ml-64 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
            </Routes>
          </div>
        </main>
        <Toaster position="bottom-right" richColors />
      </div>
    </BrowserRouter>
  );
}

export default App;
