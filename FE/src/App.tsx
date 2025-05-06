import { Routes, Route, BrowserRouter } from "react-router-dom";
import TestPages from "./pages/TestPages";
import Layout from "./components/Layout/Layout";

import Step1ClassificationSetup from "./pages/Step1ClassificationSetup";
import Step3PatentClassification from "./pages/Step3PatentClassification";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/test" element={<TestPages />} />

          {/* 사용자 모드 */}
          <Route path="/user">
            <Route path="step1" element={<Step1ClassificationSetup />} />
            <Route path="step3" element={<Step3PatentClassification />} />
            <Route index element={<Step1ClassificationSetup />} />
          </Route>

          {/* 관리자 모드 */}
          <Route path="/admin">
            <Route path="step1" element={<Step1ClassificationSetup />} />
            <Route index element={<Step1ClassificationSetup />} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
