import { PrimaryButton, assetUrl } from '../ui.jsx';

/* Intro screen: one strong photo, a clear promise, one button. */
export default function Welcome({ questionCount, onStart }) {
  return (
    <div className="animate-fadeInUp">
      <div className="relative -mx-6 -mt-6 overflow-hidden rounded-t-xl2 sm:-mx-10 sm:-mt-10">
        <img
          src={assetUrl('images/hero.webp')}
          alt="A custom home built by RBA, lit up at dusk"
          className="aspect-[16/10] w-full object-cover [mask-image:linear-gradient(to_bottom,black_45%,transparent)] sm:aspect-[16/8]"
          fetchpriority="high"
        />
      </div>

      <div className="-mt-16 relative text-center sm:-mt-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-ink">
          Instant Estimate
        </p>
        <h1 className="mx-auto mt-3 max-w-lg font-display text-3xl font-bold leading-tight text-ink sm:text-5xl">
          What would your custom home cost?
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ink-muted">
          Answer {questionCount} quick questions and see your estimated build range. It takes
          about a minute.
        </p>

        <PrimaryButton onClick={onStart} className="mt-8 w-full sm:w-auto sm:px-10">
          Get My Estimate
        </PrimaryButton>

        <ul className="mx-auto mt-8 flex max-w-md flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-ink-muted">
          <li>No obligation</li>
          <li>Real RBA projects throughout</li>
          <li>Instant results</li>
        </ul>
      </div>
    </div>
  );
}
