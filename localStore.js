// Lightweight local data layer.
//
// This is a simple local data layer for anonymous, on-device logging.
// Everything is stored in the browser's localStorage, so the app works
// fully offline and with zero backend — which is exactly what you want for
// low-connectivity use in the field.
//
// Trade-off: analytics on the Insights page are now per-device, not
// aggregated across all users. If you later want real community-wide
// insights, swap this file's internals for calls to a small backend of your
// choice (Supabase, Firebase, a simple Express + Postgres API, etc.) and
// nothing in the pages that call it needs to change — the function
// signatures (`create`, `list`) stay the same.

const PREFIX = 'habesha_health_';

function readCollection(name) {
  try {
    const raw = localStorage.getItem(PREFIX + name);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCollection(name, items) {
  try {
    localStorage.setItem(PREFIX + name, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — fail silently, this is non-critical logging.
  }
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createEntity(collectionName) {
  return {
    async create(data) {
      const items = readCollection(collectionName);
      const record = {
        id: makeId(),
        created_date: new Date().toISOString(),
        ...data,
      };
      items.push(record);
      writeCollection(collectionName, items);
      return record;
    },

    async list(sort = '-created_date', limit = 500) {
      const items = [...readCollection(collectionName)];
      const field = sort.replace(/^-/, '');
      const desc = sort.startsWith('-');
      items.sort((a, b) => {
        const av = a[field] ?? '';
        const bv = b[field] ?? '';
        if (av < bv) return desc ? 1 : -1;
        if (av > bv) return desc ? -1 : 1;
        return 0;
      });
      return items.slice(0, limit);
    },

    async clear() {
      writeCollection(collectionName, []);
    },
  };
}

export const localEntities = {
  SymptomLog: createEntity('symptom_logs'),
  TopicView: createEntity('topic_views'),
  Feedback: createEntity('feedback'),
};
