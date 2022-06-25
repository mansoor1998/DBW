import './App.css';
import 'antd/dist/antd.min.css';
import SignIn from './components/SignIn';
import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MyFiles from './components/MyFiles';
import ProtectedRoute from './components/ProtectedRoute';
import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';
function App() {
  const user = useSelector((state)=> state.userReducer)
  console.log(user);
  return (
    <div>
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/" element={<Home />} />
      <Route path="/register"  element={<Register />}/>
    </Routes>
    </div>
  );
}

export default App;
