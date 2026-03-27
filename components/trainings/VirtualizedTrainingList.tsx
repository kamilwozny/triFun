'use client';

import { memo, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  List,
  ListImperativeAPI,
  useDynamicRowHeight,
  RowComponentProps,
} from 'react-window';
import { TrainingEvent } from '@/types/training';
import { TrainingEventCard } from './TrainingEventCard';

const SCROLL_STORAGE_KEY = 'trainings-scroll-row';

interface RowData {
  events: TrainingEvent[];
  showReviewButton: (event: TrainingEvent) => boolean;
  onReview: (eventId: string) => void;
  observeRowElements: (elements: Element[]) => () => void;
}

const Row = memo(function Row({
  ariaAttributes,
  index,
  style,
  events,
  showReviewButton,
  onReview,
  observeRowElements,
}: RowComponentProps<RowData>) {
  const event = events[index];

  const rowRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      return observeRowElements([node]);
    },
    [observeRowElements],
  );

  return (
    <div ref={rowRef} {...ariaAttributes} style={style}>
      <div style={{ paddingBottom: 24 }}>
        <TrainingEventCard
          event={event}
          showReviewButton={showReviewButton(event)}
          onReview={onReview}
        />
      </div>
    </div>
  );
}) as (props: RowComponentProps<RowData>) => React.ReactElement | null;

interface VirtualizedTrainingListProps {
  events: TrainingEvent[];
  showReviewButton: (event: TrainingEvent) => boolean;
  onReview: (eventId: string) => void;
  filterVersion: number;
}

export function VirtualizedTrainingList({
  events,
  showReviewButton,
  onReview,
  filterVersion,
}: VirtualizedTrainingListProps) {
  const listRef = useRef<ListImperativeAPI | null>(null);

  const initialScrollRow = useRef(
    typeof window !== 'undefined'
      ? Number(sessionStorage.getItem(SCROLL_STORAGE_KEY)) || 0
      : 0,
  );

  const isRestoringRef = useRef(initialScrollRow.current > 0);

  const dynamicHeight = useDynamicRowHeight({
    defaultRowHeight: 200,
    key: filterVersion,
  });

  useEffect(() => {
    const rowIndex = initialScrollRow.current;
    if (!rowIndex) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToRow({
        index: rowIndex,
        align: 'start',
        behavior: 'instant',
      });
      isRestoringRef.current = false;
    });
  }, []);

  const handleRowsRendered = useCallback(
    (visibleRows: { startIndex: number; stopIndex: number }) => {
      if (isRestoringRef.current) return;
      sessionStorage.setItem(
        SCROLL_STORAGE_KEY,
        String(visibleRows.startIndex + 2),
      );
    },
    [],
  );

  useEffect(() => {
    if (filterVersion === 0) return;
    listRef.current?.scrollToRow({ index: 0, behavior: 'instant' });
    sessionStorage.removeItem(SCROLL_STORAGE_KEY);
  }, [filterVersion]);

  const rowProps = useMemo<RowData>(
    () => ({
      events,
      showReviewButton,
      onReview,
      observeRowElements: dynamicHeight.observeRowElements,
    }),
    [events, showReviewButton, onReview, dynamicHeight.observeRowElements],
  );

  return (
    <List
      className="no-scrollbar"
      listRef={listRef}
      rowComponent={Row}
      rowCount={events.length}
      rowHeight={dynamicHeight}
      rowProps={rowProps}
      overscanCount={3}
      onRowsRendered={handleRowsRendered}
    />
  );
}
