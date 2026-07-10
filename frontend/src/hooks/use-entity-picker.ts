import { useState } from "react";

/**
 * Owns the search + "create new" modal state for one searchable entity picker
 * (sender, receiver, driver, vehicle, origin, destination).
 */
export function useEntityPicker() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  return { search, setSearch, modalOpen, setModalOpen };
}

/**
 * Normalizes query results that may come back either as a raw array
 * or as a paginated `{ results: T[] }` object, so EntitiesSection
 * doesn't need to know which shape a given hook returns.
 *
 * TODO: once you confirm useLocations' real return shape, this can be
 * simplified back to `data?.results ?? []`.
 */
export function toItems<T>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (
    typeof data === "object" &&
    data !== null &&
    "results" in (data as Record<string, unknown>)
  ) {
    return (data as { results?: T[] }).results ?? [];
  }
  return [];
}
