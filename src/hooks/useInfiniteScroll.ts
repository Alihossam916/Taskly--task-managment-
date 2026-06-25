import { useState, useCallback } from "react";

// T is the type of the item (e.g., Project, Epic)
export const useInfiniteScroll = <T>(
  initialItems: T[],
  total: number,
  currentPage: number,
  limit: number,
  // The fetch function that returns the next set of items
  fetchFn: (
    limit: number,
    offset: number,
  ) => Promise<{ items: T[]; total: number } | null>,
) => {
  const [items, setItems] = useState<T[]>(initialItems);
  const [page, setPage] = useState(currentPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialItems.length < total);

  // Sync state if initialItems change (e.g., on route navigation)
  const [prevInitialItems, setPrevInitialItems] = useState(initialItems);
  if (initialItems !== prevInitialItems) {
    setPrevInitialItems(initialItems);
    setItems(initialItems);
    setPage(currentPage);
    setHasMore(initialItems.length < total);
  }

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const offset = (nextPage - 1) * limit;

      const result = await fetchFn(limit, offset);

      if (result && result.items.length > 0) {
        setItems((prev) => [...prev, ...result.items]);
        setPage(nextPage);
        // Check if we've reached the total
        setHasMore(items.length + result.items.length < total);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more items:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, limit, total, items.length, fetchFn]);

  return { items, setItems, loading, hasMore, loadMore };
};
