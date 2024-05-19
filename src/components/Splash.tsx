import { useEffect } from 'react';

export default function Splash() {
  // reset height to account for mobile browsers with address bar
  useEffect(() => {
    function resetHeight() {
      document.documentElement.style.setProperty(
        '--viewport-height',
        `${window.innerHeight}px`,
      );
    }

    resetHeight();
    window.addEventListener('resize', resetHeight);

    return () => {
      window.removeEventListener('resize', resetHeight);
    };
  }, []);

  function scroll() {
    scrollTo({ top: window.innerHeight - 67, behavior: 'smooth' });
  }

  return (
    <div className="splash flex flex-col justify-center items-start gap-4 text-blue-950">
      <h2 className="text-7xl sm:text-8xl">Expand your horizons</h2>
      <div className="text-2xl">
        Explore new ideas, share your stories, and connect with a community of
        thinkers.
      </div>
      <button className="form-btn" onClick={scroll}>
        Start reading
      </button>
    </div>
  );
}
