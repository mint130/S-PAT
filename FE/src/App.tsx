import { Routes, Route, BrowserRouter } from "react-router-dom";
import TestPages from "./pages/TestPages";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path="/test" element={<TestPages />} />
          </Routes>
        </BrowserRouter>
      </Layout>
    </>
  );
}

export default App;
