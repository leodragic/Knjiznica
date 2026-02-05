import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container">
      <h1>📚 Knjižnica</h1>

      <p>
        Dobrodošli v spletni aplikaciji Knjižnica, kjer lahko
        raziskujete knjige, jih ocenjujete in prejemate pametna
        priporočila glede na vaše interese.
      </p>

      <div style={{ marginTop: 20 }}>
        <Link to="/books">
          <button style={{ marginRight: 10 }}>
            Preglej knjige
          </button>
        </Link>

        <Link to="/recommended">
          <button>
            Priporočamo za vas
          </button>
        </Link>
      </div>
    </div>
  );
}
