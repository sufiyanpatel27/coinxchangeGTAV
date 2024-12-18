import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import HomePage from './components/HomePage'
import Funds from './components/Funds'


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/exchange" element={<HomePage />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/signin" element={<PrivateRoute> <SignIn /> </PrivateRoute>} />
          <Route path="/signup" element={<PrivateRoute> <SignUp /> </PrivateRoute>} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}