/**
 * LocalDB — A JSON-file-backed database that implements the Supabase JS client's
 * chainable query builder API. This is used as a zero-config fallback when
 * Supabase credentials are not configured, allowing the entire app to work
 * offline with no external dependencies.
 *
 * Supported operations:
 *   supabase.from('table').select('*').eq('field', val).order('f', {ascending}).limit(n)
 *   supabase.from('table').select('*').eq(...).single() / .maybeSingle()
 *   supabase.from('table').insert([{...}]).select().single()
 *   supabase.from('table').update({...}).eq('id', val).select().single()
 *   supabase.from('table').delete().eq('id', val)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadTable(tableName) {
  const filePath = path.join(DATA_DIR, `${tableName}.json`);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      return [];
    }
  }
  return [];
}

function saveTable(tableName, rows) {
  const filePath = path.join(DATA_DIR, `${tableName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(rows, null, 2), 'utf8');
}

function generateUUID() {
  return crypto.randomUUID();
}

function pickColumns(row, columns) {
  if (!columns) return { ...row };
  const result = {};
  for (const col of columns) {
    if (col in row) result[col] = row[col];
  }
  return result;
}

/**
 * Chainable query builder that mimics the Supabase PostgREST builder.
 * It is a "thenable" — you can `await` it, and it executes the query.
 */
class QueryBuilder {
  constructor(tableName) {
    this._table = tableName;
    this._operation = null;  // 'select' | 'insert' | 'update' | 'delete'
    this._filters = [];
    this._orders = [];
    this._limitCount = null;
    this._columns = null;    // parsed select columns, null = all
    this._insertRows = null;
    this._updateData = null;
    this._wantSingle = false;
    this._wantMaybeSingle = false;
    this._chainedSelect = false; // .insert().select() or .update().select()
  }

  // ─── Query Methods ──────────────────────────────────────────────

  select(columnsStr) {
    if (this._operation === 'insert' || this._operation === 'update' || this._operation === 'delete') {
      // Chained select after insert/update/delete — means "return the affected rows"
      this._chainedSelect = true;
      if (columnsStr && columnsStr !== '*') {
        this._columns = columnsStr.split(',').map(c => c.trim());
      }
      return this;
    }
    this._operation = 'select';
    if (columnsStr && columnsStr !== '*') {
      this._columns = columnsStr.split(',').map(c => c.trim());
    }
    return this;
  }

  eq(field, value) {
    this._filters.push({ type: 'eq', field, value });
    return this;
  }

  order(field, options = {}) {
    this._orders.push({ field, ascending: options.ascending !== false });
    return this;
  }

  limit(count) {
    this._limitCount = count;
    return this;
  }

  single() {
    this._wantSingle = true;
    return this;
  }

  maybeSingle() {
    this._wantMaybeSingle = true;
    return this;
  }

  insert(rows) {
    this._operation = 'insert';
    this._insertRows = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  update(data) {
    this._operation = 'update';
    this._updateData = data;
    return this;
  }

  delete() {
    this._operation = 'delete';
    return this;
  }

  // ─── Thenable (makes this awaitable) ────────────────────────────

  then(resolve, reject) {
    try {
      const result = this._execute();
      resolve(result);
    } catch (err) {
      if (reject) {
        reject(err);
      } else {
        resolve({ data: null, error: { message: err.message } });
      }
    }
  }

  // ─── Internal Execution ─────────────────────────────────────────

  _execute() {
    switch (this._operation) {
      case 'insert':  return this._execInsert();
      case 'update':  return this._execUpdate();
      case 'delete':  return this._execDelete();
      case 'select':
      default:        return this._execSelect();
    }
  }

  _applyFilters(rows) {
    let result = rows;
    for (const f of this._filters) {
      if (f.type === 'eq') {
        result = result.filter(r => String(r[f.field]) === String(f.value));
      }
    }
    return result;
  }

  _applyOrders(rows) {
    if (this._orders.length === 0) return rows;

    return [...rows].sort((a, b) => {
      for (const { field, ascending } of this._orders) {
        const aVal = a[field];
        const bVal = b[field];
        if (aVal === bVal) continue;
        if (aVal == null) return ascending ? 1 : -1;
        if (bVal == null) return ascending ? -1 : 1;
        const cmp = typeof aVal === 'string'
          ? aVal.localeCompare(bVal)
          : (aVal < bVal ? -1 : 1);
        return ascending ? cmp : -cmp;
      }
      return 0;
    });
  }

  _projectColumns(rows) {
    if (!this._columns) return rows;
    return rows.map(r => pickColumns(r, this._columns));
  }

  _wrapResult(rows) {
    if (this._wantSingle) {
      if (!rows || rows.length === 0) {
        return { data: null, error: { message: 'Row not found' } };
      }
      return { data: rows[0], error: null };
    }
    if (this._wantMaybeSingle) {
      return { data: (rows && rows.length > 0) ? rows[0] : null, error: null };
    }
    return { data: rows || [], error: null };
  }

  // ── SELECT ──

  _execSelect() {
    let rows = loadTable(this._table);
    rows = this._applyFilters(rows);
    rows = this._applyOrders(rows);
    if (this._limitCount != null) {
      rows = rows.slice(0, this._limitCount);
    }
    rows = this._projectColumns(rows);
    return this._wrapResult(rows);
  }

  // ── INSERT ──

  _execInsert() {
    const allRows = loadTable(this._table);
    const now = new Date().toISOString();
    const inserted = [];

    for (const row of this._insertRows) {
      const newRow = {
        id: generateUUID(),
        ...row,
        created_at: row.created_at || now,
        updated_at: row.updated_at || now,
      };
      allRows.push(newRow);
      inserted.push(newRow);
    }

    saveTable(this._table, allRows);

    if (!this._chainedSelect) {
      return { data: inserted, error: null };
    }

    let result = this._projectColumns(inserted);
    return this._wrapResult(result);
  }

  // ── UPDATE ──

  _execUpdate() {
    const allRows = loadTable(this._table);
    const updated = [];

    for (let i = 0; i < allRows.length; i++) {
      const row = allRows[i];
      const matches = this._filters.every(f => {
        if (f.type === 'eq') return String(row[f.field]) === String(f.value);
        return true;
      });
      if (matches) {
        allRows[i] = { ...row, ...this._updateData };
        updated.push(allRows[i]);
      }
    }

    saveTable(this._table, allRows);

    if (!this._chainedSelect) {
      return { data: updated, error: null };
    }

    let result = this._projectColumns(updated);
    return this._wrapResult(result);
  }

  // ── DELETE ──

  _execDelete() {
    const allRows = loadTable(this._table);
    const remaining = [];
    const deleted = [];

    for (const row of allRows) {
      const matches = this._filters.every(f => {
        if (f.type === 'eq') return String(row[f.field]) === String(f.value);
        return true;
      });
      if (matches) {
        deleted.push(row);
      } else {
        remaining.push(row);
      }
    }

    saveTable(this._table, remaining);

    if (this._chainedSelect) {
      let result = this._projectColumns(deleted);
      return this._wrapResult(result);
    }

    return { data: deleted, error: null };
  }
}

/**
 * The LocalDB client object — has the same `.from('table')` API as supabase-js.
 */
const localSupabase = {
  from(tableName) {
    return new QueryBuilder(tableName);
  }
};

export default localSupabase;
export { DATA_DIR, loadTable, saveTable, generateUUID };
