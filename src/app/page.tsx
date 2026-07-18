import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RuedaJusta | Compra y vende vehículos directo, sin comisiones · Ecuador",
  description:
    "Publica y vende tu vehículo, o busca uno y recibe ofertas instantáneas. Chatea directo y cierra el trato. Sin comisiones ni intermediarios. Ecuador.",
};

const css = `
  :root{
    --asfalto:#14181F;
    --asfalto-2:#1D2430;
    --amarillo:#F6B31B;
    --amarillo-hover:#FFC53D;
    --nube:#F1F3F6;
    --tinta:#12151B;
    --gris:#6B7482;
    --gris-borde:#E4E7EC;
    --radio:18px;
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{font-family:'Poppins',system-ui,sans-serif;background:#fff;color:var(--tinta);-webkit-font-smoothing:antialiased}
  a{text-decoration:none;color:inherit}
  .wrap{max-width:1160px;margin:0 auto;padding:0 24px}

  /* Firma: línea de carretera */
  .carretera{height:5px;background:repeating-linear-gradient(90deg,var(--amarillo) 0 40px,transparent 40px 72px);border-radius:3px;animation:rodar 2.6s linear infinite}
  @keyframes rodar{to{background-position:72px 0}}
  @media (prefers-reduced-motion:reduce){.carretera{animation:none}}

  /* Nav */
  nav{position:sticky;top:0;z-index:50;background:var(--asfalto);color:#fff}
  .nav-in{display:flex;align-items:center;justify-content:space-between;height:70px}
  .logo{display:flex;align-items:center;gap:11px}
  .logo svg{display:block}
  .marca{font-weight:800;font-size:1.1rem;letter-spacing:.24em;color:#fff}
  .marca span{color:var(--amarillo)}
  .nav-links{display:flex;align-items:center;gap:26px;font-size:.9rem;font-weight:500}
  .nav-links a.link{color:#C6CCD6;transition:color .2s}
  .nav-links a.link:hover{color:#fff}

  .btn{display:inline-block;background:var(--asfalto);color:#fff;font-weight:600;padding:14px 30px;border-radius:10px;transition:background .2s,transform .15s;text-align:center;font-size:.95rem}
  .btn:hover{background:#000;transform:translateY(-1px)}
  .btn:focus-visible,a:focus-visible{outline:3px solid var(--amarillo);outline-offset:3px}
  .btn.amarillo{background:var(--amarillo);color:var(--tinta);font-weight:700}
  .btn.amarillo:hover{background:var(--amarillo-hover)}
  .btn.sm{padding:10px 22px;font-size:.88rem}
  .link-sec{display:inline-block;font-weight:600;font-size:.92rem;border-bottom:2px solid var(--amarillo);padding-bottom:2px;margin-left:22px}

  /* Hero */
  .hero{padding:84px 0 96px}
  .split{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center}
  h1{font-size:clamp(2.3rem,4.6vw,3.4rem);font-weight:800;line-height:1.12;letter-spacing:-.015em}
  .hero .carretera{width:170px;margin:26px 0 30px}

  .widget{background:#fff;border:1px solid var(--gris-borde);border-radius:var(--radio);padding:14px;box-shadow:0 18px 44px rgba(18,21,27,.08);max-width:460px}
  .widget p.t{font-weight:700;font-size:1rem;padding:10px 12px 12px}
  .opcion{display:flex;align-items:center;gap:16px;padding:16px 14px;border-radius:12px;transition:background .15s}
  .opcion:hover{background:var(--nube)}
  .opcion .oico{width:46px;height:46px;background:var(--amarillo);border-radius:12px;display:flex;align-items:center;justify-content:center;flex:0 0 46px}
  .opcion b{font-size:1rem;display:block}
  .opcion small{color:var(--gris);font-size:.82rem}
  .opcion .flecha{margin-left:auto;font-weight:700;color:var(--tinta)}
  .widget .sep{height:1px;background:var(--gris-borde);margin:2px 12px}
  .widget .pie{padding:12px 12px 8px;font-size:.8rem;color:var(--gris)}
  .widget .pie b{color:var(--tinta);font-weight:600}

  .fig{background:var(--nube);border-radius:var(--radio);overflow:hidden}
  .fig svg{display:block;width:100%;height:auto}

  /* Secciones alternadas */
  .seccion{padding:96px 0}
  h2{font-size:clamp(1.8rem,3.4vw,2.5rem);font-weight:800;line-height:1.15;letter-spacing:-.01em}
  .seccion p.lead{color:var(--gris);font-size:1.06rem;line-height:1.7;margin:18px 0 30px;max-width:30rem}
  .check{list-style:none;display:grid;gap:10px;margin:0 0 32px}
  .check li{display:flex;gap:10px;align-items:flex-start;font-size:.95rem;line-height:1.55}
  .check li::before{content:"";flex:0 0 20px;height:20px;margin-top:2px;background:var(--amarillo);border-radius:6px;background-image:url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2312151B" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M5 12.5l4.5 4.5L19 7.5"/%3E%3C/svg%3E');background-size:13px;background-position:center;background-repeat:no-repeat}

  /* Cómo funciona */
  .nube-bg{background:var(--nube)}
  .flujo{display:grid;grid-template-columns:repeat(3,1fr);gap:34px;margin-top:56px}
  .paso{background:#fff;border-radius:var(--radio);padding:32px 28px}
  .paso .num{width:42px;height:42px;background:var(--asfalto);color:var(--amarillo);border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem}
  .paso h4{font-size:1.12rem;font-weight:700;margin:18px 0 8px}
  .paso p{color:var(--gris);font-size:.94rem;line-height:1.65}
  .candado{margin-top:34px;background:var(--asfalto);color:#fff;border-radius:var(--radio);padding:26px 30px;display:flex;gap:18px;align-items:flex-start}
  .candado svg{flex:0 0 26px;margin-top:2px}
  .candado p{color:#C6CCD6;font-size:.95rem;line-height:1.65}
  .candado b{color:#fff}

  /* Cifras */
  .oscuro{background:var(--asfalto);color:#fff}
  .cifras{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;text-align:center}
  .cifra .valor{font-size:clamp(2.4rem,5vw,3.4rem);font-weight:800;color:var(--amarillo);line-height:1}
  .cifra p{color:#C6CCD6;margin-top:12px;font-size:.95rem}

  /* CTA */
  .banda{background:var(--amarillo);color:var(--tinta);padding:80px 0;text-align:center}
  .banda h2{max-width:34rem;margin:0 auto}
  .banda .btn{margin-top:32px;padding:16px 40px;font-size:1rem}
  .banda p{margin-top:14px;font-size:.9rem;color:rgba(18,21,27,.72)}

  /* Footer */
  footer{background:var(--asfalto);color:#fff;padding:72px 0 46px}
  .foot-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:44px;align-items:start}
  footer .desc{color:#97A0AF;margin-top:16px;max-width:26rem;line-height:1.65;font-size:.95rem}
  .eyebrow{display:inline-block;font-size:.74rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--amarillo)}
  .contactos{display:grid;gap:14px;margin-top:20px}
  .contacto{display:flex;align-items:center;gap:12px;color:#C6CCD6;font-size:.95rem;transition:color .2s}
  .contacto:hover{color:#fff}
  .contacto .cico{width:38px;height:38px;border-radius:12px;background:var(--asfalto-2);display:flex;align-items:center;justify-content:center;flex:0 0 38px}
  .wsp{display:inline-flex;align-items:center;gap:10px;background:#22C05C;color:#fff;font-weight:700;padding:13px 26px;border-radius:10px;margin-top:26px;transition:background .2s}
  .wsp:hover{background:#1DA750}
  .legal{margin-top:54px;padding-top:24px;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;color:#97A0AF;font-size:.82rem}

  @media(max-width:920px){
    .split{grid-template-columns:1fr;gap:44px}
    .split.invertir .fig{order:-1}
    .flujo,.cifras,.foot-grid{grid-template-columns:1fr}
    .cifras{gap:38px}
    .nav-links a.link{display:none}
    .seccion,.hero{padding:60px 0}
    .widget{max-width:none}
  }
`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RuedaJusta",
  url: "https://ruedajusta.com",
  logo: "https://ruedajusta.com/icon.svg",
  description:
    "La red inteligente para comprar y vender vehículos en Ecuador. Sin comisiones ni intermediarios.",
  areaServed: "EC",
  email: "informacion@ruedajusta.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Palo Alto",
    addressRegion: "CA",
    addressCountry: "US",
  },
};

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />


<nav>
  <div className="wrap nav-in">
    <a href="#" className="logo" aria-label="RuedaJusta inicio">
      <svg width="36" height="36" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="27" r="14" stroke="#F6B31B" strokeWidth="7"/>
        <g stroke="#F6B31B" strokeWidth="6" strokeLinecap="round">
          <line x1="6" y1="53" x2="16" y2="53"/><line x1="27" y1="53" x2="37" y2="53"/><line x1="48" y1="53" x2="58" y2="53"/>
        </g>
      </svg>
      <span className="marca">RUEDA<span>JUSTA</span></span>
    </a>
    <div className="nav-links">
      <a className="link" href="#como-funciona">Cómo funciona</a>
      <a className="link" href="#contacto">Contáctanos</a>
      <a className="btn amarillo sm" href="https://app.ruedajusta.com">Regístrate</a>
    </div>
  </div>
</nav>

{/* HERO */}
<header className="hero">
  <div className="wrap split">
    <div>
      <h1>Compra y vende vehículos directo, sin comisiones.</h1>
      <div className="carretera" aria-hidden="true"></div>

      <div className="widget">
        <p className="t">¿Qué quieres hacer hoy?</p>
        <a className="opcion" href="https://app.ruedajusta.com">
          <span className="oico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12151B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l1.6-4.4A2 2 0 0 1 8.5 7h7a2 2 0 0 1 1.9 1.6L19 13"/><path d="M4 13h16a1 1 0 0 1 1 1v3h-2.2a1.8 1.8 0 0 1-3.6 0H8.8a1.8 1.8 0 0 1-3.6 0H3v-3a1 1 0 0 1 1-1z"/></svg></span>
          <span><b>Vender mi vehículo</b><small>Publícalo en menos de 20 segundos</small></span>
          <span className="flecha">→</span>
        </a>
        <div className="sep"></div>
        <a className="opcion" href="https://app.ruedajusta.com">
          <span className="oico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12151B" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></span>
          <span><b>Buscar un vehículo</b><small>Recibe ofertas instantáneas</small></span>
          <span className="flecha">→</span>
        </a>
        <p className="pie">Solo necesitas tu <b>correo</b>: te llega un código, lo confirmas y listo.</p>
      </div>
    </div>

    {/* Ilustración hero: el trato en la carretera */}
    <div className="fig" aria-hidden="true">
      <svg viewBox="0 0 560 560" xmlns="http://www.w3.org/2000/svg">
        <rect width="560" height="560" fill="#F1F3F6"/>
        <circle cx="452" cy="96" r="46" fill="#F6B31B" opacity=".9"/>
        <rect x="60" y="150" width="66" height="180" rx="8" fill="#DDE2E9"/>
        <rect x="140" y="110" width="82" height="220" rx="8" fill="#CBD2DC"/>
        <rect x="236" y="170" width="60" height="160" rx="8" fill="#DDE2E9"/>
        <rect x="76" y="170" width="12" height="12" rx="3" fill="#F1F3F6"/><rect x="98" y="170" width="12" height="12" rx="3" fill="#F1F3F6"/>
        <rect x="76" y="196" width="12" height="12" rx="3" fill="#F1F3F6"/><rect x="98" y="196" width="12" height="12" rx="3" fill="#F1F3F6"/>
        <rect x="158" y="132" width="14" height="14" rx="3" fill="#F1F3F6"/><rect x="184" y="132" width="14" height="14" rx="3" fill="#F1F3F6"/>
        <rect x="158" y="160" width="14" height="14" rx="3" fill="#F1F3F6"/><rect x="184" y="160" width="14" height="14" rx="3" fill="#F1F3F6"/>
        <rect x="0" y="330" width="560" height="230" fill="#14181F"/>
        <g stroke="#F6B31B" strokeWidth="8" strokeLinecap="round">
          <line x1="24" y1="470" x2="88" y2="470"/><line x1="136" y1="470" x2="200" y2="470"/>
          <line x1="248" y1="470" x2="312" y2="470"/><line x1="360" y1="470" x2="424" y2="470"/>
          <line x1="472" y1="470" x2="536" y2="470"/>
        </g>
        {/* Auto */}
        <g>
          <path d="M120 380c0-14 10-24 26-26l34-38c8-9 20-14 33-14h96c14 0 27 6 35 17l27 35h32c18 0 32 14 32 31v18c0 9-7 16-16 16H136c-9 0-16-7-16-16v-23z" fill="#F6B31B"/>
          <path d="M196 350l26-30c5-5 12-8 19-8h28v38h-73z" fill="#1D2430"/>
          <path d="M282 312h27c8 0 16 4 21 10l22 28h-70v-38z" fill="#1D2430"/>
          <rect x="120" y="392" width="315" height="14" fill="#E09F0F"/>
          <circle cx="192" cy="418" r="34" fill="#14181F"/><circle cx="192" cy="418" r="14" fill="#F6B31B"/>
          <circle cx="372" cy="418" r="34" fill="#14181F"/><circle cx="372" cy="418" r="14" fill="#F6B31B"/>
        </g>
        {/* Chips flotantes */}
        <g>
          <rect x="330" y="180" width="176" height="58" rx="14" fill="#FFFFFF"/>
          <text x="352" y="204" fontFamily="Poppins, sans-serif" fontSize="13" fill="#6B7482">Nueva oferta</text>
          <text x="352" y="226" fontFamily="Poppins, sans-serif" fontSize="18" fontWeight="700" fill="#12151B">$9.800</text>
          <circle cx="480" cy="209" r="14" fill="#F6B31B"/>
          <path d="M474 209l4 4 8-9" stroke="#12151B" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <g>
          <rect x="64" y="236" width="188" height="46" rx="14" fill="#22C05C"/>
          <text x="86" y="265" fontFamily="Poppins, sans-serif" fontSize="15" fontWeight="700" fill="#FFFFFF">✓ Trato cerrado</text>
        </g>
      </svg>
    </div>
  </div>
</header>

{/* VENDER */}
<section className="seccion">
  <div className="wrap split invertir">
    {/* Ilustración: publicar y recibir ofertas */}
    <div className="fig" aria-hidden="true">
      <svg viewBox="0 0 560 560" xmlns="http://www.w3.org/2000/svg">
        <rect width="560" height="560" fill="#F1F3F6"/>
        <circle cx="110" cy="110" r="70" fill="#E4E8EF"/>
        {/* Teléfono */}
        <rect x="176" y="70" width="212" height="420" rx="34" fill="#14181F"/>
        <rect x="188" y="84" width="188" height="392" rx="24" fill="#FFFFFF"/>
        <rect x="204" y="104" width="110" height="10" rx="5" fill="#12151B"/>
        <rect x="204" y="124" width="70" height="8" rx="4" fill="#C6CCD6"/>
        {/* Foto del vehículo */}
        <rect x="204" y="150" width="156" height="112" rx="14" fill="#1D2430"/>
        <g>
          <path d="M234 222c0-5 4-9 9-9l10-13c3-4 7-6 12-6h32c5 0 10 2 13 6l9 12h10c7 0 12 5 12 12v6c0 3-3 6-6 6h-95c-3 0-6-3-6-6v-8z" fill="#F6B31B"/>
          <circle cx="258" cy="234" r="11" fill="#0B0E13"/><circle cx="258" cy="234" r="4.5" fill="#F6B31B"/>
          <circle cx="318" cy="234" r="11" fill="#0B0E13"/><circle cx="318" cy="234" r="4.5" fill="#F6B31B"/>
        </g>
        <circle cx="342" cy="170" r="13" fill="#FFFFFF" opacity=".9"/>
        <path d="M336 170h12M342 164v12" stroke="#12151B" strokeWidth="2.4" strokeLinecap="round"/>
        {/* Botón publicar */}
        <rect x="204" y="280" width="156" height="40" rx="12" fill="#F6B31B"/>
        <text x="282" y="305" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="15" fontWeight="700" fill="#12151B">Publicar</text>
        <rect x="204" y="336" width="156" height="8" rx="4" fill="#E4E7EC"/>
        <rect x="204" y="352" width="112" height="8" rx="4" fill="#E4E7EC"/>
        {/* Ofertas llegando */}
        <g>
          <rect x="352" y="368" width="176" height="56" rx="14" fill="#FFFFFF" stroke="#E4E7EC"/>
          <text x="372" y="391" fontFamily="Poppins, sans-serif" fontSize="12" fill="#6B7482">Oferta recibida</text>
          <text x="372" y="412" fontFamily="Poppins, sans-serif" fontSize="17" fontWeight="700" fill="#12151B">$10.200</text>
        </g>
        <g>
          <rect x="376" y="440" width="152" height="56" rx="14" fill="#FFFFFF" stroke="#E4E7EC"/>
          <text x="396" y="463" fontFamily="Poppins, sans-serif" fontSize="12" fill="#6B7482">Oferta recibida</text>
          <text x="396" y="484" fontFamily="Poppins, sans-serif" fontSize="17" fontWeight="700" fill="#12151B">$9.750</text>
        </g>
        {/* Cronómetro 20s */}
        <g>
          <rect x="52" y="300" width="112" height="46" rx="23" fill="#14181F"/>
          <circle cx="80" cy="323" r="11" fill="none" stroke="#F6B31B" strokeWidth="3"/>
          <path d="M80 317v6l4 3" stroke="#F6B31B" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
          <text x="100" y="329" fontFamily="Poppins, sans-serif" fontSize="15" fontWeight="700" fill="#FFFFFF">20 s</text>
        </g>
      </svg>
    </div>

    <div>
      <span className="eyebrow" style={{color:'#B07E0A'}}>Para vender</span>
      <h2 style={{marginTop:'12px'}}>Publica y vende tu vehículo</h2>
      <p className="lead">Sube las fotos, publícalo y espera. Las ofertas llegan solas a tu bandeja: tú aceptas la que te convenga y abres un chat solo con esa persona.</p>
      <ul className="check">
        <li>Publicado en menos de 20 segundos, solo con tu correo.</li>
        <li>Recibe todas las ofertas en un solo lugar, sin contestar a cien curiosos.</li>
        <li>Lo que negocias es tuyo completo: $0 de comisión.</li>
      </ul>
      <a className="btn" href="https://app.ruedajusta.com">Vender mi vehículo</a>
      <a className="link-sec" href="#como-funciona">Ver cómo funciona</a>
    </div>
  </div>
</section>

{/* BUSCAR */}
<section className="seccion" style={{paddingTop:'0'}}>
  <div className="wrap split">
    <div>
      <span className="eyebrow" style={{color:'#B07E0A'}}>Para comprar</span>
      <h2 style={{marginTop:'12px'}}>Busca un vehículo y recibe ofertas instantáneas</h2>
      <p className="lead">Deja de perseguir anuncios viejos. Di qué buscas —marca, modelo, presupuesto— y deja que las opciones lleguen a ti. Eliges, chateas directo con el dueño y cierras.</p>
      <ul className="check">
        <li>Tu búsqueda publicada en menos de 20 segundos.</li>
        <li>Aceptas solo la oferta que te interesa: un chat directo, sin intermediarios.</li>
        <li>Teléfonos y direcciones se comparten solo dentro del chat, cuando ambos lo deciden.</li>
      </ul>
      <a className="btn" href="https://app.ruedajusta.com">Buscar un vehículo</a>
      <a className="link-sec" href="#contacto">¿Dudas? Contáctanos</a>
    </div>

    {/* Ilustración: chat directo */}
    <div className="fig" aria-hidden="true">
      <svg viewBox="0 0 560 560" xmlns="http://www.w3.org/2000/svg">
        <rect width="560" height="560" fill="#F1F3F6"/>
        <circle cx="466" cy="452" r="64" fill="#E4E8EF"/>
        {/* Barra de búsqueda */}
        <g>
          <rect x="72" y="72" width="416" height="62" rx="18" fill="#FFFFFF" stroke="#E4E7EC"/>
          <circle cx="108" cy="103" r="12" fill="none" stroke="#12151B" strokeWidth="3"/>
          <line x1="117" y1="112" x2="126" y2="121" stroke="#12151B" strokeWidth="3" strokeLinecap="round"/>
          <text x="144" y="110" fontFamily="Poppins, sans-serif" fontSize="17" fill="#6B7482">Chevrolet Sail · hasta $11.000</text>
        </g>
        {/* Burbujas de chat */}
        <g>
          <path d="M96 190h250a18 18 0 0 1 18 18v50a18 18 0 0 1-18 18H130l-34 26v-94a18 18 0 0 1 18-18z" transform="translate(-18 0)" fill="#14181F"/>
          <text x="106" y="228" fontFamily="Poppins, sans-serif" fontSize="16" fill="#FFFFFF">Te ofrezco $9.800.</text>
          <text x="106" y="252" fontFamily="Poppins, sans-serif" fontSize="16" fill="#FFFFFF">¿Sigue disponible?</text>
        </g>
        <g>
          <path d="M216 320h230a18 18 0 0 1 18 18v50a18 18 0 0 1-18 18h-16l34 26h-248a18 18 0 0 1-18-18v-76a18 18 0 0 1 18-18z" fill="#F6B31B"/>
          <text x="238" y="358" fontFamily="Poppins, sans-serif" fontSize="16" fontWeight="600" fill="#12151B">Sí. Acepto tu oferta,</text>
          <text x="238" y="382" fontFamily="Poppins, sans-serif" fontSize="16" fontWeight="600" fill="#12151B">¿cuándo lo quieres ver?</text>
        </g>
        {/* Candado privacidad */}
        <g>
          <rect x="80" y="452" width="266" height="52" rx="16" fill="#FFFFFF" stroke="#E4E7EC"/>
          <rect x="100" y="470" width="18" height="14" rx="4" fill="none" stroke="#22C05C" strokeWidth="2.6"/>
          <path d="M103 470v-4a6 6 0 0 1 12 0v4" fill="none" stroke="#22C05C" strokeWidth="2.6"/>
          <text x="132" y="483" fontFamily="Poppins, sans-serif" fontSize="14" fontWeight="600" fill="#12151B">Chat privado y directo</text>
        </g>
      </svg>
    </div>
  </div>
</section>

{/* CÓMO FUNCIONA */}
<section className="nube-bg seccion" id="como-funciona">
  <div className="wrap">
    <h2>Así de simple funciona</h2>
    <div className="carretera" style={{width:'120px',marginTop:'20px'}} aria-hidden="true"></div>
    <div className="flujo">
      <div className="paso"><div className="num">1</div><h4>Publica</h4><p>Vendes o buscas: lo publicas en segundos, solo con tu correo y un código de confirmación. Sin formularios eternos.</p></div>
      <div className="paso"><div className="num">2</div><h4>Recibe ofertas</h4><p>Las ofertas llegan a tu bandeja dentro de la app. Pueden llegar muchas: tú revisas con calma y eliges la mejor.</p></div>
      <div className="paso"><div className="num">3</div><h4>Chatea y cierra</h4><p>Al aceptar una oferta se abre un chat solo con esa persona. Negocian directo y cierran el trato entre ustedes.</p></div>
    </div>
    <div className="candado">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#F6B31B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
      <p><b>Tu privacidad va primero.</b> Tu teléfono y tu dirección no aparecen en el anuncio: solo se comparten dentro del chat, cuando la conversación ya avanzó y ambos lo deciden.</p>
    </div>
  </div>
</section>

{/* CIFRAS */}
<section className="oscuro seccion">
  <div className="wrap cifras">
    <div className="cifra"><div className="valor">$0</div><p>de comisión. Lo que negocias es tuyo, completo.</p></div>
    <div className="cifra"><div className="valor">20 s</div><p>o menos para publicar tu vehículo o tu búsqueda.</p></div>
    <div className="cifra"><div className="valor">1 chat</div><p>directo por oferta aceptada. Sin intermediarios, sin patio.</p></div>
  </div>
</section>

{/* CTA */}
<section className="banda">
  <div className="wrap">
    <h2>El próximo trato justo puede ser el tuyo.</h2>
    <a className="btn" href="https://app.ruedajusta.com">Regístrate gratis</a>
    <p>Con tu correo, en app.ruedajusta.com. Te toma menos que leer esta página.</p>
  </div>
</section>

{/* FOOTER */}
<footer id="contacto">
  <div className="wrap">
    <div className="foot-grid">
      <div>
        <a href="#" className="logo">
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="32" cy="27" r="14" stroke="#F6B31B" strokeWidth="7"/>
            <g stroke="#F6B31B" strokeWidth="6" strokeLinecap="round">
              <line x1="6" y1="53" x2="16" y2="53"/><line x1="27" y1="53" x2="37" y2="53"/><line x1="48" y1="53" x2="58" y2="53"/>
            </g>
          </svg>
          <span className="marca">RUEDA<span>JUSTA</span></span>
        </a>
        <p className="desc">La red inteligente para comprar y vender vehículos. Conectamos personas, no cobramos comisiones.</p>
        <a className="wsp" href="https://wa.me/593998260550?text=Hola%20RuedaJusta%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n" target="_blank" rel="noopener">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.1 2.2-.2 3.7 1.2 2 2.9 3.5 5 4.4 1.7.7 2.4.6 3.2.5.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.1-.5-.3z"/></svg>
          Escríbenos por WhatsApp
        </a>
      </div>
      <div>
        <span className="eyebrow">Contáctanos</span>
        <div className="contactos">
          <a className="contacto" href="mailto:informacion@ruedajusta.com"><span className="cico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F6B31B" strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg></span>informacion@ruedajusta.com</a>
          <div className="contacto" style={{cursor:'default'}}><span className="cico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F6B31B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/></svg></span>Palo Alto, California</div>
          <a className="contacto" href="https://app.ruedajusta.com"><span className="cico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F6B31B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M9 7h8v8"/></svg></span>app.ruedajusta.com</a>
        </div>
      </div>
    </div>
    <div className="legal">
      <span>© 2026 RuedaJusta · Palo Alto, California</span>
      <span>La red inteligente para comprar y vender vehículos</span>
    </div>
  </div>
</footer>


    </>
  );
}
