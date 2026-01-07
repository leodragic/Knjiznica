import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
