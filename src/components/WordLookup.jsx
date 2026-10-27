import { useState } from 'react';
import { BookMarked, Search, X, Volume2, LoaderCircle } from 'lucide-react';

export default function WordLookup({ onClose }) {
  const [word, setWord] = useState('sonder');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  async function lookup(value = word) {
    const clean = value.trim().toLowerCase(); if (!clean) return;
    setWord(clean); setLoading(true); setError(''); setResult(null);
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(clean)}`);
      if (!response.ok) throw new Error('We couldn’t find that word. Try another one.');
      const data = await response.json(); setResult(data[0]);
    } catch (e) { setError(e.message || 'Could not reach the dictionary right now.'); }
    finally { setLoading(false); }
  }
  const meaning = result?.meanings?.[0];
  const definition = meaning?.definitions?.[0];
  const audio = result?.phonetics?.find((p) => p.audio)?.audio;
  return <div className="lookup-backdrop" onClick={onClose}><section className="lookup-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Word explorer">
    <div className="lookup-top"><div className="lookup-icon"><BookMarked size={19} /></div><div><p className="eyebrow">THE WORD CABINET</p><h2>Discover a word.</h2></div><button className="icon-button ml-auto" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
    <form className="lookup-form" onSubmit={(e) => { e.preventDefault(); lookup(); }}><Search size={18} /><input value={word} onChange={(e) => setWord(e.target.value)} placeholder="Try a word…" aria-label="Word to define" /><button type="submit" disabled={loading}>{loading ? <LoaderCircle className="spin" size={18} /> : 'Define'}</button></form>
    {loading && <div className="lookup-empty">Looking for the right words…</div>}
    {error && <div className="error-box">{error}</div>}
    {result && !loading && <div className="definition"><div className="word-heading"><h3>{result.word}</h3>{result.phonetic && <span>{result.phonetic}</span>}{audio && <button className="audio-button" onClick={() => new Audio(audio).play()} aria-label="Play pronunciation"><Volume2 size={17}/></button>}</div><span className="part-of-speech">{meaning?.partOfSpeech || 'Meaning'}</span><p className="definition-text">{definition?.definition || 'A definition was not provided.'}</p>{definition?.example && <blockquote>“{definition.example}”</blockquote>}{meaning?.synonyms?.length > 0 && <div className="synonyms"><span>Related words</span>{meaning.synonyms.slice(0, 5).map((s) => <button key={s} onClick={() => lookup(s)}>{s}</button>)}</div>}<p className="source-note">Definitions from the Free Dictionary API.</p></div>}
    {!result && !loading && !error && <div className="lookup-empty">A small word can open a very large world. Search for a word to begin.</div>}
    <div className="lookup-suggestions"><span>Try exploring</span>{['petrichor', 'ephemeral', 'luminous'].map((w) => <button key={w} onClick={() => lookup(w)}>{w}</button>)}</div>
  </section></div>;
}
