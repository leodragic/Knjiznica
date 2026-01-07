import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: 10 }}>Domov</Link>
      <Link to="/books" style={{ marginRight: 10 }}>Knjige</Link>
      <Link to="/recommended" style={{ marginRight: 10 }}>Priporočamo</Link>

      {!token ? (
        <>
          <Link to="/login" style={{ marginRight: 10 }}>Prijava</Link>
          <Link to="/register">Registracija</Link>
        </>
      ) : (
        <button onClick={logout} style={{ marginLeft: 10 }}>
          Logout
        </button>
      )}
    </nav>
  );
}
