import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Search, Sun, Moon, Heart, Menu, X, ArrowRight, Sparkles, Feather, BookMarked, Quote, LibraryBig, Compass, ChevronDown } from 'lucide-react';
import useFetch from './hooks/useFetch';
import BookCard from './components/BookCard';
import WordLookup from './components/WordLookup';
import BookModal from './components/BookModal';
import CultureExplorer from './components/CultureExplorer';

const shelves = [
  { label: 'Fiction', query: 'classic fiction', note: 'Stories that stay with you' },
  { label: 'Poetry', query: 'poetry', note: 'A little music in language' },
  { label: 'Philosophy', query: 'philosophy', note: 'Questions worth sitting with' },
  { label: 'Mystery', query: 'classic mystery', note: 'Follow the thread' },
];
const fallbackBooks = [
  { key: '/works/OL45804W', title: 'Pride and Prejudice', author_name: ['Jane Austen'], first_publish_year: 1813 },
  { key: '/works/OL102749W', title: 'The Picture of Dorian Gray', author_name: ['Oscar Wilde'], first_publish_year: 1890 },
  { key: '/works/OL66554W', title: 'Little Women', author_name: ['Louisa May Alcott'], first_publish_year: 1868 },
  { key: '/works/OL82563W', title: 'Frankenstein', author_name: ['Mary Shelley'], first_publish_year: 1818 },
  { key: '/works/OL15389W', title: 'The Great Gatsby', author_name: ['F. Scott Fitzgerald'], first_publish_year: 1925 },
  { key: '/works/OL262758W', title: 'The Secret Garden', author_name: ['Frances Hodgson Burnett'], first_publish_year: 1911 },
];
const quotes = [
  { text: 'A word after a word after a word is power.', author: 'Margaret Atwood', tag: 'ON WRITING' },
  { text: 'There is no friend as loyal as a book.', author: 'Ernest Hemingway', tag: 'ON READING' },
  { text: 'We read to know we are not alone.', author: 'C. S. Lewis', tag: 'ON CONNECTION' },
];

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('litcanvas-theme') === 'dark');
  const [saved, setSaved] = useState(() => { try { return JSON.parse(localStorage.getItem('litcanvas-reading-list') || '[]'); } catch { return []; } });
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeShelf, setActiveShelf] = useState('For you');
  const [showSaved, setShowSaved] = useState(false);
  const [showLookup, setShowLookup] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const searchUrl = useMemo(() => {
    const term = searchTerm || (activeShelf === 'For you' ? 'classic literature' : shelves.find(s => s.label === activeShelf)?.query || activeShelf);
    return `https://openlibrary.org/search.json?q=${encodeURIComponent(term)}&limit=12&fields=key,title,author_name,cover_i,first_publish_year,subject,edition_count,cover_edition_key`;
  }, [searchTerm, activeShelf]);
  const { data, loading, error } = useFetch(searchUrl, !showSaved);
  const books = showSaved ? saved : (data?.docs?.length ? data.docs : fallbackBooks);
  useEffect(() => { localStorage.setItem('litcanvas-theme', dark ? 'dark' : 'light'); document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);
  useEffect(() => { localStorage.setItem('litcanvas-reading-list', JSON.stringify(saved)); }, [saved]);
  function toggleSaved(book) {
    const id = book.key || book.title;
    setSaved(prev => prev.some(item => (item.key || item.title) === id) ? prev.filter(item => (item.key || item.title) !== id) : [...prev, book]);
  }
  function isSaved(book) { return saved.some(item => (item.key || item.title) === (book.key || book.title)); }
  function doSearch(e) { e.preventDefault(); setSearchTerm(query.trim()); setShowSaved(false); setActiveShelf('For you'); document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' }); }
  function chooseShelf(label) { setActiveShelf(label); setSearchTerm(''); setQuery(''); setShowSaved(false); setMobileMenu(false); document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' }); }
  return <div className={`site-shell ${dark ? 'dark-theme' : ''}`}>
    <header className="site-header"><a href="#home" className="brand" aria-label="LitCanvas home"><span className="brand-icon"><BookOpen size={19}/></span><span>lit<span className="brand-accent">canvas</span><small>READ • WONDER • GROW</small></span></a>
      <nav className={`desktop-nav ${mobileMenu ? 'nav-open' : ''}`}><a href="#discover" onClick={() => setMobileMenu(false)}>Discover</a><a href="#culture" onClick={() => setMobileMenu(false)}>Art & poetry</a><a href="#word-cabinet" onClick={(e) => { e.preventDefault(); setShowLookup(true); setMobileMenu(false); }}>Word cabinet</a><a href="#reading-notes" onClick={() => setMobileMenu(false)}>Reading notes</a></nav>
      <div className="header-actions"><button className="header-icon" onClick={() => setDark(!dark)} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button><button className={`reading-list-button ${showSaved ? 'active' : ''}`} onClick={() => { setShowSaved(!showSaved); setSearchTerm(''); setActiveShelf('For you'); document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' }); }}><Heart size={16}/> <span>My reading list</span><b>{saved.length}</b></button><button className="mobile-menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X size={20}/> : <Menu size={20}/>}</button></div>
    </header>
    <main>
      <section className="hero-section" id="home"><div className="hero-copy"><div className="overline"><span className="overline-line"/> YOUR NEXT CHAPTER STARTS HERE</div><h1>For the love<br/>of <em>getting lost</em><br/>in a good book.</h1><p className="hero-description">A quiet corner for curious minds. Find your next read, fall down a rabbit hole, and collect the words that make you see the world differently.</p><div className="hero-buttons"><a href="#discover" className="primary-button">Find your next read <ArrowRight size={17}/></a><button className="text-button" onClick={() => setShowLookup(true)}>Explore a word <span>↗</span></button></div><div className="reader-note"><div className="reader-avatars"><span>J</span><span>M</span><span>A</span><span>+</span></div><p><strong>A little space to think.</strong><br/>Made for readers, by readers.</p></div></div>
        <div className="hero-art" aria-label="Illustration of a cozy reading nook"><div className="art-sun"/><div className="art-window"><div className="window-pane pane-one"/><div className="window-pane pane-two"/><div className="window-pane pane-three"/><div className="window-pane pane-four"/><div className="window-plant">✳</div></div><div className="art-shelf"><div className="shelf-book b1"/><div className="shelf-book b2"/><div className="shelf-book b3"/><div className="shelf-book b4"/><div className="shelf-book b5"/><div className="shelf-book b6"/><div className="shelf-plants">♧</div></div><div className="reading-chair"><div className="chair-back"/><div className="chair-seat"/><div className="chair-arm"/><div className="chair-leg leg-one"/><div className="chair-leg leg-two"/><div className="chair-pillow"/></div><div className="art-table"><div className="table-top"/><div className="table-leg"/><div className="tea-cup"><span/></div><div className="open-book-art"><span/><span/></div></div><div className="art-plant"><i/><i/><i/><i/><i/><div/></div><div className="floating-note note-one"><Sparkles size={14}/> A slower kind of scroll</div><div className="floating-note note-two"><Feather size={14}/> Stay curious</div></div>
      </section>
      <section className="quick-stats"><div><span className="stat-icon"><Compass size={17}/></span><p><strong>Find your next favorite</strong><small>Thoughtful picks for every mood</small></p></div><div><span className="stat-icon"><BookMarked size={17}/></span><p><strong>Keep what moves you</strong><small>Your personal reading shelf</small></p></div><div><span className="stat-icon"><Sparkles size={17}/></span><p><strong>Stay wonderfully curious</strong><small>New words, ideas, and rabbit holes</small></p></div></section>
      <section className="discover-section section-wrap" id="discover"><div className="section-heading"><div><p className="eyebrow">THE OPEN SHELF</p><h2>{showSaved ? 'Your reading list.' : searchTerm ? 'Your search, your next story.' : 'A world between covers.'}</h2><p className="section-subtitle">{showSaved ? 'All the books you’ve tucked away for later.' : 'A few places to begin. There is no wrong door.'}</p></div><div className="heading-mark">✳</div></div>
        {!showSaved && <form className="book-search" onSubmit={doSearch}><Search size={19}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a title, author, or feeling…" aria-label="Search books"/><button type="submit">Search <ArrowRight size={16}/></button></form>}
        {!showSaved && <div className="shelf-tabs"><button className={activeShelf === 'For you' ? 'selected' : ''} onClick={() => chooseShelf('For you')}>For you</button>{shelves.map(s => <button key={s.label} className={activeShelf === s.label ? 'selected' : ''} onClick={() => chooseShelf(s.label)}>{s.label}</button>)}</div>}
        {!showSaved && activeShelf !== 'For you' && !searchTerm && <p className="shelf-note">{shelves.find(s => s.label === activeShelf)?.note}</p>}
        {loading && !showSaved && <div className="loading-state"><span className="loader-dot"/><span>Turning pages, finding stories…</span></div>}
        {error && !showSaved && <div className="inline-notice">We couldn’t reach the book catalogue just now. Here are a few classics to get you started.</div>}
        {!loading && books.length === 0 && <div className="empty-state"><LibraryBig size={32}/><h3>{showSaved ? 'Your shelf is waiting.' : 'No books found just yet.'}</h3><p>{showSaved ? 'Save a book by tapping the bookmark on any cover you love.' : 'Try a different title, author, or subject.'}</p>{showSaved && <button className="secondary-button" onClick={() => setShowSaved(false)}>Explore books <ArrowRight size={15}/></button>}</div>}
        <div className="book-grid">{books.map((book, i) => <BookCard key={book.key || `${book.title}-${i}`} book={book} index={i} saved={isSaved(book)} onToggle={toggleSaved} onSelect={setSelectedBook}/>)}</div>
        {!showSaved && <div className="catalogue-footer"><span>BOOKS FOR EVERY KIND OF CURIOUS</span><span>Catalogue powered by Open Library ↗</span></div>}
      </section>
      <CultureExplorer />
      <section className="word-section section-wrap" id="word-cabinet"><div className="word-card"><div className="word-card-decoration decoration-left">“</div><div className="word-card-copy"><p className="eyebrow">A LITTLE LEXICAL MAGIC</p><h2>Some words feel<br/>like <em>finding a key.</em></h2><p>Discover the word for a feeling you couldn’t quite name. Collect the beautiful, the curious, and the wonderfully obscure.</p><button className="cream-button" onClick={() => setShowLookup(true)}>Open the word cabinet <ArrowRight size={16}/></button></div><div className="word-card-feature"><span className="feature-label">TODAY’S WORD</span><span className="feature-sparkle">✳</span><h3>petrichor</h3><span className="phonetic">/ˈpɛtrʌɪkɔː/ · noun</span><p>The pleasant, earthy smell after rain falls on dry ground.</p><span className="word-origin">FROM THE GREEK · PETRA + ICHOR</span></div><div className="word-card-decoration decoration-right">✳</div></div></section>
      <section className="quote-section section-wrap" id="reading-notes"><div className="quote-topline"><p className="eyebrow">MARGINS & MUSINGS</p><div className="quote-controls"><button onClick={() => setQuoteIndex((quoteIndex + quotes.length - 1) % quotes.length)} aria-label="Previous quote">←</button><button onClick={() => setQuoteIndex((quoteIndex + 1) % quotes.length)} aria-label="Next quote">→</button></div></div><div className="quote-layout"><div className="quote-symbol"><Quote size={27}/></div><div className="quote-content"><span className="quote-tag">{quotes[quoteIndex].tag}</span><blockquote>“{quotes[quoteIndex].text}”</blockquote><p className="quote-author">— {quotes[quoteIndex].author}</p><div className="quote-dots">{quotes.map((q, i) => <button key={q.author} onClick={() => setQuoteIndex(i)} className={i === quoteIndex ? 'current' : ''} aria-label={`Show quote ${i + 1}`}/>)}</div></div><div className="quote-side-note">A reminder to pause,<br/>turn a page, and<br/><em>stay a little curious.</em></div></div></section>
      <section className="newsletter-section"><div className="newsletter-inner"><span className="newsletter-icon"><Feather size={22}/></span><p className="eyebrow">A NOTE FROM THE MARGINS</p><h2>Make room for wonder.</h2><p>Come as you are. Leave with a new thought, a new word, or a book for your bedside table.</p><button className="primary-button" onClick={() => setShowLookup(true)}>Start exploring <ArrowRight size={16}/></button></div><div className="newsletter-doodle">✳</div></section>
    </main>
    <footer className="site-footer"><a href="#home" className="footer-brand">lit<span>canvas</span></a><p>A quiet corner of the internet for curious readers.</p><div className="footer-links"><a href="#discover">Discover</a><a href="#culture">Art & poetry</a><button onClick={() => setShowLookup(true)}>Word cabinet</button><button onClick={() => setDark(!dark)}>{dark ? 'Light mode' : 'Dark mode'}</button></div><div className="footer-bottom"><span>© 2026 LitCanvas</span><span>Made for the love of words. <span className="footer-star">✳</span></span></div></footer>
    {showLookup && <WordLookup onClose={() => setShowLookup(false)}/>}<BookModal book={selectedBook} saved={selectedBook ? isSaved(selectedBook) : false} onToggle={toggleSaved} onClose={() => setSelectedBook(null)}/>
  </div>;
}
