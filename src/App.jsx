import { AuthProvider } from "./contexts/AuthContext";
import { UIProvider } from "./contexts/UIContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App({ children }) {
  return (
    <AuthProvider>
      <UIProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
