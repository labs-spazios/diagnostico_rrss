'use client';

import { useState } from 'react';


type ScoreMap = { a: number; c: number; i: number };
type Segment = 'A' | 'B';
type StepId = 'welcome' | number | 'contacto' | 'result';

interface Question {
  id: number;
  cat: string;
  txt: string;
  sub: string;
  opts: { txt: string; s: ScoreMap }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    cat: 'Punto de partida',
    txt: '¿Ya sos dueño?',
    sub: '',
    opts: [
      { txt: 'Sí, ya tengo algo propio',              s: { a: 2, c: 0, i: 2 } },
      { txt: 'No, alquilo y quiero dejar de pagar',   s: { a: 0, c: 0, i: 2 } },
      { txt: 'No, vivo con familia o en pareja',      s: { a: 0, c: 0, i: 1 } },
    ],
  },
  {
    id: 2,
    cat: 'Capacidad de pago',
    txt: '¿Podrías destinar $300.000 por mes a ser dueño?',
    sub: 'Con eso podemos evaluar tus opciones.',
    opts: [
      { txt: 'Sí, puedo sin problema',                s: { a: 0, c: 3, i: 0 } },
      { txt: 'Sí, pero tendría que acomodar algo',    s: { a: 0, c: 2, i: 0 } },
      { txt: 'No, por ahora está lejos',              s: { a: 0, c: 0, i: 0 } },
    ],
  },
  {
    id: 3,
    cat: 'Tu horizonte',
    txt: '¿Para cuándo te lo imaginás?',
    sub: '',
    opts: [
      { txt: 'Cuanto antes, lo estoy buscando',       s: { a: 0, c: 0, i: 3 } },
      { txt: 'En algún momento, no tengo apuro',      s: { a: 0, c: 0, i: 1 } },
      { txt: 'No lo tengo claro todavía',             s: { a: 0, c: 0, i: 0 } },
    ],
  },
];

const N = QUESTIONS.length;
const LETRAS = ['A', 'B', 'C', 'D'];

function calcSegmento(scores: ScoreMap): Segment {
  if (scores.c >= 2 || scores.a >= 3) return 'A';
  return 'B';
}

function calcProgress(step: StepId): number {
  if (step === 'welcome') return 0;
  if (step === 'contacto') return (4 / 5) * 100;
  if (step === 'result') return 100;
  return ((step as number) / 5) * 100;
}

function calcProgressLabel(step: StepId): { label: string; count: string } {
  if (step === 'welcome') return { label: 'Empezá acá', count: '' };
  if (step === 'contacto') return { label: 'Último paso', count: '' };
  if (step === 'result') return { label: 'Listo', count: '✓' };
  return { label: 'Pregunta', count: `${step} / ${N}` };
}

export default function Home() {
  const [step, setStep] = useState<StepId>('welcome');
  const [scores, setScores] = useState<ScoreMap>({ a: 0, c: 0, i: 0 });
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [nombre, setNombre] = useState('');
  const [tel, setTel] = useState('');
  const [segmento, setSegmento] = useState<Segment>('B');
  const [canal, setCanal] = useState<'wsp' | 'mail' | ''>('');
  const [mailB, setMailB] = useState('');
  const [canalConfirmed, setCanalConfirmed] = useState(false);

  function selectOption(qId: number, optIdx: number, isLast: boolean) {
    const q = QUESTIONS.find(q => q.id === qId)!;
    const newScores = { ...scores };
    if (selections[qId] !== undefined) {
      const prev = selections[qId];
      newScores.a -= q.opts[prev].s.a;
      newScores.c -= q.opts[prev].s.c;
      newScores.i -= q.opts[prev].s.i;
    }
    newScores.a += q.opts[optIdx].s.a;
    newScores.c += q.opts[optIdx].s.c;
    newScores.i += q.opts[optIdx].s.i;
    setScores(newScores);
    setSelections(prev => ({ ...prev, [qId]: optIdx }));

    setTimeout(() => {
      if (isLast) {
        setSegmento(calcSegmento(newScores));
        setStep('contacto');
      } else {
        setStep(qId + 1);
      }
    }, 320);
  }

  function goBack(current: number) {
    setStep(current <= 1 ? 'welcome' : current - 1);
  }

  function mostrarRes() {
    setStep('result');
  }

  function selectCanal(c: 'wsp' | 'mail') {
    setCanal(c);
    if (c === 'wsp') setMailB('');
  }

  const canalBHabilitado =
    canal === 'wsp' ||
    (canal === 'mail' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailB));

  const progress = calcProgress(step);
  const { label: progLabel, count: progCount } = calcProgressLabel(step);

  return (
    <div className="shell">
      {/* Panel izquierdo */}
      <div className="lado-izq">
        <div className="izq-content">
          <div className="izq-titulo">
            Descubrí en<br />1 minuto si<br />podés ser<br /><span>dueño hoy.</span>
          </div>
          <div className="izq-stat">
            <div className="izq-stat-num">+4.000</div>
            <div className="izq-stat-label">Dueños hechos</div>
          </div>
          <div className="izq-stat">
            <div className="izq-stat-num">20</div>
            <div className="izq-stat-label">formas de ser dueño. La mayoría conoce solo 2.</div>
          </div>
        </div>
        <div className="izq-footer">© 2026 Más Dueños · JMT</div>
      </div>

      {/* Panel derecho */}
      <div className="lado-der">
        {/* Logo */}
        <div className="der-logo-wrap">
          <img src="/logo-masdueños.png" alt="Más Dueños" className="der-logo" />
        </div>
        {/* Progress bar */}
        <div className="progress-area">
          <div className="progress-top">
            <span className="progress-label">{progLabel}</span>
            <span className="progress-count">{progCount}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Bienvenida: pide nombre */}
        {step === 'welcome' && (
          <div>
            <div className="paso-cat">3 preguntas · 1 minuto</div>
            <div className="paso-titulo">La mayoría cree que hay dos formas de ser dueño. Hay 20.</div>
            <div className="paso-sub">Este test te dice cuál aplica a tu situación.</div>
            <div className="form-fields">
              <div className="field-group">
                <label>Tu nombre</label>
                <input
                  type="text"
                  placeholder="Ej: Martín"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && nombre.trim().length >= 2 && setStep(1)}
                  autoFocus
                />
              </div>
            </div>
            <button
              className="btn"
              disabled={nombre.trim().length < 2}
              onClick={() => setStep(1)}
            >
              Arrancar →
            </button>
          </div>
        )}

        {/* Preguntas con auto-avance */}
        {typeof step === 'number' && step >= 1 && step <= N && (() => {
          const q = QUESTIONS[step - 1];
          const sel = selections[q.id];
          return (
            <div>
              <button className="btn-back" onClick={() => goBack(step)}>← Volver</button>
              <div className="paso-cat">{q.cat}</div>
              <div className="paso-titulo">{q.txt}</div>
              {q.sub ? <div className="paso-sub">{q.sub}</div> : <div className="paso-spacer" />}
              <div className="opciones">
                {q.opts.map((o, i) => (
                  <button
                    key={i}
                    className={`opcion${sel === i ? ' sel' : ''}`}
                    onClick={() => selectOption(q.id, i, step === N)}
                  >
                    <div className="op-letra">{LETRAS[i]}</div>
                    <div className="op-text">{o.txt}</div>
                  </button>
                ))}
              </div>
              <div className="auto-hint">Tocá una opción para continuar</div>
            </div>
          );
        })()}

        {/* Contacto: solo WhatsApp */}
        {step === 'contacto' && (
          <div>
            <div className="paso-cat">Ya casi</div>
            <div className="paso-titulo">{nombre}, tu resultado está listo.</div>
            <div className="paso-sub">Dejanos tu WhatsApp y te enviamos tu resultado ahora.</div>
            <div className="form-fields">
              <div className="field-group">
                <label>Tu WhatsApp</label>
                <input
                  type="tel"
                  placeholder="Ej: 1134567890"
                  value={tel}
                  onChange={e => setTel(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && tel.trim().length >= 8 && mostrarRes()}
                  autoFocus
                />
              </div>
            </div>
            <button
              className="btn"
              disabled={tel.trim().length < 8}
              onClick={mostrarRes}
            >
              Ver mi resultado →
            </button>
          </div>
        )}

        {/* Resultado A */}
        {step === 'result' && segmento === 'A' && (
          <div>
            <div className="res-badge rojo">Calificás para ser dueño hoy</div>
            <div className="res-titulo">{nombre}, tenés lo que necesitás para arrancar.</div>
            <div className="res-sub">En breve te escribe Maca, la asistente de Juan Manuel, para mostrarte el camino concreto.</div>
            <button className="btn-cta negro">Me interesa saber cómo →</button>
            <div className="res-nota">Maca se va a comunicar con vos pronto.</div>
          </div>
        )}

        {/* Resultado B */}
        {step === 'result' && segmento === 'B' && (
          <div>
            <div className="res-badge naranja">Tu camino existe</div>
            <div className="res-titulo">{nombre}, con $300.000 por mes hay al menos 3 formas de ser dueño.</div>
            <div className="res-sub">Todavía no llegaste a ese número — y eso tiene solución. Te mostramos cómo llegar y qué hacer mientras tanto.</div>
            <div className="res-datos">
              <div className="res-datos-title">Lo que te falta saber</div>
              <div className="res-dato">
                <span className="res-dato-label">Formas de ser dueño que existen</span>
                <span className="res-dato-val">20</span>
              </div>
              <div className="res-dato">
                <span className="res-dato-label">Formas que la mayoría conoce</span>
                <span className="res-dato-val">2</span>
              </div>
              <div className="res-dato">
                <span className="res-dato-label">Tu situación</span>
                <span className="res-dato-val">En construcción</span>
              </div>
            </div>
            <div className="paso-sub" style={{ marginBottom: '1rem' }}>
              ¿Por dónde preferís que te contemos cuál es tu camino?
            </div>
            <div className="canal-opciones">
              <button
                className={`canal-op${canal === 'wsp' ? ' sel' : ''}`}
                onClick={() => selectCanal('wsp')}
              >
                <div className="op-letra">W</div>
                <div>Por WhatsApp</div>
              </button>
              <button
                className={`canal-op${canal === 'mail' ? ' sel' : ''}`}
                onClick={() => selectCanal('mail')}
              >
                <div className="op-letra">@</div>
                <div>Por mail</div>
              </button>
            </div>
            {canal === 'mail' && (
              <div className="field-group" style={{ marginBottom: '1rem' }}>
                <label>Tu mail</label>
                <input
                  type="email"
                  placeholder="Ej: martin@gmail.com"
                  value={mailB}
                  onChange={e => setMailB(e.target.value)}
                  autoFocus
                />
              </div>
            )}
            {!canalConfirmed ? (
              <button
                className="btn-cta naranja"
                style={{ opacity: canalBHabilitado ? 1 : 0.3, pointerEvents: canalBHabilitado ? 'all' : 'none' }}
                onClick={() => setCanalConfirmed(true)}
              >
                Quiero saber cuál es mi camino →
              </button>
            ) : (
              <div style={{
                background: 'var(--rojo-light)',
                color: 'var(--rojo)',
                borderRadius: '10px',
                padding: '0.9rem',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '600',
              }}>
                Perfecto, te contactamos pronto.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
