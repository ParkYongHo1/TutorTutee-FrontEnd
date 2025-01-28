import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./page/Main";
import Login from "./page/Login";
import SignUp from "./page/Signup";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
