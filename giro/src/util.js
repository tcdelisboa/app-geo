export const G = window.Giro;

/* ---------- Geo ---------- */
export function offset(origin, east, north) {
  return {
    lat: origin.lat + north / 111320,
    lng: origin.lng + east / (111320 * Math.cos(origin.lat * Math.PI / 180))
  };
}
export function distance(a, b) {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/* ---------- Time ---------- */
const WEEK = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });
const DAYMONTH = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' });
const LONG = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

export function today0() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
export function addHours(d, h) { return new Date(d.getTime() + h * 3600000); }
export function nextHour() { return Math.min(23, new Date().getHours() + 1); }
export function startOf(search) { return addHours(today0(), search.dayOffset * 24 + search.startHour); }
export function hhmm(d) { return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
function trimDot(s) { return s.replace(/\.$/, ''); }
export function dayLabel(d, lower) {
  const diff = Math.round((new Date(d).setHours(0, 0, 0, 0) - today0().getTime()) / 86400000);
  if (diff === 0) return lower ? 'hoje' : 'Hoje';
  if (diff === 1) return lower ? 'amanhã' : 'Amanhã';
  if (diff === -1) return lower ? 'ontem' : 'Ontem';
  const w = trimDot(WEEK.format(d));
  return (lower ? w : w[0].toUpperCase() + w.slice(1)) + ', ' + trimDot(DAYMONTH.format(d)).replace(' de ', ' ');
}
export function longDate(d) { const s = LONG.format(d); return s[0].toUpperCase() + s.slice(1); }
/* "Hoje · 15:00 – 19:00" ou "Hoje 22:00 – amanhã 02:00" */
export function rangeText(start, hours) {
  const end = addHours(start, hours);
  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) return dayLabel(start) + ' · ' + hhmm(start) + ' – ' + hhmm(end);
  return dayLabel(start) + ' ' + hhmm(start) + ' – ' + dayLabel(end, true) + ' ' + hhmm(end);
}
export function hoursText(h) {
  if (h < 24 || h % 24) return h + ' h';
  return h === 24 ? '1 dia' : h / 24 + ' dias';
}

/* ---------- Money ---------- */
export const brl = (v) => G.formatBRL(v);
export const brl0 = (v) => G.formatBRL(v, { cents: false });

/* ---------- Misc ---------- */
export function initials(name) { return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase(); }
export function firstName(name) { return name.split(' ')[0]; }
export function cx(...a) { return a.filter(Boolean).join(' '); }
export function code() {
  const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = 'GR-';
  for (let i = 0; i < 4; i++) s += A[Math.floor(Math.random() * A.length)];
  return s;
}
export function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
}
export function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* armazenamento indisponível: segue em memória */ }
}
