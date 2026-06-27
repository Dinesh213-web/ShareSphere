import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import BrowseResources from "./BrowseResources";
import AddResource from "./AddResource";
import BorrowRequests from "./BorrowRequests";
import MyResources from "./MyResources";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/resources" element={<BrowseResources />} />
        <Route path="/add-resource" element={<AddResource />} />
        <Route path="/borrow-requests" element={<BorrowRequests />} />
        <Route path="/my-resources" element={<MyResources />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
