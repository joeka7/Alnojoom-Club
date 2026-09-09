import TrackPage, { ICONS } from '../components/sections/TrackPage'

/* ══════════════════════════════════════
   Demo images — swap these for the final
   photography; nothing else needs to change.
══════════════════════════════════════ */
import heroImg from '../assets/for-woman-sec.webp'
import highlightImg from '../assets/for-woman-mid.webp'
import skinBoosterImg from '../assets/skin-booster-for-woman.webp'
import lipEnhancementImg from '../assets/Lip Filler.webp'
import neurotoxinImg from '../assets/upper-face-neurotoxin-for-woman.webp'

const WOMEN = {
  hero: {
    badge: 'For Women',
    title: 'For',
    titleAccent: 'Women.',
    paragraphs: [
      'Al Nojoom Club gives you access to a curated selection of aesthetic treatments designed to support your ongoing beauty and wellness journey.',
    ],
    joinLabel: 'Join the club',
    consultLabel: 'Contact Us',
    priceKey: 'woman',
    image: heroImg,
    imageAlt: 'Aesthetic care for women at Al Nojoom Club',
  },

  treatments: {
    eyebrow: 'Featured treatments',
    title: 'Designed for',
    titleAccent: 'her',
    desc: 'Discover selected treatments designed to support your skin quality, appearance, and aesthetic goals.',
    items: [
      {
        name: 'Skin Booster',
        tag: 'Skin Hydration & Boosters',
        image: skinBoosterImg,
        paragraphs: [
          'Give your skin a boost of hydration and radiance with targeted skin booster treatments designed to improve the appearance and quality of the skin.',
        ],
      },
      {
        name: 'Lip Enhancement',
        tag: 'Facial Enhancement',
        image: lipEnhancementImg,
        paragraphs: [
          'Enhance the appearance and definition of your lips while maintaining balanced and natural-looking facial proportions.',
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
    ],
  },

  highlight: {
    eyebrow: 'Why membership matters',
    title: 'Your Skin Deserves',
    titleAccent: 'Consistency',
    image: highlightImg,
    imageAlt: 'Everlast Wellness clinic',
    paragraphs: [
      'Without a structured approach, you may wait until a concern becomes noticeable or book treatments only when you remember.',
      'With Al Nojoom Club, professional care becomes part of your routine.',
      'Membership helps you:',
    ],
    bullets: [
      'Stay consistent',
      'Plan your treatments',
      'Maintain your aesthetic goals',
      'Receive ongoing professional care',
      'Make self-care part of your lifestyle',
    ],
    closing: 'Membership is about more than saving money. It is about consistency, convenience, professional care, and investing in yourself.',
  },

  cards: {
    eyebrow: 'Your membership',
    title: 'What Your Membership',
    titleAccent: 'Gives You',
    items: [
      {
        title: 'Access to Selected Treatments',
        desc: 'Enjoy the treatments included in your membership plan according to the applicable membership terms.',
        icon: ICONS.access,
      },
      {
        title: 'Professional Aesthetic Care',
        desc: 'Your treatments are delivered by qualified aesthetic professionals using advanced techniques and equipment.',
        icon: ICONS.shield,
      },
      {
        title: 'Consistent Skin & Beauty Maintenance',
        desc: 'Stay committed to your aesthetic goals with regular professional care.',
        icon: ICONS.droplet,
      },
      {
        title: 'Personalized Approach',
        desc: 'Your treatment journey can be adapted to your individual needs and aesthetic goals.',
        icon: ICONS.heart,
      },
      {
        title: 'Exclusive Member Value',
        desc: 'Enjoy the convenience and value of being part of an exclusive aesthetic membership community.',
        icon: ICONS.star,
      },
      {
        title: 'Long-Term Beauty Planning',
        desc: 'Move from occasional treatments to a more consistent approach to maintaining your appearance.',
        icon: ICONS.clock,
      },
    ],
  },

  steps: {
    eyebrow: 'How it works',
    title: 'Your Beauty Journey in 4',
    titleAccent: 'Simple Steps',
    items: [
      { num: '01', title: 'Choose Your Membership', desc: 'Select the membership that matches your needs and aesthetic goals.' },
      { num: '02', title: 'Join the Club', desc: 'Complete your membership and become part of our exclusive aesthetic community.' },
      { num: '03', title: 'Start Your Treatments', desc: 'Book your eligible treatments and begin your personalized beauty journey.' },
      { num: '04', title: 'Stay Consistent', desc: 'Continue your professional aesthetic care throughout your membership period.' },
    ],
    closing: 'Simple. Consistent. Professional.',
  },

  cta: {
    eyebrow: 'Your journey',
    stages: ['Consultation', 'Personalized Plan', 'Treatment', 'Follow-Up', 'Maintenance'],
    paragraphs: [
      "Your relationship with Al Nojoom Club doesn't have to end when your treatment is complete.",
    ],
    joinLabel: 'Join the club',
  },
}

export default function ForWomen() {
  return <TrackPage track={WOMEN} />
}
