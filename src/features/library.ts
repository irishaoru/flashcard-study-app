export type Card = { id: string; question: string; answer: string };
export type Deck = { id: string; title: string; cards: Card[] };
export type Session = {
  round: number;
  queue: string[];
  index: number;
  missed: string[];
  revealed: boolean;
};
export type Library = { decks: Deck[]; sessions: Record<string, Session> };

export function grade(session: Session, correct: boolean): Session | undefined {
  const missed = correct ? session.missed : [...session.missed, session.queue[session.index]];
  const index = session.index + 1;
  if (index < session.queue.length) return { ...session, index, missed, revealed: false };
  if (missed.length > 0) {
    return { round: session.round + 1, queue: missed, index: 0, missed: [], revealed: false };
  }
}
