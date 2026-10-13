import { G } from './util.js';

const { useState, useEffect, useRef, useMemo } = React;

const TILES = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
};
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>';

function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function pinHtml(car, selected) {
  const price = G.formatBRL(car.price, { cents: false });
  const label = `${car.model} ${car.year}, ${price} por hora${car.unavailable ? ', indisponível no horário' : ''}`;
  return `<div class="gr-map-marker" style="left:0;top:0"><button type="button" class="gr-pin${selected ? ' gr-pin-selected' : ''}${car.unavailable ? ' gr-pin-unavailable' : ''}${car.mine ? ' pin-mine' : ''}" aria-pressed="${selected}" aria-label="${esc(label)}"><span class="gr-pin-body">${esc(price)}</span></button></div>`;
}

/* Real map (Leaflet). If the tile server cannot be reached, falls back to the drawn
   Giro map so the demo never shows an empty grey screen. */
export function MapView(props) {
  const [fallback, setFallback] = useState(!window.L || window.GIRO_MAP === 'drawn');
  return fallback
    ? <DrawnMap {...props} />
    : <LeafletMap {...props} onTilesFailed={() => setFallback(true)} />;
}

function LeafletMap(props) {
  const L = window.L;
  const el = useRef(null), mapRef = useRef(null), tilesRef = useRef(null), markers = useRef({}), meRef = useRef(null);
  const cb = useRef(props); cb.current = props;

  useEffect(() => {
    const map = L.map(el.current, { zoomControl: false, attributionControl: true, zoomSnap: 0.5 });
    map.attributionControl.setPrefix(false);
    map.setView([props.center.lat, props.center.lng], 15);
    map.on('click', () => cb.current.onBlank && cb.current.onBlank());
    mapRef.current = map;
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el.current);
    return () => { ro.disconnect(); map.remove(); };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (tilesRef.current) map.removeLayer(tilesRef.current);
    let loaded = 0, failed = 0;
    const layer = L.tileLayer(TILES[props.theme], { maxZoom: 19, subdomains: 'abcd', attribution: ATTRIBUTION });
    layer.on('tileload', () => { loaded++; });
    layer.on('tileerror', () => { failed++; if (!loaded && failed >= 4) cb.current.onTilesFailed(); });
    tilesRef.current = layer.addTo(map);
  }, [props.theme]);

  useEffect(() => {
    mapRef.current.setView([props.center.lat, props.center.lng], 15, { animate: false });
  }, [props.center.lat, props.center.lng]);

  useEffect(() => {
    const map = mapRef.current, seen = {};
    props.cars.forEach((car) => {
      seen[car.id] = true;
      const selected = car.id === props.selectedId;
      const icon = L.divIcon({ className: 'giro-marker', html: pinHtml(car, selected), iconSize: [0, 0] });
      let m = markers.current[car.id];
      if (!m) {
        m = L.marker([car.pos.lat, car.pos.lng], { icon, keyboard: false, riseOnHover: true });
        m.on('click', (e) => { L.DomEvent.stopPropagation(e); cb.current.onSelect(car.id); });
        m.addTo(map);
        markers.current[car.id] = m;
      } else {
        m.setLatLng([car.pos.lat, car.pos.lng]);
        m.setIcon(icon);
      }
      m.setZIndexOffset(selected ? 1000 : car.unavailable ? -100 : 0);
    });
    Object.keys(markers.current).forEach((id) => {
      if (!seen[id]) { map.removeLayer(markers.current[id]); delete markers.current[id]; }
    });
  }, [props.cars, props.selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (meRef.current) { map.removeLayer(meRef.current); meRef.current = null; }
    if (!props.me) return;
    meRef.current = L.marker([props.me.lat, props.me.lng], {
      icon: L.divIcon({ className: 'giro-marker', html: '<span class="gr-me" style="left:0;top:0" role="img" aria-label="Você está aqui"></span>', iconSize: [0, 0] }),
      keyboard: false, interactive: false, zIndexOffset: 500
    }).addTo(map);
  }, [props.me]);

  useEffect(() => {
    const t = props.focus, map = mapRef.current;
    if (!t) return;
    map.invalidateSize();
    if (t.zoom) map.setZoom(t.zoom, { animate: false });
    const size = map.getSize(), pad = cb.current.padding;
    const want = L.point(pad.left + (size.x - pad.left - pad.right) / 2, pad.top + (size.y - pad.top - pad.bottom) / 2);
    const p = map.latLngToContainerPoint([t.lat, t.lng]);
    map.panBy(p.subtract(want), { animate: true, duration: 0.45 });
  }, [props.focus]);

  return <div ref={el} className="map" role="region" aria-label="Mapa de carros disponíveis" />;
}

/* Drawn fallback: projects lat/lng into the Giro MapCanvas frame. */
function DrawnMap(props) {
  const el = useRef(null);
  const [size, setSize] = useState({ w: 390, h: 844 });
  useEffect(() => {
    const ro = new ResizeObserver(() => setSize({ w: el.current.clientWidth, h: el.current.clientHeight }));
    ro.observe(el.current);
    return () => ro.disconnect();
  }, []);
  /* ~3.2 km across the frame width, centred on the search origin. */
  const mPerPx = 3200 / Math.max(320, size.w);
  const toPct = (pos) => {
    const east = (pos.lng - props.center.lng) * 111320 * Math.cos(props.center.lat * Math.PI / 180);
    const north = (pos.lat - props.center.lat) * 111320;
    return { x: 50 + (east / mPerPx / size.w) * 100, y: 50 - (north / mPerPx / size.h) * 100 };
  };
  const pins = props.cars.map((c) => Object.assign({ id: c.id, price: c.price, label: c.model + ' ' + c.year, unavailable: c.unavailable }, toPct(c.pos)));
  const [off, setOff] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const t = props.focus;
    if (!t) return;
    const p = toPct(t), pad = props.padding;
    const wantX = pad.left + (size.w - pad.left - pad.right) / 2, wantY = pad.top + (size.h - pad.top - pad.bottom) / 2;
    setOff({ x: wantX - (p.x / 100) * size.w, y: wantY - (p.y / 100) * size.h });
  }, [props.focus]);
  useEffect(() => { setOff({ x: 0, y: 0 }); }, [props.center.lat, props.center.lng]);
  return (
    <div ref={el} className="map map-drawn" onClick={(e) => { if (e.target === e.currentTarget || e.target.tagName === 'svg' || e.target.tagName === 'rect' || e.target.tagName === 'path') props.onBlank && props.onBlank(); }}>
      <G.MapCanvas pins={pins} selectedId={props.selectedId} onSelect={props.onSelect} me={props.me ? toPct(props.me) : null} offset={off} style={{ position: 'absolute', inset: 0 }} ariaLabel="Mapa de carros disponíveis" />
    </div>
  );
}
