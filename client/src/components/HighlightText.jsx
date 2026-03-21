export default function HighlightText({ text, query }) {
  if (!query || !text) return <>{text}</>;

  const parts = text.toString().split(new RegExp(`(${query})`, 'gi'));

  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-400 text-black font-bold px-0.5 rounded-sm">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
