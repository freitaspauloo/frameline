export type SoftwaveFeatureCard = {
  number: string;
  line1: string;
  line2: string;
  caption: string;
  art: string;
};

export const SOFTWAVE_FEATURE_CARDS: SoftwaveFeatureCard[] = [
  {
    number: "1",
    line1: "Dataset cleaning,",
    line2: "bad rows removed.",
    caption:
      "Dedupe rows and fix bad labels,\ndrop corrupt uploads before training.",
    art: "/screens/softwave-features/card-1.png",
  },
  {
    number: "2",
    line1: "Run comparison,",
    line2: "ranked by metric.",
    caption:
      "Compare runs on accuracy and loss,\nthen ship the checkpoint that wins.",
    art: "/screens/softwave-features/card-2.png",
  },
  {
    number: "3",
    line1: "One-click deploy,",
    line2: "live in minutes.",
    caption:
      "Promote the top checkpoint to\nlive inference in one click.",
    art: "/screens/softwave-features/card-3.png",
  },
  {
    number: "4",
    line1: "Drift monitoring,",
    line2: "catch drops early.",
    caption:
      "Track output quality in prod and\nalert before drift hits users.",
    art: "/screens/softwave-features/card-4.png",
  },
];

/** Paper LM-0 hover — caption sits tight under title (~0.55cqmin gap). */
export const CARD_COPY_GAP_CQMIN = 0.55;

/** Scale-only bg drift — keeps art clipped with no edge seams. */
export const ART_IDLE_SCALE_MIN = 1.08;
export const ART_IDLE_SCALE_MAX = 1.11;
export const ART_HOVER_SCALE = 1.14;
