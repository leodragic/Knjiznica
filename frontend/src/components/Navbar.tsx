import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    marginRight: 16,
    fontWeight: 500,
  };

  return (
    <nav
      style={{
        padding: '14px 24px',
        backgroundColor: '#4f46e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <Link to="/" style={linkStyle}>Domov</Link>
        <Link to="/books" style={linkStyle}>Knjige</Link>
        <Link to="/recommended" style={linkStyle}>Priporočamo</Link>
      </div>

      <div>
        {!token ? (
          <>
            <Link to="/login" style={linkStyle}>Prijava</Link>
            <Link to="/register" style={linkStyle}>Registracija</Link>
          </>
        ) : (
          <button
            onClick={logout}
            style={{
              backgroundColor: 'white',
              color: '#4f46e5',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
