/**
 * Tests for the pure business logic patterns used in actions/reviews.ts.
 *
 * The functions below are directly derived from the logic inside getUserReviews()
 * and createReviews() — they are NOT imports because the server action itself
 * requires a live database. These tests verify the rules independent of the DB.
 */

// ─── Logic mirrored from getUserReviews() ────────────────────────────────────

interface ReviewRow {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  isReviewer: boolean;
  reviewerName?: string | null;
  targetUserName?: string | null;
}

/** Calculates average rating — mirrors the logic in getUserReviews */
function calcAverageRating(received: { rating: number }[]): number {
  const total = received.length;
  return total > 0 ? received.reduce((sum, r) => sum + r.rating, 0) / total : 0;
}

/** Sorts reviews newest-first by ISO createdAt — mirrors the .sort() in getUserReviews */
function sortReviewsNewestFirst(reviews: { createdAt: string }[]): typeof reviews {
  return [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Maps null comment to '' — mirrors `r.comment ?? ''` */
function safeComment(comment: string | null | undefined): string {
  return comment ?? '';
}

/** Maps null name to '' — mirrors `r.reviewerName ?? ''` etc. */
function safeName(name: string | null | undefined): string {
  return name ?? '';
}

// ─── Logic mirrored from createReviews() ─────────────────────────────────────

/** Removes self-reviews — mirrors `.filter((r) => r.targetUserId !== reviewerId)` */
function filterSelfReviews(
  reviews: { targetUserId: string }[],
  reviewerId: string,
): typeof reviews {
  return reviews.filter((r) => r.targetUserId !== reviewerId);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('calcAverageRating', () => {
  it('3 reviews → correct average', () => {
    const reviews = [{ rating: 4 }, { rating: 5 }, { rating: 3 }];
    expect(calcAverageRating(reviews)).toBeCloseTo(4.0);
  });

  it('0 reviews → 0 (no division by zero)', () => {
    expect(calcAverageRating([])).toBe(0);
  });

  it('single review → equals that rating', () => {
    expect(calcAverageRating([{ rating: 5 }])).toBe(5);
  });

  it('mixed ratings → precise average', () => {
    const reviews = [{ rating: 1 }, { rating: 2 }, { rating: 3 }, { rating: 4 }, { rating: 5 }];
    expect(calcAverageRating(reviews)).toBe(3);
  });
});

describe('sortReviewsNewestFirst', () => {
  it('newer ISO dates appear first', () => {
    const reviews = [
      { createdAt: '2024-01-01T00:00:00.000Z' },
      { createdAt: '2024-06-15T00:00:00.000Z' },
      { createdAt: '2023-12-01T00:00:00.000Z' },
    ];
    const sorted = sortReviewsNewestFirst(reviews);
    expect(sorted[0].createdAt).toBe('2024-06-15T00:00:00.000Z');
    expect(sorted[2].createdAt).toBe('2023-12-01T00:00:00.000Z');
  });

  it('does not mutate the original array', () => {
    const reviews = [
      { createdAt: '2024-01-01T00:00:00.000Z' },
      { createdAt: '2024-06-15T00:00:00.000Z' },
    ];
    const original = [...reviews];
    sortReviewsNewestFirst(reviews);
    expect(reviews).toEqual(original);
  });
});

describe('null coalescing for review fields', () => {
  it('safeComment: null comment → empty string', () => {
    expect(safeComment(null)).toBe('');
  });

  it('safeComment: undefined → empty string', () => {
    expect(safeComment(undefined)).toBe('');
  });

  it('safeComment: non-null comment → passes through unchanged', () => {
    expect(safeComment('Great run!')).toBe('Great run!');
  });

  it('safeName: null reviewer name → empty string', () => {
    expect(safeName(null)).toBe('');
  });

  it('safeName: undefined → empty string', () => {
    expect(safeName(undefined)).toBe('');
  });

  it('safeName: non-null name → passes through unchanged', () => {
    expect(safeName('Alice')).toBe('Alice');
  });
});

describe('filterSelfReviews (createReviews security rule)', () => {
  it('removes entries where targetUserId === reviewerId', () => {
    const data = [
      { targetUserId: 'user-1' }, // self-review — should be removed
      { targetUserId: 'user-2' }, // OK
    ];
    const result = filterSelfReviews(data, 'user-1');
    expect(result).toHaveLength(1);
    expect(result[0].targetUserId).toBe('user-2');
  });

  it('all self-reviews → empty result', () => {
    const data = [{ targetUserId: 'user-1' }, { targetUserId: 'user-1' }];
    expect(filterSelfReviews(data, 'user-1')).toHaveLength(0);
  });

  it('no self-reviews → all entries kept', () => {
    const data = [{ targetUserId: 'user-2' }, { targetUserId: 'user-3' }];
    expect(filterSelfReviews(data, 'user-1')).toHaveLength(2);
  });

  it('empty input → empty output', () => {
    expect(filterSelfReviews([], 'user-1')).toHaveLength(0);
  });
});
