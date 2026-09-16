// oxlint-disable-next-line react/only-export-components -- the shared motion query is part of this component's public API.
export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

export function WordMasteryBurst({ wordId }: { wordId: string }) {
  return (
    <span aria-hidden="true" className="word-mastery-burst" data-testid={`mastery-burst-${wordId}`}>
      {Array.from({ length: 10 }, (_, index) => (
        <span className={`word-mastery-particle particle-${index + 1}`} key={index} />
      ))}
    </span>
  )
}
