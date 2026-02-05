import { useEffect, useState } from 'react';
import api from '../api/axios';
import { AxiosError } from 'axios';

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
  const [ratings, setRatings] = useState<Record<number, number>>({});

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
        rating: ratings[bookId] ?? 5,
      });
      alert('Ocena uspešno oddana!');
      fetchBooks();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      alert(error.response?.data?.message || 'Napaka pri ocenjevanju');
    }

  };

  if (loading) return <p>Nalaganje...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container">
      <h2>Seznam knjig</h2>

      {books.map((book) => (
        <div key={book.id} className="card">
          <h3>
            {book.title}
            {book.category && (
              <span className="badge">{book.category.name}</span>
            )}
          </h3>

          <p>
            <strong>Avtor:</strong> {book.author}
          </p>
          <p>{book.description}</p>

          <p className="rating">
            Povprečna ocena:{' '}
            {book.averageRating !== undefined
              ? Number(book.averageRating).toFixed(2)
              : 'Ni ocen'}
          </p>

          {token ? (
            <div className="actions">
              <select
                value={ratings[book.id] ?? 5}
                onChange={(e) =>
                  setRatings({
                    ...ratings,
                    [book.id]: Number(e.target.value),
                  })
                }
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <button onClick={() => rateBook(book.id)}>
                Oceni
              </button>
            </div>
          ) : (
            <p className="info">
              Za ocenjevanje se morate prijaviti.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
