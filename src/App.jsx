import { Outlet } from "@tanstack/react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { UserDetailsProvider } from "./contexts/UserDetailsContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {

  return (
    <AuthProvider>
      <UserDetailsProvider>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </UserDetailsProvider>
    </AuthProvider>
  );
}

export default App;
