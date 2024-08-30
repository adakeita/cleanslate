import { AuthProvider } from "./contexts/AuthContext";
import { ChoreProvider } from "./contexts/ChoreContext";
import { UserDetailsProvider } from "./contexts/UserDetailsContext";
import PropTypes from "prop-types";

function App({ children }) {
  console.log("App component rendered");
  return (
    <AuthProvider>
      <UserDetailsProvider>
        <ChoreProvider>{children}</ChoreProvider>
      </UserDetailsProvider>
    </AuthProvider>
  );
}

export default App;
App.propTypes = {
  children: PropTypes.node.isRequired,
};
