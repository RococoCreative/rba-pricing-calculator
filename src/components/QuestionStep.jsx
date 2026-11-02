import { Eyebrow, StepHeading, ImageOption, ScaleOption, TextOption } from './ui.jsx';

/* Grid + photo shape per layout/column count. Class names are written out in
 * full so Tailwind can see them. */
const LAYOUTS = {
  'image-2': { grid: 'grid-cols-2 gap-3 sm:gap-4', aspect: 'aspect-[4/3]' },
  'image-3': { grid: 'grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4', aspect: 'aspect-[16/9] sm:aspect-[3/4]' },
  'image-4': { grid: 'grid-cols-2 gap-3 sm:grid-cols-4', aspect: 'aspect-[4/3] sm:aspect-square' },
  'scale-4': { grid: 'grid-cols-2 gap-3 sm:grid-cols-4' },
  'text-2': { grid: 'grid-cols-1 gap-3 sm:grid-cols-2' },
  'text-3': { grid: 'grid-cols-1 gap-3 sm:grid-cols-3' },
};

/**
 * Renders one question from src/config/questions.js.
 * `value` is the current answer (a key, or an array of keys for 'multi').
 * `onAnswer(key)` is called on every tap; App decides what happens next.
 */
export default function QuestionStep({ question, value, onAnswer }) {
  const { layout, columns, type, options, eyebrow, title, subtitle, compact } = question;
  const { grid, aspect } = LAYOUTS[`${layout}-${columns}`] ?? LAYOUTS['text-2'];
  const isSelected = (key) => (type === 'multi' ? value.includes(key) : value === key);

  return (
    <div className="animate-fadeInUp">
      <Eyebrow>{eyebrow}</Eyebrow>
      <StepHeading title={title} subtitle={subtitle} />

      <div className={`grid ${grid}`} role={type === 'multi' ? 'group' : 'radiogroup'} aria-label={title}>
        {options.map((opt, i) => {
          const props = {
            option: opt,
            selected: isSelected(opt.key),
            onSelect: () => onAnswer(opt.key),
          };
          if (layout === 'image')
            return (
              <ImageOption
                key={opt.key}
                {...props}
                aspectClass={aspect}
                compact={compact}
                tightMobile={columns === 2}
              />
            );
          if (layout === 'scale') return <ScaleOption key={opt.key} {...props} level={i} />;
          return <TextOption key={opt.key} {...props} />;
        })}
      </div>
    </div>
  );
}
