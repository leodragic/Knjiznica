import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Book {
  id: number;
  title: string;
  author: string;
  averageRating?: number;
  category?: {
    id: number;
    name: string;
  };
}

export default function RecommendedBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await api.get('/books/recommended');
        setBooks(res.data);
      } catch (err) {
        console.error(err);
        setError('Ni priporočil za prikaz');
      }
    };

    fetchRecommended();
  }, []);

  return (
    <div>
      <h2>Priporočamo za vas</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {books.length === 0 && !error && (
        <p>Trenutno ni priporočil.</p>
      )}

      <ul>
        {books.map((book) => (
          <li key={book.id} style={{ marginBottom: 10 }}>
            <strong>{book.title}</strong> – {book.author}
            <br />
            <em>Kategorija: {book.category?.name ?? 'Neznano'}</em>
            <br />
            <small>Povprečna ocena: {book.averageRating ?? 'Ni ocen'}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
