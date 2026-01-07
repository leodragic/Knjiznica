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

  useEffect(() => {
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

    fetchBooks();
  }, []);

  if (loading) return <p>Nalaganje...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Seznam knjig</h2>

      {books.map((book) => (
        <div key={book.id} style={{ borderBottom: '1px solid #ccc', marginBottom: 10 }}>
          <h3>{book.title}</h3>
          <p><strong>Avtor:</strong> {book.author}</p>
          <p>{book.description}</p>
          <p>
            <strong>Kategorija:</strong>{' '}
            {book.category ? book.category.name : '—'}
          </p>
          <p>
            <strong>Povprečna ocena:</strong>{' '}
            {book.averageRating ?? 'Ni ocen'}
          </p>
        </div>
      ))}
    </div>
  );
}
