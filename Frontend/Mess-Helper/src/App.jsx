import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from "./pages/ResetPassword";
import Profile from './pages/user/Profile';
import  MessMenu from './pages/user/MessMenu';
import FeedbackForm from "./pages/user/FeedbackForm";
import NotFound from "./pages/NotFound";
import Homepage from "./pages/HomePage";
import EmployeeProfile from "./pages/admin/EmployeeProfile";
import EmployeeForm from "./pages/admin/EmployeeForm";
import MessMenuEdit from "./pages/admin/MessMenuEdit";
import MessRebate from "./pages/user/MessRebate";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MessInventory from "./pages/admin/MessInventory";
import ExpenditureManagement from "./pages/admin/ExpenditureManagement";
import AdminFeedbackPage from "./pages/admin/AdminFeedbackPage";
import AdminRebateApproval from "./pages/admin/AdminRebateApproval";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path='/*' element={<NotFound/>}  />
      <Route path='/' element={<Homepage/>} />


      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path='/u/profile' element={<Profile />} />
        <Route path="/u/dashboard" element={<Dashboard />} />
        <Route path='/u/menu' element={<MessMenu />} />
        <Route path='/u/feedback' element={<FeedbackForm/>}/>
        <Route path='/u/mess/rebate' element={<MessRebate/>}/>
        {/* Add more protected routes here */}
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/admin/employees" element={<EmployeeProfile />} />
        <Route path="/admin/employees/new" element={<EmployeeForm />} />
        <Route path="/admin/employees/edit/:id" element={<EmployeeForm />} />
        <Route path='/admin/menu/edit' element={<MessMenuEdit/>}/>
        <Route path='/admin/inventory' element={<MessInventory/>}/>
        <Route path='/admin/expenditure' element={<ExpenditureManagement/>}/>
        <Route path='/admin/feedback' element={<AdminFeedbackPage/>}/>
        <Route path='/admin/rebate/approval' element={<AdminRebateApproval/>}/>

      </Route>

      

    </Routes>
  );
}

export default App;
