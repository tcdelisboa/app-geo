import { G, cx, offset, distance, nextHour, load, save, brl } from './util.js';
import { ArtDefs, CarArt, TopBar, Section, Row, Avatar, Toast, carPhoto } from './components.jsx';
import { Explore, Search } from './explore.jsx';
import { CarDetail, Checkout, Pay, Confirmed } from './booking.jsx';
import { Trips, Booking, Inspection, Rate, Chat } from './trips.jsx';
import { Host, ListCar, Listed } from './host.jsx';
import { CARS, PLACES, MY_CAR, PAST_TRIPS, USER, CONFIG } from './data.js';

const { useState, useEffect, useMemo, useCallback, useRef } = React;

const KEY = 'giro-demo-v1';
/* A theme the host page set before the app loaded (e.g. an embedding viewer) wins over the OS setting. */
const HOST_THEME = document.documentElement.getAttribute('data-theme');
function initialState() {
  const h = nextHour();
  return {
    onboarded: false,
    theme: 'auto',
    search: { placeId: 'pinheiros', dayOffset: h > 22 ? 1 : 0, startHour: h > 22 ? 9 : h, hours: 4 },
    bookings: [],
    myCars: [MY_CAR],
    favorites: []
  };
}

const ROUTES = { search: Search, car: CarDetail, checkout: Checkout, pay: Pay, confirmed: Confirmed, booking: Booking, inspection: Inspection, rate: Rate, chat: Chat, listcar: ListCar, listed: Listed };
const TABS = [
  { id: 'explore', label: 'Explorar', icon: 'compass', Screen: Explore },
  { id: 'trips', label: 'Viagens', icon: 'calendar', Screen: Trips },
  { id: 'host', label: 'Meus carros', icon: 'car', Screen: Host },
  { id: 'profile', label: 'Perfil', icon: 'user', Screen: Profile }
];

function useMedia(q) {
  const mq = useMemo(() => window.matchMedia(q), [q]);
  const [m, setM] = useState(mq.matches);
  useEffect(() => { const on = () => setM(mq.matches); mq.addEventListener('change', on); return () => mq.removeEventListener('change', on); }, [mq]);
  return m;
}
function useWindow() {
  const [s, setS] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => { const on = () => setS({ w: window.innerWidth, h: window.innerHeight }); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on); }, []);
  return s;
}

function App() {
  const [state, setState] = useState(() => Object.assign(initialState(), load(KEY, {})));
  const [tab, setTab] = useState('explore');
  const [stack, setStack] = useState([]);
  const [toastMsg, setToast] = useState(null);
  const [me, setMe] = useState(null);
  const [focusReq, setFocusReq] = useState(null);
  const sysDark = useMedia('(prefers-color-scheme: dark)');
  const win = useWindow();
  const framed = win.w >= 720;
  const H = framed ? 844 : win.h;
  const scale = framed ? Math.min(1, (win.h - 48) / 844) : 1;
  const theme = state.theme === 'auto' ? (HOST_THEME === 'dark' || HOST_THEME === 'light' ? HOST_THEME : sysDark ? 'dark' : 'light') : state.theme;

  useEffect(() => { save(KEY, state); }, [state]);
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => { if (!toastMsg) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); }, [toastMsg]);

  const place = PLACES.find((p) => p.id === state.search.placeId) || PLACES[0];
  const allCars = useMemo(() => [...CARS, ...state.myCars].map((c) => ({ ...c, photo: carPhoto(c) })), [state.myCars]);
  const cars = useMemo(() => {
    const from = me && distance(me, place) < 5000 ? me : place;
    return allCars.filter((c) => !c.mine || c.active).map((c) => {
      const pos = offset(place, c.east, c.north);
      return { ...c, pos, distance: distance(from, pos) };
    });
  }, [allCars, place, me]);

  const update = (fn) => setState((s) => ({ ...s, ...fn(s) }));
  const nav = {
    push: (name, params = {}) => setStack((s) => [...s, { name, params, key: name + Date.now() }]),
    pop: () => setStack((s) => s.slice(0, -1)),
    replace: (name, params = {}) => setStack((s) => [...s.slice(0, -1), { name, params, key: name + Date.now() }]),
    home: (t) => { setStack([]); if (t) setTab(t); },
    tab: (t) => { setStack([]); setTab(t); }
  };
  const app = {
    state, nav, cars, place, me, theme, H, focusReq,
    setMe,
    toast: (text) => setToast({ text, id: Date.now() }),
    setSearch: (search) => update(() => ({ search })),
    setTheme: (theme) => update(() => ({ theme })),
    carById: (id) => cars.find((c) => c.id === id) || allCars.map((c) => ({ ...c, pos: offset(place, c.east, c.north), distance: 0 })).find((c) => c.id === id),
    bookings: () => {
      const past = PAST_TRIPS.map((p) => {
        const d = new Date(); d.setDate(d.getDate() - p.daysAgo); d.setHours(p.startHour, 0, 0, 0);
        return { id: p.id, carId: p.carId, start: d.toISOString(), hours: p.hours, protection: 'basica', payment: 'pix', total: p.total, status: 'concluida', rated: p.rated };
      });
      return [...state.bookings].sort((a, b) => b.createdAt - a.createdAt).concat(past);
    },
    bookingById: (id) => app.bookings().find((b) => b.id === id),
    addBooking: (b) => update((s) => ({ bookings: [...s.bookings, b] })),
    updateBooking: (id, patch) => update((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
    addMyCar: (c) => update((s) => ({ myCars: [...s.myCars, c] })),
    updateMyCar: (id, patch) => update((s) => ({ myCars: s.myCars.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
    toggleFav: (id) => update((s) => ({ favorites: s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [...s.favorites, id] })),
    showOnMap: (id) => {
      const c = allCars.find((x) => x.id === id);
      if (c && c.mine && !c.active) update((s) => ({ myCars: s.myCars.map((x) => (x.id === id ? { ...x, active: true } : x)) }));
      update((s) => ({ search: { ...s.search, placeId: 'pinheiros' } }));
      setStack([]); setTab('explore'); setFocusReq({ id, at: Date.now() });
    },
    finishOnboarding: (to) => { update(() => ({ onboarded: true })); setTab(to); },
    reset: () => { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } setState(initialState()); setStack([]); setTab('explore'); setMe(null); }
  };

  const top = stack[stack.length - 1];
  const TabScreen = TABS.find((t) => t.id === tab).Screen;

  let body;
  if (!state.onboarded) {
    body = <Welcome app={app} />;
  } else {
    body = (
      <>
        <div className={cx('tab-layer', stack.length && 'covered')} aria-hidden={stack.length ? true : undefined}>
          <TabScreen app={app} key={tab} />
          <nav className="tabbar" aria-label="Navegação principal">
            {TABS.map((t) => (
              <button key={t.id} type="button" className={cx('tab', tab === t.id && 'tab-on')} aria-current={tab === t.id ? 'page' : undefined} onClick={() => nav.tab(t.id)}>
                <G.Icon name={t.icon} size={22} strokeWidth={tab === t.id ? 2 : 1.75} />
                <span>{t.label}</span>
                {t.id === 'trips' && state.bookings.some((b) => b.status === 'confirmada' || b.status === 'andamento') ? <span className="tab-dot" aria-label="viagem ativa" /> : null}
              </button>
            ))}
          </nav>
        </div>
        {stack.map((r, i) => {
          const Screen = ROUTES[r.name];
          return (
            <div key={r.key} className={cx('stack-layer', i < stack.length - 1 && 'covered')} aria-hidden={i < stack.length - 1 ? true : undefined}>
              <Screen app={app} params={r.params} />
            </div>
          );
        })}
      </>
    );
  }

  const device = (
    <div className="device" style={framed ? { transform: `scale(${scale})` } : undefined}>
      <ArtDefs />
      {body}
      <Toast message={toastMsg} />
    </div>
  );
  if (!framed) return device;
  return (
    <div className="stage">
      <aside className="pitch">
        <p className="pitch-name">Giro</p>
        <p className="pitch-line">Carros parados viram renda. Alugue o carro de um vizinho, por hora.</p>
        <ul className="pitch-list">
          <li><G.Icon name="map" size={18} />Explore o mapa e escolha um carro</li>
          <li><G.Icon name="wallet" size={18} />Reserve e pague com Pix</li>
          <li><G.Icon name="camera" size={18} />Faça a vistoria e comece a viagem</li>
          <li><G.Icon name="car" size={18} />Em Meus carros, anuncie o seu</li>
        </ul>
        <p className="pitch-foot">Protótipo navegável · dados de demonstração</p>
      </aside>
      <div className="device-slot" style={{ width: 390 * scale, height: 844 * scale }}>{device}</div>
    </div>
  );
}

/* ---------- Welcome ---------- */
function Welcome({ app }) {
  const sample = [CARS[5], CARS[0], CARS[6]];
  return (
    <div className="screen welcome">
      <div className="welcome-art" aria-hidden="true">
        {sample.map((c, i) => <CarArt key={c.id} car={c} className={'welcome-car welcome-car-' + i} />)}
      </div>
      <div className="welcome-text">
        <h1 className="welcome-name">Giro</h1>
        <p className="welcome-line">Alugue o carro de quem mora perto, por hora. Ou ganhe com o seu, que passa o dia parado.</p>
      </div>
      <footer className="screen-foot stack welcome-foot">
        <G.Button size="lg" block onClick={() => app.finishOnboarding('explore')}>Quero alugar um carro</G.Button>
        <G.Button size="lg" block variant="secondary" onClick={() => app.finishOnboarding('host')}>Quero ganhar com meu carro</G.Button>
        <p className="foot-note">Ao continuar, você aceita os Termos de uso e a Política de privacidade.</p>
      </footer>
    </div>
  );
}

/* ---------- Profile ---------- */
function Profile({ app }) {
  const { state } = app;
  return (
    <div className="screen tab-screen">
      <header className="tab-head"><h1 className="display">Perfil</h1></header>
      <div className="scroll">
        <div className="pad profile-head">
          <Avatar name={USER.name} size={64} />
          <div className="row-text">
            <span className="title-md">{USER.name}</span>
            <span className="row-sub">No Giro desde {USER.memberSince} · ★ {G.formatRating(USER.rating)}</span>
          </div>
        </div>
        <div className="pad"><G.Badge tone="accent" icon="badge-check">CNH e identidade verificadas</G.Badge></div>
        <Section title="Conta">
          <Row icon="calendar" label="Viagens feitas" value={String(USER.trips + state.bookings.filter((b) => b.status === 'concluida').length)} />
          <Row icon="star" label="Favoritos" value={String(state.favorites.length)} />
          <Row icon="credit-card" label="Pagamento" sub={`Pix · ${USER.card}`} onClick={() => app.toast('Formas de pagamento')} />
          <Row icon="bell" label="Notificações" sub="Pedidos, mensagens e lembretes" onClick={() => app.toast('Notificações ativadas')} />
          <Row icon="circle-help" label="Ajuda" sub="Atendimento 24 h no chat" onClick={() => app.toast('Atendimento 24 h no chat')} />
        </Section>
        <Section title="Aparência">
          <div className="segmented flush" role="radiogroup" aria-label="Tema">
            {[['auto', 'Automático'], ['light', 'Claro'], ['dark', 'Escuro']].map(([k, l]) => (
              <button key={k} role="radio" aria-checked={state.theme === k} onClick={() => app.setTheme(k)}>{l}</button>
            ))}
          </div>
        </Section>
        <Section title="Demonstração">
          <p className="note">Este é um protótipo navegável com dados fictícios. Nenhum pagamento é cobrado.</p>
          <G.Button variant="secondary" icon="rotate-ccw" onClick={() => { app.reset(); }}>Reiniciar demonstração</G.Button>
        </Section>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
