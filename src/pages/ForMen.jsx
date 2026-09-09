import TrackPage, { ICONS } from '../components/sections/TrackPage'

/* ══════════════════════════════════════
   Demo images — swap these for the final
   photography; nothing else needs to change.
══════════════════════════════════════ */
import heroImg from '../assets/for-men-hero.webp'
import highlightImg from '../assets/for-men-mid.webp'
import beardImg from '../assets/Beard Trimming.webp'
import neurotoxinImg from '../assets/upper-face neurotoxin-for-men.webp'
import skinBoosterImg from '../assets/skin-booster-for-men.webp'

const MEN = {
  hero: {
    badge: 'For Men',
    title: 'For',
    titleAccent: 'Men.',
    paragraphs: [
      'Al Nojoom Club gives men access to curated aesthetic treatments designed to enhance their natural appearance, confidence, and overall well-being.',
    ],
    joinLabel: 'Join the club',
    consultLabel: 'Contact Us',
    priceKey: 'man',
    image: heroImg,
    imageAlt: 'Aesthetic care for men at Al Nojoom Club',
  },

  treatments: {
    eyebrow: 'Featured treatments',
    title: 'Designed for',
    titleAccent: 'him',
    desc: 'Discover selected treatments designed to support your skin quality, appearance, and aesthetic goals.',
    items: [
      {
        name: 'Beard Trimming',
        tag: 'Laser Treatments',
        image: beardImg,
        paragraphs: [
          'A cutting-edge, non-invasive laser solution for long-term beard shaping and grooming.',
        ],
      },
      {
        name: 'Upper Face Neurotoxin',
        tag: 'Wrinkle & Expression Management',
        image: neurotoxinImg,
        paragraphs: [
          'An aesthetic treatment designed to soften the appearance of selected expression lines and create a more refreshed and relaxed-looking appearance.',
        ],
      },
      {
        name: 'Skin Booster',
        tag: 'Skin Hydration & Boosters',
        image: skinBoosterImg,
        paragraphs: [
          'Give your skin a boost of hydration and radiance with targeted skin booster treatments designed to improve the appearance and quality of the skin.',
        ],
      },
    ],
  },

  highlight: {
    eyebrow: 'Why membership',
    title: 'Because Great Results Start With',
    titleAccent: 'Consistency',
    image: highlightImg,
    imageAlt: 'Beard trimming service',
    paragraphs: [
      'A single treatment can make a difference. Maintaining your skin and appearance requires a more consistent approach.',
      'With Al Nojoom Club, you can:',
    ],
    bullets: [
      'Make professional aesthetic care part of your routine',
      'Stay consistent with your aesthetic goals',
      'Access selected treatments through your membership',
      'Plan your beauty journey more easily',
      'Receive ongoing professional care',
      'Invest in yourself throughout the year',
    ],
    closing: 'Your skin deserves consistency.',
  },

  cards: {
    eyebrow: 'Our philosophy',
    title: 'Enhance. Maintain.',
    titleAccent: 'Care.',
    items: [
      {
        title: 'Enhance',
        desc: 'Highlight your natural features with thoughtful and balanced aesthetic care.',
        icon: ICONS.spark,
      },
      {
        title: 'Maintain',
        desc: 'Support your skin and appearance through consistent professional care.',
        icon: ICONS.clock,
      },
      {
        title: 'Care',
        desc: 'Create a personalized experience where your needs, comfort, and goals come first.',
        icon: ICONS.heart,
      },
    ],
  },

  steps: {
    eyebrow: 'How it works',
    title: 'Your Beauty Journey in 4',
    titleAccent: 'Simple Steps',
    items: [
      { num: '01', title: 'Choose Your Membership', desc: 'Select the membership that matches your needs.' },
      { num: '02', title: 'Join the Club', desc: 'Complete your membership and become part of our exclusive community.' },
      { num: '03', title: 'Start Your Treatments', desc: 'Book your eligible treatments and begin your personalized journey.' },
      { num: '04', title: 'Stay Consistent', desc: 'Continue your professional aesthetic care throughout your membership period.' },
    ],
  },

  cta: {
    eyebrow: 'Become a member',
    title: 'Better care. Better consistency.',
    titleAccent: 'Better confidence.',
    paragraphs: [
      'Through our membership model, we encourage a proactive approach to aesthetic wellness—helping our members stay consistent with their personal goals instead of treating aesthetic care as an occasional decision.',
    ],
    joinLabel: 'Become a member',
  },
}

export default function ForMen() {
  return <TrackPage track={MEN} />
}
