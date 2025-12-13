import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";
import MainPage from "./pages/MainPage";
import LoginOrSignUp from "./pages/LoginOrSignUp.jsx";
import FallbackComponent from "./components/fallbacks/FallbackComponent.jsx";
import NoMatch from "./components/fallbacks/NoMatch.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <ErrorBoundary fallback={<FallbackComponent />}>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LoginOrSignUp />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<MainPage />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
