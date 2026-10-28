
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";

import SignupPage from "./components/Auth/Register"
import Login from "./components/Auth/Login"
import NotFoundPage from './components/Reusable/NotFoundPage'
import ProtectedRoute from './components/Reusable/ProtectedRoute'
import PublicRoute from './components/Reusable/PublicRoute'
import Tasks from './components/Tasks'


function App() {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* ======= HEADER ======= */}
      <header className="flex justify-between items-center p-4 border-bshadow-sm">
        <h1 className="text-xl font-semibold text-teal-800">
          Tasks Managment
        </h1>

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-teal-800">
              {user.email || user.name}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        )}
      </header>

      {/* ======= CONTENT ======= */}
      <main className="flex-1">
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignupPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/tasks" element={<Tasks />} />
          </Route>

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;