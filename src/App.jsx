import { Outlet } from "@tanstack/react-router";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {

  return (
    <AuthProvider>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default App;
