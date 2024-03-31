import { AuthProvider } from "./contexts/AuthContext";
import { UIProvider } from "./contexts/UIContext";
import { ChoreProvider } from "./contexts/ChoreContext";
import { UserDetailsProvider } from "./contexts/UserDetailsContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App({ children }) {
  return (
    <AuthProvider>
      <UserDetailsProvider>
        <ChoreProvider>
          <UIProvider>
            <Navbar />
            <main className="page-container">{children}</main>
            <Footer />
          </UIProvider>
        </ChoreProvider>
      </UserDetailsProvider>
    </AuthProvider>
  );
}

export default App;
