export default function Narrative({ title, text }) {
  return (
    <div className="narrative-container">
      <h2 className="narrative-title">{title}</h2>
      <p className="narrative-text">{text}</p>
    </div>
  );
}
  