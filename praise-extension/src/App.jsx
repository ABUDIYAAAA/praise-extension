import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/Auth";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <AuthContextProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            {/* Catch-all route for 404s */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthContextProvider>
  );
}

export default App;
