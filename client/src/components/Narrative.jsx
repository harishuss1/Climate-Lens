import { useInView } from 'react-intersection-observer';
import '../App.css';

export default function Narrative({ title, text }) {
  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.6, 
  });

  return (
    <div
      ref={ref}
      className={`narrative-container ${inView ? 'visible' : ''}`}
    >
      <h2 className="narrative-title">{title}</h2>
      <p className="narrative-text">{text}</p>
    </div>
  );
}
