'use client';

/**
 * Panel administrativo RuedaJusta — ruta: /panel
 *
 * Seguridad (dos capas):
 * 1. Esta página exige iniciar sesión con Supabase Auth y solo acepta ADMIN_EMAIL.
 * 2. La capa real está en la base de datos: la función rj_admin_dashboard()
 *    (SECURITY DEFINER) rechaza a cualquier usuario cuyo correo no sea
 *    admin@ruedajusta.com. Aunque alguien encuentre esta URL, la base no
 *    le entrega ni un solo dato.
 *
 * La contraseña NO vive en este código: se define al crear el usuario en
 * Supabase → Authentication → Users → Add user.
 */

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const ADMIN_EMAIL = 'admin@ruedajusta.com';

type Dash = {
  generado_en: string;
  totales: Record<string, number>;
  hoy: Record<string, number>;
  ultimos_7d: Record<string, number>;
  embudo: Record<string, number>;
  mediana_horas_primera_oferta: number | null;
  ofertas_sin_responder_24h: number;
  sin_ofertas: {
    entre_2_y_6h: number;
    entre_6_y_24h: number;
    mas_24h: number;
    detalle: {
      vehiculo_id: string;
      vehiculo: string;
      precio: number;
      ciudad: string | null;
      horas_sin_oferta: number;
      vendedor: string;
      telefono: string | null;
    }[];
  };
  serie_14d: { fecha: string; vehiculos: number; busquedas: number; ofertas: number }[];
  top_ciudades: { ciudad: string; vehiculos: number }[];
};

const css = `
  .rjp{--asfalto:#14181F;--asfalto2:#1D2430;--amarillo:#F6B31B;--nube:#F1F3F6;--tinta:#12151B;--gris:#6B7482;--borde:#E4E7EC;--rojo:#E5484D;--naranja:#F76B15;--verde:#22C05C;
    font-family:'Poppins',system-ui,sans-serif;background:var(--nube);min-height:100vh;color:var(--tinta)}
  .rjp *{box-sizing:border-box}
  .rjp .wrap{max-width:1180px;margin:0 auto;padding:0 24px}
  .rjp header{background:var(--asfalto);color:#fff;padding:16px 0}
  .rjp .head-in{display:flex;align-items:center;justify-content:space-between;gap:16px}
  .rjp .marca{font-weight:800;letter-spacing:.22em;font-size:1rem}
  .rjp .marca span{color:var(--amarillo)}
  .rjp .head-in small{color:#97A0AF;display:block;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;margin-top:2px}
  .rjp .acciones{display:flex;gap:10px}
  .rjp button{font-family:inherit;cursor:pointer;border:none;border-radius:10px;font-weight:600;font-size:.85rem;padding:10px 18px}
  .rjp .b-am{background:var(--amarillo);color:var(--tinta)}
  .rjp .b-gh{background:transparent;color:#C6CCD6;border:1.5px solid rgba(255,255,255,.25)}
  .rjp main{padding:34px 0 60px}
  .rjp h2{font-size:1.05rem;font-weight:700;margin:34px 0 14px}
  .rjp .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px}
  .rjp .kpi{background:#fff;border-radius:16px;padding:18px 20px;border:1px solid var(--borde)}
  .rjp .kpi .v{font-size:1.9rem;font-weight:800;line-height:1.1}
  .rjp .kpi .l{color:var(--gris);font-size:.8rem;margin-top:4px}
  .rjp .kpi .d{font-size:.74rem;color:var(--verde);font-weight:600;margin-top:6px}
  .rjp .grid2{display:grid;grid-template-columns:1.2fr .8fr;gap:14px}
  .rjp .tarjeta{background:#fff;border-radius:16px;border:1px solid var(--borde);padding:22px}
  .rjp .embudo-fila{display:flex;align-items:center;gap:12px;margin:10px 0}
  .rjp .embudo-fila .et{flex:0 0 210px;font-size:.85rem;color:var(--gris)}
  .rjp .barra{flex:1;height:26px;background:var(--nube);border-radius:8px;overflow:hidden}
  .rjp .barra i{display:block;height:100%;background:var(--amarillo);border-radius:8px}
  .rjp .embudo-fila b{flex:0 0 44px;text-align:right;font-size:.9rem}
  .rjp .alertas{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .rjp .alerta{border-radius:16px;padding:18px 20px;color:#fff}
  .rjp .alerta .v{font-size:2rem;font-weight:800}
  .rjp .alerta .l{font-size:.8rem;opacity:.92;margin-top:4px}
  .rjp .a-2{background:#B98514}.rjp .a-6{background:var(--naranja)}.rjp .a-24{background:var(--rojo)}
  .rjp table{width:100%;border-collapse:collapse;font-size:.85rem}
  .rjp th{text-align:left;color:var(--gris);font-weight:600;font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;padding:8px 10px;border-bottom:1px solid var(--borde)}
  .rjp td{padding:10px;border-bottom:1px solid var(--nube)}
  .rjp .pill{display:inline-block;padding:3px 10px;border-radius:999px;font-weight:700;font-size:.75rem;color:#fff}
  .rjp .insight{display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--nube);font-size:.9rem;line-height:1.55}
  .rjp .insight:last-child{border-bottom:none}
  .rjp .punto{flex:0 0 10px;height:10px;border-radius:50%;background:var(--amarillo);margin-top:6px}
  .rjp .serie{display:flex;align-items:flex-end;gap:6px;height:120px;margin-top:10px}
  .rjp .dia{flex:1;display:flex;flex-direction:column;justify-content:flex-end;gap:2px}
  .rjp .dia i{display:block;border-radius:3px 3px 0 0;min-height:2px}
  .rjp .leyenda{display:flex;gap:16px;font-size:.75rem;color:var(--gris);margin-top:10px}
  .rjp .leyenda i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:-1px}
  /* Login */
  .rjp .login{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--asfalto);padding:24px}
  .rjp .login-card{background:#fff;border-radius:18px;padding:38px 34px;width:100%;max-width:400px}
  .rjp .login-card h1{font-size:1.3rem;font-weight:800;margin:14px 0 4px}
  .rjp .login-card p{color:var(--gris);font-size:.88rem;margin-bottom:22px}
  .rjp input{width:100%;font-family:inherit;font-size:.95rem;padding:13px 15px;border:1.5px solid var(--borde);border-radius:10px;margin-bottom:12px;outline:none}
  .rjp input:focus{border-color:var(--amarillo)}
  .rjp .login-card button{width:100%;padding:13px;font-size:.95rem}
  .rjp .err{background:#FDECEC;color:var(--rojo);border-radius:10px;padding:10px 14px;font-size:.85rem;margin-bottom:12px}
  @media(max-width:860px){.rjp .grid2,.rjp .alertas{grid-template-columns:1fr}.rjp .embudo-fila .et{flex-basis:130px}}
`;

function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="27" r="14" stroke="#F6B31B" strokeWidth="7" />
      <g stroke="#F6B31B" strokeWidth="6" strokeLinecap="round">
        <line x1="6" y1="53" x2="16" y2="53" />
        <line x1="27" y1="53" x2="37" y2="53" />
        <line x1="48" y1="53" x2="58" y2="53" />
      </g>
    </svg>
  );
}

export default function Panel() {
  const [sesion, setSesion] = useState<'cargando' | 'fuera' | 'dentro'>('cargando');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [datos, setDatos] = useState<Dash | null>(null);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  const cargarDatos = useCallback(async () => {
    setCargandoDatos(true);
    const { data, error: e } = await supabase.rpc('rj_admin_dashboard');
    if (e) setError('No se pudo cargar el panel: ' + e.message);
    else setDatos(data as Dash);
    setCargandoDatos(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email === ADMIN_EMAIL) {
        setSesion('dentro');
        cargarDatos();
      } else {
        setSesion('fuera');
      }
    });
  }, [cargarDatos]);

  const entrar = async () => {
    setError('');
    const { data, error: e } = await supabase.auth.signInWithPassword({
      email: correo.trim(),
      password: clave,
    });
    if (e) return setError('Credenciales incorrectas.');
    if (data.user?.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      return setError('Esta cuenta no tiene acceso al panel.');
    }
    setSesion('dentro');
    cargarDatos();
  };

  const salir = async () => {
    await supabase.auth.signOut();
    setDatos(null);
    setSesion('fuera');
  };

  /* ---------- Login ---------- */
  if (sesion !== 'dentro') {
    return (
      <div className="rjp">
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="login">
          <div className="login-card">
            <Logo />
            <h1>Panel RuedaJusta</h1>
            <p>Acceso exclusivo del administrador.</p>
            {error && <div className="err">{error}</div>}
            <input
              type="email"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && entrar()}
              autoComplete="current-password"
            />
            <button className="b-am" onClick={entrar} disabled={sesion === 'cargando'}>
              {sesion === 'cargando' ? 'Verificando…' : 'Entrar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Dashboard ---------- */
  const t = datos?.totales ?? {};
  const h = datos?.hoy ?? {};
  const s7 = datos?.ultimos_7d ?? {};
  const em = datos?.embudo ?? {};
  const so = datos?.sin_ofertas;
  const maxEmbudo = Math.max(em.publicados ?? 0, 1);
  const serie = datos?.serie_14d ?? [];
  const maxSerie = Math.max(...serie.map((d) => Math.max(d.vehiculos, d.busquedas, d.ofertas)), 1);

  const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);

  const insights: string[] = [];
  if (datos) {
    if ((so?.mas_24h ?? 0) > 0)
      insights.push(
        `${so!.mas_24h} vehículo(s) llevan más de 24 horas sin recibir una sola oferta. Contacta a esos vendedores: casi siempre es precio fuera de mercado o fotos débiles.`
      );
    const pOferta = pct(em.con_oferta ?? 0, em.publicados ?? 0);
    if ((em.publicados ?? 0) > 0)
      insights.push(
        pOferta >= 60
          ? `${pOferta}% de las publicaciones reciben al menos una oferta: la demanda está respondiendo bien.`
          : `Solo ${pOferta}% de las publicaciones reciben ofertas. Hay que traer más compradores (o revisar la calidad de las publicaciones).`
      );
    if ((datos.ofertas_sin_responder_24h ?? 0) > 0)
      insights.push(
        `${datos.ofertas_sin_responder_24h} oferta(s) llevan más de 24 horas sin respuesta del vendedor. El comprador se enfría rápido: envíales un recordatorio.`
      );
    if (datos.mediana_horas_primera_oferta != null)
      insights.push(
        `La primera oferta tarda ~${datos.mediana_horas_primera_oferta} h en llegar. Todo vehículo que supere ese tiempo sin ofertas merece un empujón (destacarlo o ajustar precio).`
      );
    if ((em.chats_abiertos ?? 0) > 0)
      insights.push(
        `${em.chats_negociando ?? 0} de ${em.chats_abiertos} chats tienen negociación real (3+ mensajes). ${
          pct(em.chats_negociando ?? 0, em.chats_abiertos ?? 0) >= 50
            ? 'Buena señal: los tratos avanzan.'
            : 'Muchos chats mueren al abrirse: valdría un mensaje sugerido de arranque.'
        }`
      );
    const va = t.vehiculos_activos ?? 0;
    const ba = t.busquedas_activas ?? 0;
    if (va + ba > 0)
      insights.push(
        ba > va
          ? `Hay más búsquedas activas (${ba}) que vehículos activos (${va}): falta inventario. Empuja la captación de vendedores.`
          : `Hay más vehículos activos (${va}) que búsquedas activas (${ba}): falta demanda. Empuja la captación de compradores.`
      );
  }

  return (
    <div className="rjp">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <header>
        <div className="wrap head-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Logo />
            <div>
              <div className="marca">
                RUEDA<span>JUSTA</span>
              </div>
              <small>Panel administrativo</small>
            </div>
          </div>
          <div className="acciones">
            <button className="b-am" onClick={cargarDatos} disabled={cargandoDatos}>
              {cargandoDatos ? 'Actualizando…' : 'Actualizar'}
            </button>
            <button className="b-gh" onClick={salir}>
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="wrap">
        {error && <div className="err" style={{ marginTop: 20 }}>{error}</div>}

        <h2>Resumen general</h2>
        <div className="kpis">
          <div className="kpi"><div className="v">{t.vehiculos_activos ?? '—'}</div><div className="l">Vehículos en venta (activos)</div><div className="d">+{s7.vehiculos ?? 0} esta semana · +{h.vehiculos ?? 0} hoy</div></div>
          <div className="kpi"><div className="v">{t.busquedas_activas ?? '—'}</div><div className="l">Búsquedas de compra activas</div><div className="d">+{s7.busquedas ?? 0} esta semana · +{h.busquedas ?? 0} hoy</div></div>
          <div className="kpi"><div className="v">{t.ofertas ?? '—'}</div><div className="l">Ofertas recibidas (total)</div><div className="d">+{s7.ofertas ?? 0} esta semana · +{h.ofertas ?? 0} hoy</div></div>
          <div className="kpi"><div className="v">{t.chats ?? '—'}</div><div className="l">Chats abiertos</div><div className="d">+{s7.chats ?? 0} esta semana</div></div>
          <div className="kpi"><div className="v">{t.usuarios ?? '—'}</div><div className="l">Usuarios registrados</div><div className="d">+{s7.usuarios ?? 0} esta semana</div></div>
          <div className="kpi"><div className="v">{t.ofertas_aceptadas ?? '—'}</div><div className="l">Ofertas aceptadas</div><div className="d">{pct(t.ofertas_aceptadas ?? 0, t.ofertas ?? 0)}% de aceptación</div></div>
        </div>

        <h2>⚠️ Vehículos sin recibir ofertas</h2>
        <div className="alertas">
          <div className="alerta a-2"><div className="v">{so?.entre_2_y_6h ?? '—'}</div><div className="l">Entre 2 y 6 horas sin ofertas · vigilar</div></div>
          <div className="alerta a-6"><div className="v">{so?.entre_6_y_24h ?? '—'}</div><div className="l">Entre 6 y 24 horas sin ofertas · dar un empujón</div></div>
          <div className="alerta a-24"><div className="v">{so?.mas_24h ?? '—'}</div><div className="l">Más de 24 horas sin ofertas · actuar ya</div></div>
        </div>

        {(so?.detalle?.length ?? 0) > 0 && (
          <div className="tarjeta" style={{ marginTop: 14 }}>
            <table>
              <thead>
                <tr><th>Vehículo</th><th>Precio</th><th>Ciudad</th><th>Horas sin oferta</th><th>Vendedor</th><th>Teléfono</th></tr>
              </thead>
              <tbody>
                {so!.detalle.map((v) => {
                  const hs = v.horas_sin_oferta;
                  const color = hs >= 24 ? 'var(--rojo)' : hs >= 6 ? 'var(--naranja)' : '#B98514';
                  return (
                    <tr key={v.vehiculo_id}>
                      <td><b>{v.vehiculo}</b></td>
                      <td>${Number(v.precio).toLocaleString('es-EC')}</td>
                      <td>{v.ciudad ?? '—'}</td>
                      <td><span className="pill" style={{ background: color }}>{Math.round(hs)} h</span></td>
                      <td>{v.vendedor || '—'}</td>
                      <td>{v.telefono ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid2" style={{ marginTop: 34 }}>
          <div className="tarjeta">
            <h2 style={{ margin: '0 0 6px' }}>Embudo del negocio</h2>
            {[
              ['Vehículos publicados', em.publicados],
              ['Con al menos una oferta', em.con_oferta],
              ['Con oferta aceptada', em.con_aceptada],
              ['Chats abiertos', em.chats_abiertos],
              ['Chats negociando (3+ mensajes)', em.chats_negociando],
            ].map(([et, v]) => (
              <div className="embudo-fila" key={et as string}>
                <span className="et">{et}</span>
                <span className="barra"><i style={{ width: `${pct((v as number) ?? 0, maxEmbudo)}%` }} /></span>
                <b>{(v as number) ?? 0}</b>
              </div>
            ))}
            <p style={{ color: 'var(--gris)', fontSize: '.82rem', marginTop: 14 }}>
              Mediana hasta la primera oferta:{' '}
              <b style={{ color: 'var(--tinta)' }}>
                {datos?.mediana_horas_primera_oferta != null ? `${datos.mediana_horas_primera_oferta} h` : 'sin datos aún'}
              </b>
            </p>
          </div>

          <div className="tarjeta">
            <h2 style={{ margin: '0 0 6px' }}>Insights para decidir</h2>
            {insights.length === 0 && <p style={{ color: 'var(--gris)', fontSize: '.9rem' }}>Aún no hay suficiente actividad para generar insights.</p>}
            {insights.map((i, n) => (
              <div className="insight" key={n}><span className="punto" />{i}</div>
            ))}
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 14 }}>
          <div className="tarjeta">
            <h2 style={{ margin: '0 0 6px' }}>Actividad · últimos 14 días</h2>
            <div className="serie">
              {serie.map((d) => (
                <div className="dia" key={d.fecha} title={`${d.fecha}: ${d.vehiculos} vehículos, ${d.busquedas} búsquedas, ${d.ofertas} ofertas`}>
                  <i style={{ height: `${(d.ofertas / maxSerie) * 100}%`, background: '#22C05C' }} />
                  <i style={{ height: `${(d.busquedas / maxSerie) * 100}%`, background: '#1D2430' }} />
                  <i style={{ height: `${(d.vehiculos / maxSerie) * 100}%`, background: '#F6B31B' }} />
                </div>
              ))}
            </div>
            <div className="leyenda">
              <span><i style={{ background: '#F6B31B' }} />Vehículos</span>
              <span><i style={{ background: '#1D2430' }} />Búsquedas</span>
              <span><i style={{ background: '#22C05C' }} />Ofertas</span>
            </div>
          </div>

          <div className="tarjeta">
            <h2 style={{ margin: '0 0 6px' }}>Ciudades con más inventario</h2>
            {(datos?.top_ciudades ?? []).length === 0 && <p style={{ color: 'var(--gris)', fontSize: '.9rem' }}>Sin datos aún.</p>}
            {(datos?.top_ciudades ?? []).map((c) => (
              <div className="embudo-fila" key={c.ciudad}>
                <span className="et">{c.ciudad}</span>
                <span className="barra"><i style={{ width: `${pct(c.vehiculos, datos!.top_ciudades[0].vehiculos)}%` }} /></span>
                <b>{c.vehiculos}</b>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: 'var(--gris)', fontSize: '.78rem', marginTop: 30 }}>
          Datos generados: {datos ? new Date(datos.generado_en).toLocaleString('es-EC') : '—'} · Fuente: Supabase (rj_vehiculos, rj_busquedas, rj_ofertas, rj_chats, rj_mensajes, rj_perfiles)
        </p>
      </main>
    </div>
  );
}
