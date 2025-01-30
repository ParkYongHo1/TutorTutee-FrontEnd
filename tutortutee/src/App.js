import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./layout/Header";
import Main from "./page/Main";
import Login from "./page/Login";
import Signup from "./page/Signup";
import Profile from "./page/Profile";

const App = () => {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
};

const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  const hideHeader = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}
      <main>{children}</main>
    </>
  );
};

export default App;
