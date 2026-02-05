import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  averageRating: number;
  category?: {
    id: number;
    name: string;
  };
}

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingValue, setRatingValue] = useState<number>(5);

  const token = localStorage.getItem('token');

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books');
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      setError('Napaka pri nalaganju knjig');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const rateBook = async (bookId: number) => {
    try {
      await api.post('/ratings', {
        bookId,
        rating: ratingValue,
      });
      alert('Ocena uspešno oddana!');
      fetchBooks(); // 🔄 ponovno naloži knjige (posodobljen avg rating)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Napaka pri ocenjevanju');
    }
  };

  if (loading) return <p>Nalaganje...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Seznam knjig</h2>

      {books.map((book) => (
        <div
          key={book.id}
          style={{
            borderBottom: '1px solid #ccc',
            marginBottom: 20,
            paddingBottom: 10,
          }}
        >
          <h3>{book.title}</h3>
          <p>
            <strong>Avtor:</strong> {book.author}
          </p>
          <p>{book.description}</p>
          <p>
            <strong>Kategorija:</strong>{' '}
            {book.category ? book.category.name : '—'}
          </p>
          <p>
            <strong>Povprečna ocena:</strong>{' '}
            {book.averageRating !== undefined
              ? Number(book.averageRating).toFixed(2)
              : 'Ni ocen'}
          </p>

          {/* ⭐ OCENJEVANJE */}
          {token ? (
            <div>
              <label>
                Oceni knjigo:{' '}
                <select
                  value={ratingValue}
                  onChange={(e) => setRatingValue(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>

              <button
                onClick={() => rateBook(book.id)}
                style={{ marginLeft: 10 }}
              >
                Oceni
              </button>
            </div>
          ) : (
            <p style={{ color: 'gray' }}>
              Za ocenjevanje se morate prijaviti.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
