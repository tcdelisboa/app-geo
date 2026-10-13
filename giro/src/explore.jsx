import { G, cx, brl, brl0, rangeText, startOf, hoursText, dayLabel, nextHour, addHours, today0 } from './util.js';
import { MapView } from './map.jsx';
import { TopBar } from './components.jsx';
import { PLACES, CONFIG } from './data.js';

const { useState, useMemo, useEffect } = React;

const FILTERS = [
  { id: 'price', label: 'Até R$ 20/h', test: (c) => c.price <= 20 },
  { id: 'auto', label: 'Automático', test: (c) => c.transmission === 'Automático' },
  { id: 'ev', label: 'Elétrico', icon: 'zap', test: (c) => c.energy === 'Elétrico' },
  { id: 'suv', label: 'SUV', test: (c) => c.body === 'suv' },
  { id: 'top', label: 'Nota 4,8+', icon: 'star', test: (c) => c.rating >= 4.8 }
];

export function Explore({ app }) {
  const { state, nav, cars, place, H } = app;
  const [active, setActive] = useState({});
  const [selId, setSelId] = useState(null);
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(null);

  const visible = useMemo(() => cars
    .filter((c) => FILTERS.every((f) => !active[f.id] || f.test(c)))
    .sort((a, b) => (a.unavailable ? 1 : 0) - (b.unavailable ? 1 : 0) || a.distance - b.distance), [cars, active]);
  const available = visible.filter((c) => !c.unavailable).length;
  const sel = visible.find((c) => c.id === selId) || null;
  const start = startOf(state.search);
  const when = rangeText(start, state.search.hours);

  const PEEK = 268, PREVIEW = 246, OPEN = Math.round((H - 64) * 0.86);
  const sheetH = sel ? PREVIEW : open ? OPEN : PEEK;
  const padding = { top: sel ? 92 : 136, bottom: sheetH, left: 0, right: 0 };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelId(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => { setSelId(null); }, [place.id]);
  useEffect(() => {
    const req = app.focusReq;
    const c = req && cars.find((x) => x.id === req.id);
    if (!c) return;
    setSelId(c.id); setOpen(false);
    setFocus({ lat: c.pos.lat, lng: c.pos.lng, at: Date.now() });
  }, [app.focusReq && app.focusReq.at]);

  function select(id) {
    const next = id === selId ? null : id;
    setSelId(next); setOpen(false);
    if (next) { const c = cars.find((x) => x.id === next); setFocus({ lat: c.pos.lat, lng: c.pos.lng, at: Date.now() }); }
  }
  function locate() {
    const go = (p) => setFocus({ lat: p.lat, lng: p.lng, zoom: 15, at: Date.now() });
    if (!navigator.geolocation) return go(place);
    navigator.geolocation.getCurrentPosition(
      (p) => { const me = { lat: p.coords.latitude, lng: p.coords.longitude }; app.setMe(me); go(me); },
      () => { app.toast('Sem acesso à localização. Mostrando ' + place.name + '.'); go(place); },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }
  const count = Object.values(active).filter(Boolean).length;

  let sheet;
  if (sel) {
    const price = G.calcPrice({ rate: sel.price, hours: state.search.hours, dailyCap: sel.dailyCap, protectionPerHour: CONFIG.protection.basica.perHour, feeRate: CONFIG.feeRate });
    sheet = (
      <G.BottomSheet className="explore-sheet" ariaLabel={sel.model} style={{ height: sheetH }}>
        <G.IconButton className="sheet-close" icon="x" size="sm" label="Fechar" onClick={() => setSelId(null)} />
        <G.CarCard car={sel} onClick={() => nav.push('car', { id: sel.id })} />
        <div className="preview-foot">
          <div className="preview-total">
            <span className="preview-total-value">{sel.unavailable ? 'Indisponível' : brl(price.total)}</span>
            <span className="preview-total-sub">{sel.unavailable ? 'nesse horário' : `total por ${hoursText(state.search.hours)}`}</span>
          </div>
          <G.Button size="lg" onClick={() => nav.push('car', { id: sel.id })}>Ver carro</G.Button>
        </div>
      </G.BottomSheet>
    );
  } else {
    sheet = (
      <G.BottomSheet
        className="explore-sheet"
        title={available === 0 ? 'Nenhum carro disponível' : available === 1 ? '1 carro disponível' : `${available} carros disponíveis`}
        subtitle="Preço por hora · mais próximos primeiro"
        onGrab={() => setOpen(!open)} expanded={open} grabLabel={open ? 'Recolher lista' : 'Expandir lista'}
        action={<G.IconButton icon={open ? 'map' : 'list'} label={open ? 'Ver mapa' : 'Ver lista'} onClick={() => setOpen(!open)} />}
        style={{ height: sheetH }}
      >
        {visible.length
          ? visible.map((c) => <G.CarCard key={c.id} car={c} onClick={() => nav.push('car', { id: c.id })} />)
          : (
            <div className="empty">
              <p>Nenhum carro com esses filtros por aqui.</p>
              <G.Button variant="secondary" onClick={() => setActive({})}>Limpar filtros</G.Button>
            </div>
          )}
      </G.BottomSheet>
    );
  }

  return (
    <div className="explore" style={{ '--sheet-h': sheetH + 64 + 'px' }}>
      <MapView center={place} theme={app.theme} cars={visible} selectedId={sel && sel.id} me={app.me}
        onSelect={select} onBlank={() => setSelId(null)} focus={focus} padding={padding} />
      <div className="explore-top">
        <G.SearchBar place={place.name} when={`${when} · ${hoursText(state.search.hours)}`} onSearch={() => nav.push('search')} />
        <div className="chips" hidden={!!sel} role="group" aria-label={'Filtros' + (count ? ` (${count} ativos)` : '')}>
          {FILTERS.map((f) => <G.Chip key={f.id} icon={f.icon} floating selected={!!active[f.id]} onClick={() => setActive((a) => ({ ...a, [f.id]: !a[f.id] }))}>{f.label}</G.Chip>)}
        </div>
      </div>
      <G.IconButton className={cx('locate', open && 'is-hidden')} icon="locate-fixed" label="Centralizar no meu local" variant="floating" onClick={locate} />
      {sheet}
    </div>
  );
}

/* ---------- Search: where and when ---------- */
export function Search({ app }) {
  const { state, nav } = app;
  const [placeId, setPlaceId] = useState(state.search.placeId);
  const [dayOffset, setDayOffset] = useState(state.search.dayOffset);
  const [startHour, setStartHour] = useState(state.search.startHour);
  const [hours, setHours] = useState(state.search.hours);
  const [q, setQ] = useState('');

  const minHour = dayOffset === 0 ? nextHour() : 0;
  useEffect(() => { if (startHour < minHour) setStartHour(minHour); }, [dayOffset]);
  const days = [0, 1, 2, 3, 4, 5, 6].filter((d) => d > 0 || nextHour() <= 23);
  const hoursList = [];
  for (let h = minHour; h <= 23; h++) hoursList.push(h);
  const places = PLACES.filter((p) => (p.name + ' ' + p.sub).toLowerCase().includes(q.trim().toLowerCase()));
  const start = addHours(today0(), dayOffset * 24 + startHour);

  function apply() {
    app.setSearch({ placeId, dayOffset, startHour, hours });
    nav.pop();
  }
  return (
    <div className="screen">
      <TopBar title="Onde e quando" onBack={nav.pop} />
      <div className="scroll">
        <div className="search-field">
          <G.Icon name="search" size={20} />
          <input type="search" placeholder="Bairro, endereço ou aeroporto" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar local" />
        </div>
        <div className="place-list" role="radiogroup" aria-label="Local">
          {places.map((p) => (
            <button key={p.id} type="button" role="radio" aria-checked={p.id === placeId} className={cx('place', p.id === placeId && 'place-on')} onClick={() => setPlaceId(p.id)}>
              <span className="row-icon"><G.Icon name={p.id === 'congonhas' ? 'navigation' : 'map-pin'} size={20} /></span>
              <span className="row-text"><span className="row-label">{p.name}</span><span className="row-sub">{p.sub}</span></span>
              {p.id === placeId ? <G.Icon name="check" size={20} className="place-check" /> : null}
            </button>
          ))}
          {!places.length ? <p className="muted pad">Nenhum local encontrado. Tente outro bairro.</p> : null}
        </div>

        <h2 className="label-title">Dia</h2>
        <div className="hscroll">
          {days.map((d) => <G.Chip key={d} selected={d === dayOffset} onClick={() => setDayOffset(d)}>{dayLabel(addHours(today0(), d * 24 + 12))}</G.Chip>)}
        </div>
        <h2 className="label-title">Retirada</h2>
        <div className="hscroll">
          {hoursList.map((h) => <G.Chip key={h} selected={h === startHour} onClick={() => setStartHour(h)}>{String(h).padStart(2, '0')}:00</G.Chip>)}
        </div>
        <h2 className="label-title">Duração</h2>
        <div className="hscroll">
          {[2, 4, 8, 24, 48].map((h) => <G.Chip key={h} selected={h === hours} onClick={() => setHours(h)}>{hoursText(h)}</G.Chip>)}
        </div>
        <div className="pad-x">
          <G.Stepper label="Ajuste fino" hint={rangeText(start, hours)} value={hours} min={1} max={CONFIG.maxHours} onChange={setHours} format={hoursText} />
        </div>
      </div>
      <footer className="screen-foot">
        <G.Button size="lg" block onClick={apply}>Ver carros</G.Button>
      </footer>
    </div>
  );
}
