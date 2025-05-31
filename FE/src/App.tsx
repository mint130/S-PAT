import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import useThemeStore from "./stores/useThemeStore";

import Layout from "./components/Layout/Layout";
import Step0ModeSelect from "./pages/Step0ModeSelect";
import Step1ClassificationSetup from "./pages/Step1ClassificationSetup";
import Step2ClassificationEdit from "./pages/Step2ClassificationEdit";
import Step3PatentClassification from "./pages/Step3PatentClassification";
import Step4PatentResult from "./pages/Step4PatentResult";

import Step4AdminPatentResult from "./pages/Step4AdminPatentResult";
import Step5AdminModelComparison from "./pages/Step5AdminModelComparison";

function App() {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // 초기 다크모드 상태 적용
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Step0ModeSelect />} />

        {/* 사용자 모드 */}
        <Route path="/user" element={<Layout />}>
          <Route path="step1" element={<Step1ClassificationSetup />} />
          <Route path="step2" element={<Step2ClassificationEdit />} />
          <Route path="step3" element={<Step3PatentClassification />} />
          <Route path="step4" element={<Step4PatentResult />} />
          <Route index element={<Step1ClassificationSetup />} />
        </Route>

        {/* 관리자 모드 */}
        <Route path="/admin" element={<Layout />}>
          <Route path="step1" element={<Step1ClassificationSetup />} />
          <Route path="step2" element={<Step2ClassificationEdit />} />
          <Route path="step3" element={<Step3PatentClassification />} />
          <Route path="step4" element={<Step4AdminPatentResult />} />
          <Route path="step5" element={<Step5AdminModelComparison />} />
          <Route index element={<Step1ClassificationSetup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
