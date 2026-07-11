// src/App.jsx
// ... other imports
import BookAppointment from "./pages/BookAppointment";
import DoctorDashboard from "./pages/DoctorDashboard";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/PatientDashboard";
import MyAppointments from "./pages/MyAppointments";
import TrackAppointment from "./pages/TrackAppointment";
import DoctorLayout from "./layout/DoctorLayout";
import LeaveManagement from "./pages/LeavePage";
import ProfilePage from "./pages/ProfilePage";
import UploadPhotoPage from "./pages/UploadPhotoPage";


import "./index.css";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/track/:id" element={<TrackAppointment />} />
          
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="leave" element={<LeaveManagement />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="upload-photo" element={<UploadPhotoPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
