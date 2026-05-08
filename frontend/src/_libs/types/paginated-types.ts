export interface PaginationMeta {
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export type PaginatedResponse<T> = PaginationMeta & {
  results: T[];
  mode?: string;
  latest_batches?: Array<{
    provider: string;
    batch_id: string;
    captured_at: string;
  }>;
  latest_per_store?: boolean;
};
