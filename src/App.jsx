import { Outlet } from "@tanstack/react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { UIProvider } from "./contexts/UIContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
