type Primitive = string | number | boolean | null | undefined;
type QueryValue = Primitive | Date | Primitive[] | Date[];
export type QueryObject = Record<string, QueryValue>;

export type WithQueryOptions = {
  /** trims string values before adding */
  trimStrings?: boolean;
  /** omits empty strings after trimming */
  skipEmptyString?: boolean;
  /** omits null */
  skipNull?: boolean;
  /** omits undefined */
  skipUndefined?: boolean;
  /** how arrays are encoded */
  arrayFormat?: "repeat" | "comma";
  /** stable key order in output */
  sortKeys?: boolean;
};

/**
 * Build a URL (Uniform Resource Locator) by appending query params from an object.
 * Handles arrays, booleans, numbers, strings, Date.
 */
export function withQuery(
  path: string,
  params?: QueryObject,
  options: WithQueryOptions = {},
) {
  const {
    trimStrings = true,
    skipEmptyString = true,
    skipNull = true,
    skipUndefined = true,
    arrayFormat = "repeat",
    sortKeys = true,
  } = options;

  const [base, existingQs] = path.split("?");
  const sp = new URLSearchParams(existingQs || "");

  if (!params) {
    const qs = sp.toString();
    return qs ? `${base}?${qs}` : base;
  }

  const keys = Object.keys(params);
  if (sortKeys) keys.sort();

  for (const key of keys) {
    const raw = params[key];

    if (raw === undefined && skipUndefined) continue;
    if (raw === null && skipNull) continue;

    // clear existing to avoid duplicates when updating
    sp.delete(key);

    const push = (v: Primitive | Date) => {
      if (v === undefined && skipUndefined) return;
      if (v === null && skipNull) return;

      let s: string;

      if (v instanceof Date) {
        s = v.toISOString();
      } else if (typeof v === "string") {
        s = trimStrings ? v.trim() : v;
        if (skipEmptyString && s === "") return;
      } else {
        s = String(v);
      }

      sp.append(key, s);
    };

    if (Array.isArray(raw)) {
      const arr = raw;

      if (arrayFormat === "comma") {
        const mapped = arr
          .map((v) => {
            if (v instanceof Date) return v.toISOString();
            if (typeof v === "string") return trimStrings ? v.trim() : v;
            return v == null ? "" : String(v);
          })
          .filter((v) => !(skipEmptyString && v === ""));

        if (mapped.length > 0) sp.set(key, mapped.join(","));
      } else {
        for (const v of arr) push(v);
      }
    } else {
      push(raw);
    }
  }

  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}
