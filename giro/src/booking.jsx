import { G, cx, brl, brl0, rangeText, startOf, hoursText, firstName, longDate, hhmm, addHours, code } from './util.js';
import { CarArt, TopBar, Section, Row, Radio, Stars, Avatar, DemoQR, useNow } from './components.jsx';
import { CONFIG, REVIEWS, RULES, USER } from './data.js';

const { useState, useEffect } = React;

export function priceFor(car, hours, protection) {
  const p = CONFIG.protection[protection || 'basica'];
  const r = G.calcPrice({ rate: car.price, hours, dailyCap: car.dailyCap, protectionPerHour: p.perHour, feeRate: CONFIG.feeRate });
  r.items = r.items.map((it) => (it.label === 'Proteção básica' ? { label: p.label, value: it.value } : it));
  return r;
}

/* ---------- Car page ---------- */
export function CarDetail({ app, params }) {
  const { nav, state } = app;
  const car = app.carById(params.id);
  const [hours, setHours] = useState(state.search.hours);
  const fav = state.favorites.includes(car.id);
  const price = priceFor(car, hours, 'basica');
  const start = startOf(state.search);
  const features = [
    { icon: 'cog', label: car.transmission },
    { icon: 'users', label: car.seats + ' lugares' },
    { icon: car.energy === 'Elétrico' ? 'zap' : 'fuel', label: car.range || car.energy },
    { icon: 'key-round', label: car.pickup }
  ];
  return (
    <div className="screen">
      <div className="scroll">
        <div className="hero">
          <TopBar transparent onBack={nav.pop} right={
            <G.IconButton variant="floating" icon="star" label={fav ? 'Remover dos favoritos' : 'Salvar nos favoritos'} onClick={() => { app.toggleFav(car.id); app.toast(fav ? 'Removido dos favoritos' : 'Salvo nos favoritos'); }} className={fav ? 'fav-on' : ''} />
          } />
          <CarArt car={car} className="hero-art" />
          <span className="hero-tag">{car.colorName} · {car.year}</span>
        </div>
        <div className="pad">
          <h1 className="car-title">{car.model} <span className="muted">{car.year}</span></h1>
          <p className="car-sub">
            <G.Icon name="star" size={15} filled strokeWidth={0} /> {G.formatRating(car.rating)} · {car.trips} viagens · {G.formatDistance(car.distance)} de você
          </p>
          <div className="badges">
            {car.mine ? <G.Badge tone="accent" icon="key-round">Seu anúncio</G.Badge> : car.unavailable ? <G.Badge tone="danger" icon="clock">Indisponível nesse horário</G.Badge> : <G.Badge tone="accent" icon="badge-check">Confirmação na hora</G.Badge>}
            <G.Badge icon="shield-check">Proteção incluída</G.Badge>
          </div>
        </div>

        <Section>
          <ul className="features">
            {features.map((f) => <li key={f.label}><G.Icon name={f.icon} size={20} /><span>{f.label}</span></li>)}
          </ul>
        </Section>

        <Section title="Anfitriã ou anfitrião">
          <div className="host">
            <Avatar name={car.owner} size={48} />
            <div className="row-text">
              <span className="row-label">{car.owner}</span>
              <span className="row-sub">No Giro desde {car.ownerSince} · responde em {car.ownerResp}</span>
            </div>
            <G.Icon name="badge-check" size={22} title="Identidade verificada" style={{ color: 'var(--accent-ink)' }} />
          </div>
        </Section>

        <Section title="Retirada e devolução">
          <Row icon="map-pin" label={car.street} sub="Endereço exato liberado após a reserva" />
          <Row icon="key-round" label={car.pickup} sub={car.pickup === 'Cofre de chave' ? 'Código do cofre enviado no app' : car.pickup === 'Chave na portaria' ? 'Avise na portaria que é reserva Giro' : 'Combine o horário pelo chat'} />
        </Section>

        <Section title="Duração">
          <G.Stepper label="Horas" hint={rangeText(start, hours)} value={hours} min={1} max={CONFIG.maxHours} onChange={setHours} format={hoursText} />
          <p className="note">Diária máxima de {brl0(car.dailyCap)}: a partir de {Math.ceil(car.dailyCap / car.price)} h no mesmo dia, você paga só a diária.</p>
        </Section>

        <Section title={`Avaliações · ${G.formatRating(car.rating)}`}>
          {REVIEWS.map((r) => (
            <div className="review" key={r.name}>
              <div className="review-head"><Avatar name={r.name} size={32} /><span className="row-text"><span className="row-label">{r.name}</span><span className="row-sub">{r.when}</span></span><Stars value={r.stars} size={12} /></div>
              <p>{r.text}</p>
            </div>
          ))}
        </Section>

        <Section title="Regras">
          <ul className="rules">{RULES.map((r) => <li key={r}><G.Icon name="check" size={16} />{r}</li>)}</ul>
        </Section>
      </div>
      <footer className="screen-foot foot-split">
        <div className="foot-price">
          <span className="foot-price-main">{brl0(car.price)}<span className="muted"> /hora</span></span>
          <span className="foot-price-sub">{brl(price.total)} por {hoursText(hours)}</span>
        </div>
        {car.mine
          ? <G.Button size="lg" variant="secondary" onClick={() => nav.tab('host')}>Editar anúncio</G.Button>
          : (
            <G.Button size="lg" disabled={car.unavailable} variant={car.unavailable ? 'secondary' : 'primary'} onClick={() => { app.setSearch({ ...state.search, hours }); nav.push('checkout', { id: car.id }); }}>
              {car.unavailable ? 'Indisponível' : 'Reservar'}
            </G.Button>
          )}
      </footer>
    </div>
  );
}

/* ---------- Checkout ---------- */
export function Checkout({ app, params }) {
  const { nav, state } = app;
  const car = app.carById(params.id);
  const [protection, setProtection] = useState('basica');
  const [payment, setPayment] = useState('pix');
  const hours = state.search.hours;
  const start = startOf(state.search);
  const price = priceFor(car, hours, protection);
  return (
    <div className="screen">
      <TopBar title="Confirmar e pagar" onBack={nav.pop} />
      <div className="scroll">
        <div className="pad checkout-car">
          <span className="car-thumb car-thumb-lg"><CarArt car={car} ground={false} /></span>
          <div className="row-text">
            <span className="row-label strong">{car.model} {car.year}</span>
            <span className="row-sub">{car.owner} · {G.formatRating(car.rating)} ★</span>
            <span className="row-sub">{rangeText(start, hours)}</span>
          </div>
        </div>

        <Section title="Proteção">
          {Object.entries(CONFIG.protection).map(([k, p]) => (
            <Radio key={k} name="protection" checked={protection === k} onChange={() => setProtection(k)} label={p.label} sub={p.desc} right={k === 'basica' ? 'Incluída' : '+' + brl(p.perHour - CONFIG.protection.basica.perHour) + '/h'} />
          ))}
        </Section>

        <Section title="Pagamento">
          <Radio name="pay" checked={payment === 'pix'} onChange={() => setPayment('pix')} label="Pix" sub="Aprovação na hora" right={<G.Badge tone="accent">Recomendado</G.Badge>} />
          <Radio name="pay" checked={payment === 'card'} onChange={() => setPayment('card')} label="Cartão de crédito" sub={USER.card} />
        </Section>

        <Section title="Resumo">
          <G.PriceSummary items={price.items} total={price.total} note={`Cobrança só depois que ${firstName(car.owner)} confirmar. Cancelamento grátis até 2 h antes.`} />
        </Section>

        <Section>
          <Row icon="badge-check" tone="accent" label="CNH verificada" sub={`${USER.name} · categoria B`} />
        </Section>
      </div>
      <footer className="screen-foot">
        <G.Button size="lg" block onClick={() => nav.push('pay', { id: car.id, protection, payment, total: price.total })}>
          {payment === 'pix' ? 'Pagar com Pix' : 'Pagar com cartão'} · {brl(price.total)}
        </G.Button>
      </footer>
    </div>
  );
}

/* ---------- Payment ---------- */
export function Pay({ app, params }) {
  const { nav, state } = app;
  const car = app.carById(params.id);
  const [phase, setPhase] = useState(params.payment === 'pix' ? 'waiting' : 'processing');
  const now = useNow(1000);
  const [deadline] = useState(Date.now() + 10 * 60000);

  function finish() {
    if (phase === 'approved') return;
    setPhase('approved');
    const booking = {
      id: code(), carId: car.id, start: startOf(state.search).toISOString(), hours: state.search.hours,
      protection: params.protection, payment: params.payment, total: params.total, status: 'confirmada', createdAt: Date.now()
    };
    setTimeout(() => { app.addBooking(booking); nav.replace('confirmed', { bookingId: booking.id }); }, 900);
  }
  useEffect(() => {
    const t = setTimeout(finish, phase === 'processing' ? 1800 : 7000);
    return () => clearTimeout(t);
  }, []);

  const left = Math.max(0, deadline - now), mm = Math.floor(left / 60000), ss = Math.floor((left % 60000) / 1000);
  return (
    <div className="screen">
      <TopBar title={params.payment === 'pix' ? 'Pagamento via Pix' : 'Pagamento'} onBack={phase === 'approved' ? null : nav.pop} />
      <div className="scroll pay">
        {params.payment === 'pix' && phase !== 'approved' ? (
          <>
            <p className="pay-amount">{brl(params.total)}</p>
            <p className="muted center">Escaneie o QR no app do seu banco ou copie o código.</p>
            <div className="qr-wrap"><DemoQR seed={car.id.length * 97} /><span className="qr-demo">Demonstração</span></div>
            <G.Button variant="secondary" block icon="copy" onClick={() => app.toast('Código Pix copiado')}>Copiar código Pix</G.Button>
            <div className="waiting" role="status"><span className="spinner" aria-hidden="true" />Aguardando pagamento · expira em {mm}:{String(ss).padStart(2, '0')}</div>
            <G.Button variant="ghost" block onClick={finish}>Já paguei</G.Button>
          </>
        ) : (
          <div className="pay-status" role="status">
            {phase === 'approved'
              ? <span className="big-check"><G.Icon name="check" size={40} strokeWidth={2.25} /></span>
              : <span className="spinner spinner-lg" aria-hidden="true" />}
            <p className="pay-status-title">{phase === 'approved' ? 'Pagamento aprovado' : 'Processando pagamento'}</p>
            <p className="muted center">{phase === 'approved' ? `Enviando a reserva para ${firstName(car.owner)}…` : USER.card}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Confirmation ---------- */
export function Confirmed({ app, params }) {
  const { nav } = app;
  const b = app.bookingById(params.bookingId);
  const car = app.carById(b.carId);
  const start = new Date(b.start);
  return (
    <div className="screen confirmed">
      <div className="scroll pad">
        <div className="confirmed-hero">
          <span className="big-check"><G.Icon name="check" size={40} strokeWidth={2.25} /></span>
          <h1 className="display">Reserva confirmada</h1>
          <p className="muted">{firstName(car.owner)} aceitou seu pedido. Código <strong className="code">{b.id}</strong></p>
        </div>
        <CarArt car={car} className="confirmed-art" />
        <div className="card">
          <Row icon="calendar" label={longDate(start)} sub={`${hhmm(start)} – ${hhmm(addHours(start, b.hours))} · ${hoursText(b.hours)}`} />
          <Row icon="map-pin" label={car.street} sub={car.pickup} />
          <Row icon="shield-check" label={CONFIG.protection[b.protection].label} sub={(b.payment === 'pix' ? 'Pago com Pix' : 'Pago com cartão') + ' · ' + brl(b.total)} />
        </div>
      </div>
      <footer className="screen-foot stack">
        <G.Button size="lg" block onClick={() => nav.replace('booking', { bookingId: b.id })}>Ver reserva</G.Button>
        <G.Button variant="ghost" block onClick={() => nav.home('explore')}>Voltar ao mapa</G.Button>
      </footer>
    </div>
  );
}
