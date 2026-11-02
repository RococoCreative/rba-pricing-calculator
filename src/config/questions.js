/* ============================================================================
 *  QUESTION FLOW  —  order, wording, and layout of every question
 * ----------------------------------------------------------------------------
 *  Edit this file to reword, reorder, or remove questions. Prices live in
 *  pricingConfig.js; the two lead-qualifier questions at the bottom (lot and
 *  timeline) have no price impact and are defined right here.
 *
 *  Each question:
 *    field     which selection it sets (must match App.jsx state)
 *    type      'single' (one tap, auto-advances) or 'multi' (pick any)
 *    layout    'image' photo cards · 'scale' size cards · 'text' simple cards
 *    columns   cards per row on desktop (mobile is always 1–2)
 * ========================================================================== */

import {
  styleOptions,
  sizeOptions,
  finishOptions,
  addOnOptions,
  locationOptions,
} from './pricingConfig.js';

/* ---- Lead qualifiers (no price impact, high value for sales follow-up) ---- */
export const lotStatus = {
  own:       { label: 'I own a lot',        description: 'Ready to build on it' },
  knockdown: { label: 'Knockdown & rebuild', description: 'Replacing my current home' },
  searching: { label: 'Looking for land',   description: 'Still searching for the right lot' },
  exploring: { label: 'Just exploring',     description: 'Early days, gathering ideas' },
};

export const timeline = {
  soon:    { label: 'Within 6 months', description: 'Ready to get started' },
  year:    { label: '6–12 months',     description: 'Planning for next year' },
  later:   { label: '12+ months',      description: 'Thinking ahead' },
  unsure:  { label: 'Not sure yet',    description: 'Depends on the numbers' },
};

const toOptions = (obj) =>
  Object.entries(obj).map(([key, value]) => ({ key, ...value }));

export const questions = [
  {
    field: 'style',
    type: 'single',
    layout: 'image',
    columns: 2,
    eyebrow: 'Your Style',
    title: 'Which home feels like yours?',
    subtitle: 'Every photo is a home RBA built.',
    options: styleOptions,
  },
  {
    field: 'size',
    type: 'single',
    layout: 'scale',
    columns: 4,
    eyebrow: 'Size',
    title: 'How much room do you need?',
    subtitle: 'A rough feel is all we need.',
    options: sizeOptions,
  },
  {
    field: 'finish',
    type: 'single',
    layout: 'image',
    columns: 3,
    eyebrow: 'Finish Level',
    title: 'How should it feel inside?',
    subtitle: 'This sets the character of every room.',
    options: finishOptions,
  },
  {
    field: 'addOns',
    type: 'multi',
    layout: 'image',
    columns: 4,
    compact: true,
    eyebrow: 'Must-Haves',
    title: 'What would make it unforgettable?',
    subtitle: 'Pick as many as you like, or skip.',
    options: addOnOptions,
  },
  {
    field: 'location',
    type: 'single',
    layout: 'text',
    columns: 3,
    eyebrow: 'Location',
    title: 'Where are you building?',
    subtitle: 'Costs vary by region.',
    options: locationOptions,
  },
  {
    field: 'lot',
    type: 'single',
    layout: 'text',
    columns: 2,
    eyebrow: 'Your Lot',
    title: 'Where are you with land?',
    options: toOptions(lotStatus),
  },
  {
    field: 'timeline',
    type: 'single',
    layout: 'text',
    columns: 2,
    eyebrow: 'Timing',
    title: 'When would you like to break ground?',
    options: toOptions(timeline),
  },
];
