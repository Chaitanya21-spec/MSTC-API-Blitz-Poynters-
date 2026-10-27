import { useEffect, useState } from 'react';
import { Search, ArrowUpRight, Palette, Feather, BookOpen, RefreshCw, ExternalLink } from 'lucide-react';

const API = {
  gutenberg: 'https://gutendex.com/books/?page=1',
  art: 'https://api.artic.edu/api/v1/artworks/search?q=landscape&query[term][is_public_domain]=true&limit=6&fields=id,title,artist_display,date_display,image_id,is_public_domain,thumbnail,main_reference_number',
  poetry: 'https://poetrydb.org/random/3'
};
const tabs = [
  { id: 'gutenberg', label: 'Public-domain books', icon: BookOpen, note: 'Read classics from Project Gutenberg.' },
  { id: 'art', label: 'Art & artists', icon: Palette, note: 'A small window into the Art Institute of Chicago.' },
  { id: 'poetry', label: 'Poetry corner', icon: Feather, note: 'Let a poem find you today.' }
];

export default function CultureExplorer() {
  const [active, setActive] = useState('gutenberg');
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setState({ data: null, loading: true, error: '' });
      try {
        let url;
        if (active === 'gutenberg') url = `https://gutendex.com/books/?search=${encodeURIComponent(submitted)}&page=1`;
        if (active === 'art') {
          const term = submitted || 'landscape';
          const params = new URLSearchParams({ q: term, limit: '8', fields: 'id,title,artist_display,date_display,image_id,is_public_domain,thumbnail,main_reference_number' });
          url = `https://api.artic.edu/api/v1/artworks/search?${params.toString()}&query[term][is_public_domain]=true`;
        }
        if (active === 'poetry') url = submitted ? `https://poetrydb.org/title/${encodeURIComponent(submitted)}/author,title,lines` : 'https://poetrydb.org/random/3';
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('This collection is taking a little break. Please try again.');
        const data = await response.json();
        setState({ data, loading: false, error: '' });
      } catch (error) {
        if (error.name !== 'AbortError') setState({ data: null, loading: false, error: error.message || 'Could not load this collection.' });
      }
    }
    load();
    return () => controller.abort();
  }, [active, submitted, refresh]);

  const items = active === 'gutenberg' ? (state.data?.results || []) : active === 'art' ? (state.data?.data || []) : (Array.isArray(state.data) ? state.data : []);
  function search(e) { e.preventDefault(); setSubmitted(query.trim()); }
  function switchTab(id) { setActive(id); setQuery(''); setSubmitted(''); }
  function artImage(item) { return item.image_id ? `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg` : item.thumbnail?.lqip; }
  return <section className="culture-section section-wrap" id="culture">
    <div className="section-heading culture-heading"><div><p className="eyebrow">A CABINET OF CURIOSITIES</p><h2>Beyond the bookshelf.</h2><p className="section-subtitle">Explore open books, paintings, and poems from collections around the world.</p></div><span className="culture-stamp">✳</span></div>
    <div className="culture-tabs" role="tablist" aria-label="Explore collections">{tabs.map(({ id, label, icon: Icon }) => <button key={id} role="tab" aria-selected={active === id} className={active === id ? 'active' : ''} onClick={() => switchTab(id)}><Icon size={16}/>{label}</button>)}</div>
    <div className="culture-intro"><p>{tabs.find(t => t.id === active)?.note}</p><form className="culture-search" onSubmit={search}><Search size={16}/><input aria-label={`Search ${tabs.find(t => t.id === active)?.label}`} placeholder={active === 'gutenberg' ? 'Search books or authors…' : active === 'art' ? 'Search artworks or artists…' : 'Search poem titles…'} value={query} onChange={e => setQuery(e.target.value)}/><button type="submit">Search</button></form></div>
    {state.loading && <div className="culture-status"><span className="loader-dot"/> Gathering something wonderful…</div>}
    {state.error && <div className="culture-status culture-error">{state.error} <button onClick={() => setRefresh(v => v + 1)}>Try again</button></div>}
    {!state.loading && !state.error && items.length === 0 && <div className="culture-status">Nothing surfaced for that search. Try another phrase.</div>}
    {!state.loading && !state.error && active === 'gutenberg' && <div className="culture-grid">{items.slice(0, 8).map(book => { const cover = book.formats?.['image/jpeg']; const author = book.authors?.map(a => a.name).join(', ') || 'Unknown author'; const read = book.formats?.['text/html'] || book.formats?.['application/epub+zip'] || `https://www.gutenberg.org/ebooks/${book.id}`; return <article className="culture-book" key={book.id}><div className="culture-book-cover">{cover ? <img src={cover} alt={`Cover of ${book.title}`} loading="lazy"/> : <span>✳</span>}</div><div className="culture-card-copy"><p className="culture-card-kicker">PROJECT GUTENBERG</p><h3>{book.title}</h3><p>{author}</p><a href={read} target="_blank" rel="noreferrer">Explore book <ArrowUpRight size={14}/></a></div></article>; })}</div>}
    {!state.loading && !state.error && active === 'art' && <div className="art-grid">{items.slice(0, 8).map(art => { const img = artImage(art); return <article className="art-card" key={art.id}><div className="art-card-image">{img ? <img src={img} alt={art.title || 'Artwork'} loading="lazy"/> : <span>Artwork image unavailable</span>}</div><div className="art-card-copy"><h3>{art.title || 'Untitled'}</h3><p>{art.artist_display || 'Artist unknown'}</p><small>{art.date_display || 'Date not recorded'}{art.is_public_domain ? ' · Public domain' : ''}</small><a href={`https://www.artic.edu/artworks/${art.id}`} target="_blank" rel="noreferrer" aria-label={`View ${art.title} at the Art Institute of Chicago`}><ExternalLink size={14}/></a></div></article>; })}</div>}
    {!state.loading && !state.error && active === 'poetry' && <div className="poetry-grid">{items.slice(0, 6).map((poem, i) => <article className="poem-card" key={`${poem.author}-${poem.title}-${i}`}><span className="poem-mark">“</span><h3>{poem.title || 'A poem'}</h3><p className="poem-author">{poem.author || 'Unknown poet'}</p><div className="poem-lines">{(poem.lines || []).slice(0, 8).map((line, j) => <p key={j}>{line || '\u00a0'}</p>)}</div>{poem.lines?.length > 8 && <small>First 8 lines shown</small>}</article>)}</div>}
    <div className="culture-footnote">Sources: <a href="https://gutendex.com/" target="_blank" rel="noreferrer">Gutendex</a> · <a href="https://api.artic.edu/docs/" target="_blank" rel="noreferrer">Art Institute of Chicago</a> · <a href="https://github.com/thundercomb/poetrydb" target="_blank" rel="noreferrer">PoetryDB</a></div>
    {active === 'poetry' && <button className="refresh-poetry" onClick={() => { setSubmitted(''); setQuery(''); setRefresh(v => v + 1); }}><RefreshCw size={14}/> Find another poem</button>}
  </section>;
}
