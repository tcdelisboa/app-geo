import { G, cx, brl, hhmm, addHours, dayLabel, hoursText, firstName, longDate } from './util.js';
import { CarArt, TopBar, Section, Row, Stars, Avatar, useNow } from './components.jsx';
import { CONFIG } from './data.js';

const { useState, useEffect, useRef } = React;

const STATUS = {
  confirmada: { label: 'Confirmada', tone: 'accent', icon: 'check' },
  andamento: { label: 'Em andamento', tone: 'accent', icon: 'car' },
  concluida: { label: 'Concluída', tone: 'neutral', icon: 'check' },
  cancelada: { label: 'Cancelada', tone: 'danger', icon: 'x' }
};

export function Trips({ app }) {
  const { nav } = app;
  const [tab, setTab] = useState('next');
  const all = app.bookings();
  const next = all.filter((b) => b.status === 'confirmada' || b.status === 'andamento');
  const past = all.filter((b) => b.status === 'concluida' || b.status === 'cancelada');
  const list = tab === 'next' ? next : past;
  return (
    <div className="screen tab-screen">
      <header className="tab-head"><h1 className="display">Viagens</h1></header>
      <div className="segmented" role="tablist">
        <button role="tab" aria-selected={tab === 'next'} onClick={() => setTab('next')}>Próximas{next.length ? ` · ${next.length}` : ''}</button>
        <button role="tab" aria-selected={tab === 'past'} onClick={() => setTab('past')}>Anteriores</button>
      </div>
      <div className="scroll pad">
        {list.length ? list.map((b) => <TripCard key={b.id} app={app} b={b} />) : (
          <div className="empty-big">
            <span className="empty-icon"><G.Icon name="calendar" size={28} /></span>
            <p className="row-label">{tab === 'next' ? 'Nenhuma viagem marcada' : 'Nenhuma viagem ainda'}</p>
            <p className="muted">Carros de vizinhos a partir de R$ 12 por hora.</p>
            <G.Button onClick={() => nav.tab('explore')}>Encontrar um carro</G.Button>
          </div>
        )}
      </div>
    </div>
  );
}

function TripCard({ app, b }) {
  const car = app.carById(b.carId);
  const start = new Date(b.start), s = STATUS[b.status];
  return (
    <button type="button" className="trip" onClick={() => app.nav.push('booking', { bookingId: b.id })}>
      <span className="car-thumb car-thumb-lg"><CarArt car={car} ground={false} /></span>
      <span className="row-text">
        <span className="row-label strong">{car.model}</span>
        <span className="row-sub">{dayLabel(start)} · {hhmm(start)} – {hhmm(addHours(start, b.hours))}</span>
        <span className="trip-meta"><G.Badge tone={s.tone} icon={s.icon}>{s.label}</G.Badge><span className="muted">{brl(b.total)}</span></span>
      </span>
      <G.Icon name="chevron-right" size={18} className="row-chev" />
    </button>
  );
}

/* ---------- One booking ---------- */
export function Booking({ app, params }) {
  const { nav } = app;
  const b = app.bookingById(params.bookingId);
  const car = app.carById(b.carId);
  const now = useNow(1000);
  const [locked, setLocked] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const start = new Date(b.start), end = addHours(start, b.hours);
  const steps = ['confirmada', 'vistoria', 'andamento', 'concluida'];
  const idx = b.status === 'cancelada' ? -1 : b.status === 'andamento' ? 2 : b.status === 'concluida' ? 3 : 0;

  let live = null;
  if (b.status === 'andamento') {
    const from = Math.min(start.getTime(), b.startedAt), endAt = end.getTime(), left = Math.max(0, endAt - now);
    const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000), sec = Math.floor((left % 60000) / 1000);
    const pct = Math.max(2, Math.min(100, ((now - from) / (endAt - from)) * 100));
    live = (
      <div className="live">
        <span className="live-label">Devolução às {hhmm(new Date(endAt))}</span>
        <span className="live-time">{h ? `${h} h ` : ''}{String(m).padStart(2, '0')} min {String(sec).padStart(2, '0')} s</span>
        <span className="live-bar"><span style={{ width: pct + '%' }} /></span>
        <div className="live-actions">
          <G.Button variant="secondary" icon={locked ? 'lock-open' : 'lock'} onClick={() => { setLocked(!locked); app.toast(locked ? 'Carro destrancado' : 'Carro trancado'); }}>{locked ? 'Destrancar' : 'Trancar'}</G.Button>
          <G.Button variant="secondary" icon="navigation" onClick={() => app.toast('Abrindo rota no seu app de mapas')}>Rota</G.Button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <TopBar title="Sua reserva" sub={b.id} onBack={nav.pop} />
      <div className="scroll">
        <div className="pad booking-head">
          <CarArt car={car} className="booking-art" />
          <h2 className="car-title">{car.model} <span className="muted">{car.year}</span></h2>
          <G.Badge tone={STATUS[b.status].tone} icon={STATUS[b.status].icon}>{STATUS[b.status].label}</G.Badge>
        </div>
        {live}
        {b.status !== 'cancelada' ? (
          <ol className="timeline" aria-label="Etapas da reserva">
            {['Reservada', 'Vistoria', 'Em uso', 'Devolvida'].map((t, i) => (
              <li key={t} className={cx(i <= idx && 'done', i === idx + 1 && 'next')}><span className="tl-dot" />{t}</li>
            ))}
          </ol>
        ) : null}
        <Section title="Detalhes">
          <Row icon="calendar" label={longDate(start)} sub={`${hhmm(start)} – ${dayLabel(end, true) === 'hoje' || start.toDateString() === end.toDateString() ? '' : dayLabel(end, true) + ' '}${hhmm(end)} · ${hoursText(b.hours)}`} />
          <Row icon="map-pin" label={car.street + ', 412'} sub={car.pickup + (car.pickup === 'Cofre de chave' ? ' · código 4 8 1 7' : '')} />
          <Row icon="shield-check" label={CONFIG.protection[b.protection].label} sub={CONFIG.protection[b.protection].desc} />
          <Row icon={b.payment === 'pix' ? 'wallet' : 'credit-card'} label={brl(b.total)} sub={b.status === 'cancelada' ? 'Reembolso integral enviado' : b.payment === 'pix' ? 'Pago com Pix' : 'Pago com cartão'} />
        </Section>
        <Section title="Anfitriã ou anfitrião">
          <div className="host">
            <Avatar name={car.owner} size={44} />
            <div className="row-text"><span className="row-label">{car.owner}</span><span className="row-sub">Responde em {car.ownerResp}</span></div>
            <G.Button variant="secondary" icon="message-circle" onClick={() => nav.push('chat', { bookingId: b.id })}>Mensagem</G.Button>
          </div>
        </Section>
        {b.status === 'concluida' && b.rated ? (
          <Section title="Sua avaliação"><div className="rated"><Stars value={b.rated} size={18} /><span className="muted">Obrigado por avaliar</span></div></Section>
        ) : null}
        {b.status === 'confirmada' ? (
          <div className="pad">
            {confirmCancel ? (
              <div className="confirm-box">
                <p className="row-label">Cancelar esta reserva?</p>
                <p className="muted">Faltam mais de 2 horas: você recebe {brl(b.total)} de volta.</p>
                <div className="row-actions">
                  <G.Button variant="secondary" onClick={() => setConfirmCancel(false)}>Manter</G.Button>
                  <G.Button variant="ghost" className="danger-text" onClick={() => { app.updateBooking(b.id, { status: 'cancelada' }); setConfirmCancel(false); app.toast('Reserva cancelada. Reembolso a caminho.'); }}>Cancelar reserva</G.Button>
                </div>
              </div>
            ) : <G.Button variant="ghost" className="danger-text" onClick={() => setConfirmCancel(true)}>Cancelar reserva</G.Button>}
          </div>
        ) : null}
      </div>
      {b.status === 'confirmada' ? (
        <footer className="screen-foot"><G.Button size="lg" block icon="camera" onClick={() => nav.push('inspection', { bookingId: b.id })}>Fazer vistoria e retirar</G.Button></footer>
      ) : b.status === 'andamento' ? (
        <footer className="screen-foot"><G.Button size="lg" block onClick={() => nav.push('rate', { bookingId: b.id })}>Encerrar e devolver</G.Button></footer>
      ) : b.status === 'concluida' && !b.rated ? (
        <footer className="screen-foot"><G.Button size="lg" block onClick={() => nav.push('rate', { bookingId: b.id })}>Avaliar viagem</G.Button></footer>
      ) : null}
    </div>
  );
}

/* ---------- Inspection (pickup) ---------- */
const SHOTS = ['Frente', 'Traseira', 'Lado esquerdo', 'Lado direito'];
export function Inspection({ app, params }) {
  const { nav } = app;
  const b = app.bookingById(params.bookingId);
  const car = app.carById(b.carId);
  const [done, setDone] = useState({});
  const [fuel, setFuel] = useState(null);
  const [ok, setOk] = useState(false);
  const n = Object.values(done).filter(Boolean).length;
  const ready = n === SHOTS.length && fuel && ok;
  return (
    <div className="screen">
      <TopBar title="Vistoria de retirada" sub={`${n} de ${SHOTS.length} fotos`} onBack={nav.pop} />
      <div className="scroll pad">
        <p className="muted">Fotografe o carro antes de sair. As fotos protegem você e {firstName(car.owner)} em caso de dano.</p>
        <div className="shots">
          {SHOTS.map((s, i) => (
            <button key={s} type="button" className={cx('shot', done[s] && 'shot-done')} onClick={() => setDone((d) => ({ ...d, [s]: true }))} aria-label={(done[s] ? 'Refazer foto: ' : 'Tirar foto: ') + s}>
              {done[s]
                ? <><CarArt car={car} ground={false} className={cx('shot-art', i === 1 && 'flip', i >= 2 && 'zoom')} /><span className="shot-ok"><G.Icon name="check" size={14} strokeWidth={2.5} /></span></>
                : <G.Icon name="camera" size={24} />}
              <span className="shot-label">{s}</span>
            </button>
          ))}
        </div>
        <h2 className="label-title flush">{car.energy === 'Elétrico' ? 'Nível da bateria' : 'Nível do tanque'}</h2>
        <div className="hscroll flush">
          {['1/4', '1/2', '3/4', 'Cheio'].map((f) => <G.Chip key={f} selected={fuel === f} onClick={() => setFuel(f)}>{f}</G.Chip>)}
        </div>
        <label className="check">
          <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} />
          <span>Confirmo que o carro está como nas fotos</span>
        </label>
      </div>
      <footer className="screen-foot">
        <G.Button size="lg" block disabled={!ready} icon="lock-open" onClick={() => { app.updateBooking(b.id, { status: 'andamento', startedAt: Date.now(), fuel }); nav.pop(); app.toast('Carro liberado. Boa viagem!'); }}>
          {ready ? 'Liberar carro' : 'Complete a vistoria'}
        </G.Button>
      </footer>
    </div>
  );
}

/* ---------- Rating (return) ---------- */
const TAGS = ['Carro limpo', 'Retirada fácil', 'Bem conservado', 'Anfitrião atencioso', 'Pontual'];
export function Rate({ app, params }) {
  const { nav } = app;
  const b = app.bookingById(params.bookingId);
  const car = app.carById(b.carId);
  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState({});
  return (
    <div className="screen">
      <TopBar title="Como foi?" onBack={nav.pop} />
      <div className="scroll pad center-col">
        <CarArt car={car} className="rate-art" />
        <p className="row-label">Avalie o {car.model} de {firstName(car.owner)}</p>
        <div className="star-pick" role="radiogroup" aria-label="Nota">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} type="button" role="radio" aria-checked={stars === i} aria-label={i + (i === 1 ? ' estrela' : ' estrelas')} className={cx(i <= stars && 'on')} onClick={() => setStars(i)}>
              <G.Icon name="star" size={36} filled={i <= stars} strokeWidth={i <= stars ? 0 : 1.5} />
            </button>
          ))}
        </div>
        <div className="tag-wrap">
          {TAGS.map((t) => <G.Chip key={t} selected={!!tags[t]} onClick={() => setTags((x) => ({ ...x, [t]: !x[t] }))}>{t}</G.Chip>)}
        </div>
      </div>
      <footer className="screen-foot">
        <G.Button size="lg" block disabled={!stars} onClick={() => { app.updateBooking(b.id, { status: 'concluida', rated: stars }); nav.home('trips'); app.toast('Viagem encerrada. Obrigado!'); }}>
          {b.status === 'andamento' ? 'Devolver e enviar avaliação' : 'Enviar avaliação'}
        </G.Button>
      </footer>
    </div>
  );
}

/* ---------- Chat ---------- */
export function Chat({ app, params }) {
  const { nav } = app;
  const b = app.bookingById(params.bookingId);
  const car = app.carById(b.carId);
  const [msgs, setMsgs] = useState([
    { me: false, text: `Oi! Aqui é ${firstName(car.owner)}. Reserva confirmada.` },
    { me: false, text: car.pickup === 'Chave na portaria' ? 'É só avisar na portaria que veio buscar o carro do Giro.' : car.pickup === 'Cofre de chave' ? 'O código do cofre aparece na reserva. O carro fica na vaga 12.' : 'Me avisa uns 10 minutos antes que eu desço com a chave.' }
  ]);
  const [text, setText] = useState('');
  const end = useRef(null);
  useEffect(() => { end.current && end.current.scrollIntoView({ block: 'end' }); }, [msgs]);
  function send(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { me: true, text: t }]);
    setText('');
    setTimeout(() => setMsgs((m) => [...m, { me: false, text: 'Combinado. Qualquer coisa estou por aqui.' }]), 1400);
  }
  return (
    <div className="screen">
      <TopBar title={car.owner} sub={car.model + ' · ' + b.id} onBack={nav.pop} />
      <div className="scroll pad chat">
        {msgs.map((m, i) => <p key={i} className={cx('bubble', m.me && 'bubble-me')}>{m.text}</p>)}
        <span ref={end} />
      </div>
      <form className="screen-foot chat-form" onSubmit={send}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva uma mensagem" aria-label="Mensagem" />
        <G.IconButton type="submit" icon="send" label="Enviar" variant="floating" />
      </form>
    </div>
  );
}
