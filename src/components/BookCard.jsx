import { Bookmark, BookOpen, Heart } from 'lucide-react';

const palettes = ['cover-olive', 'cover-rose', 'cover-blue', 'cover-gold', 'cover-plum', 'cover-sage'];
export default function BookCard({ book, saved, onToggle, onSelect, index = 0 }) {
  const title = book.title || 'Untitled';
  const author = book.author_name?.[0] || book.authors?.[0]?.name || 'Unknown author';
  const cover = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null;
  return <article className="book-card group">
    <button className="cover-wrap" onClick={() => onSelect(book)} aria-label={`View ${title}`}>
      {cover ? <img className="book-cover" src={cover} alt={`Cover of ${title}`} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }} /> : null}
      <div className={`cover-placeholder ${palettes[index % palettes.length]}`} style={{ display: cover ? 'none' : 'flex' }}><span className="cover-mark">✳</span><span className="cover-title">{title}</span><span className="cover-author">{author}</span></div>
      <span className="cover-open"><BookOpen size={15} /> Explore book</span>
    </button>
    <div className="book-meta"><div className="min-w-0"><button className="book-title" onClick={() => onSelect(book)}>{title}</button><p className="book-author">{author}</p><p className="book-year">{book.first_publish_year || book.first_publish_date || 'A timeless read'}</p></div>
      <button className={`save-button ${saved ? 'is-saved' : ''}`} onClick={() => onToggle(book)} aria-label={saved ? 'Remove from reading list' : 'Add to reading list'} title={saved ? 'Remove from reading list' : 'Add to reading list'}>{saved ? <Heart size={18} fill="currentColor" /> : <Bookmark size={18} />}</button>
    </div>
  </article>;
}
