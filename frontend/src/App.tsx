import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Navbar from './components/Navbar';
import BooksList from './books/BooksList';
import RecommendedBooks from './books/RecommendedBooks';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books" element={<BooksList />} />
        <Route path="/recommended" element={<RecommendedBooks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
