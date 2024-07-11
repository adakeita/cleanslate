import { AuthProvider } from "./contexts/AuthContext";
import { ChoreProvider } from "./contexts/ChoreContext";
import { UserDetailsProvider } from "./contexts/UserDetailsContext";

function App({ children }) {
  return (
    <AuthProvider>
      <UserDetailsProvider>
        <ChoreProvider>{children}</ChoreProvider>
      </UserDetailsProvider>
    </AuthProvider>
  );
}

export default App;
