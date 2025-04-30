import { Routes, Route, BrowserRouter } from "react-router-dom";
import TestPages from "./pages/TestPages";

function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<TestPages />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
