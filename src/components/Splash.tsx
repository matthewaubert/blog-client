export default function Splash() {
  function scroll() {
    // get window height
    scrollTo({ top: window.innerHeight - 68, behavior: 'smooth' });
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
