import { useState, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Settings,
  Copy,
  Check,
  Calendar,
  Clock,
  Sparkles,
  Heart,
  ArrowRight,
  ArrowLeft,
  Send,
  Utensils,
  Wine,
  Coffee,
  Flame,
  Sandwich,
  Sunset,
  Martini,
  Film,
  PenLine,
  Sun,
  Moon,
} from 'lucide-react';
import { DEFAULT_CONFIG } from './config';

// Mapa de íconos vectoriales minimalistas
const ICON_MAP = {
  utensils: Utensils,
  wine: Wine,
  coffee: Coffee,
  flame: Flame,
  sandwich: Sandwich,
  sunset: Sunset,
  martini: Martini,
  film: Film,
  sparkles: Sparkles,
  pen: PenLine,
};

// Emblema minimalista editorial (sin fotos de perros ni dibujos infantiles)
function EditorialEmblem({ isDark }) {
  const strokeColor = isDark ? '#C5A880' : '#8C2D38';
  return (
    <div className="relative w-24 h-24 flex items-center justify-center mb-6">
      {/* Anillo exterior giratorio con línea fina */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-orbit opacity-75"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.75"
          strokeDasharray="4 4"
        />
        <circle cx="50" cy="4" r="2" fill={strokeColor} />
        <circle cx="50" cy="96" r="2" fill={strokeColor} />
      </svg>

      {/* Anillo interior estático */}
      <div
        className={`absolute inset-3 rounded-full border ${
          isDark ? 'border-[#C5A880]/30 bg-[#1A1615]' : 'border-[#8C2D38]/20 bg-[#FAF8F5]'
        } flex items-center justify-center shadow-inner`}
      >
        {/* Estrella / Destello minimalista central */}
        <svg
          viewBox="0 0 36 36"
          className="w-8 h-8 animate-pulse-subtle"
          fill="none"
        >
          <path
            d="M18 2C18 11.5 24.5 18 34 18C24.5 18 18 24.5 18 34C18 24.5 11.5 18 2 18C11.5 18 18 11.5 18 2Z"
            stroke={strokeColor}
            strokeWidth="1.3"
            fill={isDark ? 'rgba(197,168,128,0.12)' : 'rgba(140,45,56,0.08)'}
          />
          <circle cx="18" cy="18" r="2" fill={strokeColor} />
        </svg>
      </div>
    </div>
  );
}

export default function App() {
  // Parámetros de URL (?tel=51999999999&nombre=Valeria&tema=oscuro)
  const searchParams = new URLSearchParams(window.location.search);
  const urlPhone = searchParams.get('tel') || DEFAULT_CONFIG.whatsappNumber;
  const urlName = searchParams.get('nombre') || DEFAULT_CONFIG.girlName;
  const urlTheme = searchParams.get('tema') || 'claro';
  const isSharedLink = Boolean(searchParams.get('tel') || searchParams.get('nombre'));

  // Configuración
  const [phone, setPhone] = useState(urlPhone);
  const [girlName, setGirlName] = useState(urlName);
  const [theme, setTheme] = useState(urlTheme);

  // Flujo de 4 Modales:
  // 1: Invitación | 2: Fecha y Hora | 3: ¿Qué se te antoja? | 4: Confirmación y WhatsApp
  const [step, setStep] = useState(1);

  // Botón "No" escurridizo
  const [noPos, setNoPos] = useState({ x: 0, y: 0, moved: false });
  const [noCount, setNoCount] = useState(0);
  const cardRef = useRef(null);

  // Datos elegidos
  const [selectedDay, setSelectedDay] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCraving, setSelectedCraving] = useState(null);
  const [customCravingText, setCustomCravingText] = useState('');
  const [extraNote, setExtraNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modal de ajustes
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const isDark = theme === 'oscuro';

  // Generar los próximos 7 días reales para selección rápida
  const upcomingDays = useMemo(() => {
    const daysName = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const monthsName = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const list = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = daysName[d.getDay()];
      const dayNum = d.getDate();
      const monthName = monthsName[d.getMonth()];
      const fullLabel = `${dayName} ${dayNum} de ${monthName}`;
      list.push({
        id: `day-${i}`,
        dayName,
        dayNum,
        monthName,
        fullLabel,
      });
    }
    return list;
  }, []);

  // Confeti elegante en tonos champagne, burdeos y marfil
  const triggerConfetti = (count = 70) => {
    confetti({
      particleCount: count,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8C2D38', '#C5A880', '#D4AF37', '#E8D8C8', '#1A1716'],
    });
  };

  // Mover el botón "No" suavemente dentro del contenedor
  const moveNoButton = () => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const maxOffsetX = Math.min(125, (rect.width - 140) / 2);
    const maxOffsetY = 75;

    let randomX = (Math.random() * 2 - 1) * maxOffsetX;
    let randomY = (Math.random() * 2 - 1) * maxOffsetY;

    if (Math.abs(randomX) < 40 && Math.abs(randomY) < 25) {
      randomX = randomX >= 0 ? 60 : -60;
      randomY = randomY >= 0 ? 35 : -35;
    }

    setNoPos({
      x: Math.round(randomX),
      y: Math.round(randomY),
      moved: true,
    });
    setNoCount((prev) => prev + 1);
  };

  // Formateo de fecha y antojo final
  const getFinalDayText = () => {
    if (selectedDay === 'calendario' && customDate) {
      const [year, month, day] = customDate.split('-');
      const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
      ];
      return `el ${parseInt(day, 10)} de ${months[parseInt(month, 10) - 1]}`;
    }
    return selectedDay;
  };

  const getFinalCravingText = () => {
    if (!selectedCraving) return '';
    if (selectedCraving.id === 'otro' && customCravingText.trim()) {
      return customCravingText.trim();
    }
    return selectedCraving.title;
  };

  // Paso 2 -> Paso 3
  const handleNextToCravings = (e) => {
    e.preventDefault();
    if (!selectedDay) {
      setErrorMsg('Por favor selecciona un día para vernos.');
      return;
    }
    if (selectedDay === 'calendario' && !customDate) {
      setErrorMsg('Elige la fecha en el calendario.');
      return;
    }
    if (!selectedTime) {
      setErrorMsg('Selecciona a qué hora paso por ti.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  // Paso 3 -> Paso 4
  const handleConfirmAll = (e) => {
    e.preventDefault();
    if (!selectedCraving) {
      setErrorMsg('Elige una opción de la lista para nuestro plan.');
      return;
    }
    if (selectedCraving.id === 'otro' && !customCravingText.trim()) {
      setErrorMsg('Escribe qué tienes ganas de hacer o comer.');
      return;
    }
    setErrorMsg('');
    triggerConfetti(90);
    setStep(4);
  };

  // Texto para WhatsApp
  const buildMessageText = () => {
    const dayText = getFinalDayText();
    const cravingText = getFinalCravingText();
    let msg = `¡Hola! ✨ Me alegra decirte que SÍ acepto la invitación.\n\n`;
    msg += `— *Detalles de nuestra cita:*\n`;
    msg += `• *Día:* ${dayText}\n`;
    msg += `• *Paso por mí a las:* ${selectedTime}\n`;
    msg += `• *Plan elegido:* ${cravingText}\n`;
    if (extraNote.trim()) {
      msg += `• *Nota:* ${extraNote.trim()}\n`;
    }
    msg += `\nQuedamos así, ¡nos vemos a las ${selectedTime}!`;
    return msg;
  };

  const getWhatsAppUrl = () => {
    const cleanPhone = phone.replace(/\D/g, '');
    const encoded = encodeURIComponent(buildMessageText());
    if (cleanPhone) {
      return `https://wa.me/${cleanPhone}?text=${encoded}`;
    }
    return `https://api.whatsapp.com/send?text=${encoded}`;
  };

  const getShareableLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    if (phone.trim()) params.set('tel', phone.replace(/\D/g, ''));
    if (girlName.trim()) params.set('nombre', girlName.trim());
    if (theme !== 'claro') params.set('tema', theme);
    const query = params.toString();
    return query ? `${baseUrl}?${query}` : baseUrl;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareableLink());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(buildMessageText());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const currentNoText =
    DEFAULT_CONFIG.noButtonPhrases[noCount % DEFAULT_CONFIG.noButtonPhrases.length];

  const stepsMeta = [
    { num: 1, label: '01 / Invitación' },
    { num: 2, label: '02 / Fecha y Hora' },
    { num: 3, label: '03 / El Plan' },
    { num: 4, label: '04 / Reserva' },
  ];

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center p-4 py-10 relative overflow-hidden select-none transition-colors duration-500 ${
        isDark ? 'luxury-dark-bg text-[#F5F2EB]' : 'luxury-bg text-[#1A1716]'
      }`}
    >
      {/* Indicador minimalista de los 4 modales */}
      <header className="z-20 mb-6 flex items-center gap-1 sm:gap-2">
        {stepsMeta.map((s, idx) => {
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <div key={s.num} className="flex items-center">
              <button
                type="button"
                disabled={s.num > step}
                onClick={() => s.num < step && setStep(s.num)}
                className={`px-3 py-1.5 rounded-full text-[11px] tracking-[0.12em] uppercase transition-all ${
                  isActive
                    ? isDark
                      ? 'bg-[#C5A880] text-[#0D0B0B] font-semibold'
                      : 'bg-[#1A1716] text-[#F7F4EF] font-semibold'
                    : isDone
                    ? isDark
                      ? 'text-[#C5A880] hover:underline cursor-pointer'
                      : 'text-[#8C2D38] hover:underline cursor-pointer font-medium'
                    : isDark
                    ? 'text-white/25 cursor-not-allowed'
                    : 'text-black/25 cursor-not-allowed'
                }`}
              >
                {s.label}
              </button>
              {idx < stepsMeta.length - 1 && (
                <div
                  className={`w-4 sm:w-6 h-[1px] mx-1 ${
                    isDark ? 'bg-white/15' : 'bg-black/15'
                  }`}
                />
              )}
            </div>
          );
        })}
      </header>

      {/* =====================================================================
          TARJETA / MODAL CENTRAL EDITORIAL
         ===================================================================== */}
      <main
        ref={cardRef}
        key={step}
        className={`w-full max-w-[540px] rounded-[24px] p-7 sm:p-12 relative z-10 animate-reveal transition-all border ${
          isDark
            ? 'bg-[#141110]/95 border-[#2C2523] shadow-[0_30px_80px_rgba(0,0,0,0.65)]'
            : 'bg-white/95 border-[#E6E0D6] shadow-[0_25px_70px_rgba(26,23,22,0.07)]'
        }`}
      >
        {/* Marco interior sutil estilo papelería de lujo */}
        <div
          className={`pointer-events-none absolute inset-3 rounded-[18px] border ${
            isDark ? 'border-[#C5A880]/15' : 'border-[#1A1716]/[0.06]'
          }`}
        />

        {/* ===================================================================
            MODAL 1: LA PROPUESTA (MINIMALISTA Y DESLUMBRANTE)
           =================================================================== */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center relative z-10 py-2">
            <span
              className={`text-[10px] uppercase tracking-[0.28em] font-medium mb-5 ${
                isDark ? 'text-[#C5A880]' : 'text-[#8C2D38]'
              }`}
            >
              Invitación Personal — N° 01
            </span>

            {/* Emblema geométrico animado */}
            <EditorialEmblem isDark={isDark} />

            <h1 className="font-editorial text-4xl sm:text-[50px] font-normal leading-[1.08] tracking-tight mb-4">
              ¿Salimos juntos
              {girlName ? (
                <span className="italic font-semibold text-[#8C2D38] dark:text-[#C5A880]">
                  , {girlName}
                </span>
              ) : (
                ''
              )}
              ?
            </h1>

            <div
              className={`w-10 h-[1px] my-3 ${
                isDark ? 'bg-[#C5A880]/40' : 'bg-[#8C2D38]/35'
              }`}
            />

            <p
              className={`text-sm sm:text-[15px] max-w-sm leading-relaxed font-light mb-10 ${
                isDark ? 'text-[#C2B9B0]' : 'text-[#5C534E]'
              }`}
            >
              Una invitación para desconectar de la rutina, conversar sin prisa y disfrutar del plan que más se te antoje.
            </p>

            {/* Botones de decisión */}
            <div className="relative w-full min-h-[88px] flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => {
                  triggerConfetti(60);
                  setStep(2);
                }}
                className={`px-8 py-3.5 rounded-full text-xs sm:text-sm uppercase tracking-[0.16em] font-medium transition-all duration-300 cursor-pointer flex items-center gap-3 shadow-md active:scale-95 z-10 ${
                  isDark
                    ? 'bg-[#C5A880] hover:bg-[#d4b992] text-[#0D0B0B]'
                    : 'bg-[#8C2D38] hover:bg-[#73222C] text-white'
                }`}
              >
                <span>Aceptar invitación</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseEnter={moveNoButton}
                onTouchStart={(e) => {
                  e.preventDefault();
                  moveNoButton();
                }}
                onClick={moveNoButton}
                style={
                  noPos.moved
                    ? {
                        transform: `translate(${noPos.x}px, ${noPos.y}px)`,
                        transition: 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
                      }
                    : undefined
                }
                className={`px-6 py-3.5 rounded-full text-xs uppercase tracking-[0.14em] transition cursor-pointer z-20 whitespace-nowrap border ${
                  isDark
                    ? 'border-[#332B28] text-[#8E837B] hover:border-[#C5A880]/40 bg-[#141110]'
                    : 'border-[#E0D9CE] text-[#7A706A] hover:border-[#1A1716]/30 bg-white'
                }`}
              >
                {currentNoText}
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            MODAL 2: FECHA Y HORA
           =================================================================== */}
        {step === 2 && (
          <form onSubmit={handleNextToCravings} className="flex flex-col relative z-10">
            <div className="text-center mb-7">
              <span
                className={`text-[10px] uppercase tracking-[0.25em] font-medium ${
                  isDark ? 'text-[#C5A880]' : 'text-[#8C2D38]'
                }`}
              >
                Paso 01 — Coordenadas
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal mt-1">
                Elige el <span className="italic">día</span> y la <span className="italic">hora</span>
              </h2>
            </div>

            {/* 1. SELECCIÓN DE DÍA */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-[11px] uppercase tracking-[0.15em] font-medium opacity-70 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Día del encuentro</span>
                </label>
                {selectedDay && selectedDay !== 'calendario' && (
                  <span
                    className={`text-xs font-editorial italic ${
                      isDark ? 'text-[#C5A880]' : 'text-[#8C2D38]'
                    }`}
                  >
                    {selectedDay}
                  </span>
                )}
              </div>

              {/* Tira de próximos 7 días con números editoriales */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 mb-2.5">
                {upcomingDays.map((d) => {
                  const active = selectedDay === d.fullLabel;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setSelectedDay(d.fullLabel);
                        setErrorMsg('');
                      }}
                      className={`py-2.5 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        active
                          ? isDark
                            ? 'bg-[#C5A880] text-[#0D0B0B] border-[#C5A880]'
                            : 'bg-[#8C2D38] text-white border-[#8C2D38]'
                          : isDark
                          ? 'bg-transparent hover:bg-white/[0.04] border-[#2C2523] text-[#E5DEC9]'
                          : 'bg-[#FAF8F5] hover:bg-[#F0ECE3] border-[#E6E0D6] text-[#1A1716]'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-widest opacity-65">
                        {d.dayName}
                      </span>
                      <span className="font-editorial text-2xl font-semibold leading-none my-1">
                        {d.dayNum}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider opacity-65">
                        {d.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Opciones rápidas + Calendario específico */}
              <div className="grid grid-cols-2 gap-2">
                {DEFAULT_CONFIG.quickDays.slice(0, 2).map((qd) => {
                  const active = selectedDay === qd.label;
                  return (
                    <button
                      key={qd.id}
                      type="button"
                      onClick={() => {
                        setSelectedDay(qd.label);
                        setErrorMsg('');
                      }}
                      className={`py-2.5 px-3 rounded-xl border text-left transition cursor-pointer ${
                        active
                          ? isDark
                            ? 'bg-[#C5A880] text-[#0D0B0B] border-[#C5A880]'
                            : 'bg-[#8C2D38] text-white border-[#8C2D38]'
                          : isDark
                          ? 'border-[#2C2523] hover:border-[#C5A880]/40'
                          : 'bg-[#FAF8F5] border-[#E6E0D6] hover:border-[#8C2D38]/40'
                      }`}
                    >
                      <div className="text-xs font-medium">{qd.label}</div>
                      <div className="text-[10px] opacity-65">{qd.sub}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selector de calendario */}
              <div
                onClick={() => setSelectedDay('calendario')}
                className={`mt-2 px-3.5 py-2 rounded-xl border flex items-center justify-between gap-2 transition cursor-pointer ${
                  selectedDay === 'calendario'
                    ? isDark
                      ? 'border-[#C5A880] bg-[#C5A880]/10'
                      : 'border-[#8C2D38] bg-[#8C2D38]/5'
                    : isDark
                    ? 'border-[#2C2523]'
                    : 'border-[#E6E0D6] bg-[#FAF8F5]'
                }`}
              >
                <span className="text-xs opacity-75">¿Prefieres otra fecha del calendario?</span>
                <input
                  type="date"
                  value={customDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setSelectedDay('calendario');
                    setCustomDate(e.target.value);
                    setErrorMsg('');
                  }}
                  className={`px-2 py-1 rounded text-xs font-medium border focus:outline-none cursor-pointer ${
                    isDark
                      ? 'bg-[#1A1615] text-white border-[#332B28]'
                      : 'bg-white text-[#1A1716] border-[#D8D0C5]'
                  }`}
                />
              </div>
            </div>

            {/* 2. SELECCIÓN DE HORA */}
            <div className="mb-6">
              <label className="text-[11px] uppercase tracking-[0.15em] font-medium opacity-70 flex items-center gap-1.5 mb-2.5">
                <Clock className="w-3.5 h-3.5" />
                <span>¿A qué hora paso por ti?</span>
              </label>

              <div className="space-y-3 max-h-[175px] overflow-y-auto minimal-scroll pr-1">
                {DEFAULT_CONFIG.timeGroups.map((group) => (
                  <div key={group.period}>
                    <div className="text-[10px] uppercase tracking-[0.18em] opacity-50 mb-1.5">
                      {group.period}
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {group.times.map((time) => {
                        const active = selectedTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => {
                              setSelectedTime(time);
                              setErrorMsg('');
                            }}
                            className={`py-2 px-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                              active
                                ? isDark
                                  ? 'bg-[#C5A880] text-[#0D0B0B] border-[#C5A880]'
                                  : 'bg-[#8C2D38] text-white border-[#8C2D38]'
                                : isDark
                                ? 'border-[#2C2523] hover:border-[#C5A880]/40 text-[#E5DEC9]'
                                : 'bg-[#FAF8F5] border-[#E6E0D6] hover:border-[#8C2D38]/40 text-[#1A1716]'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {errorMsg && (
              <p className="text-[#B93848] text-xs font-medium text-center mb-3">
                {errorMsg}
              </p>
            )}

            {/* Navegación */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-current/10">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setStep(1);
                }}
                className="text-xs uppercase tracking-[0.15em] opacity-60 hover:opacity-100 transition flex items-center gap-1.5 py-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver</span>
              </button>

              <button
                type="submit"
                className={`px-7 py-3.5 rounded-full text-xs uppercase tracking-[0.16em] font-medium transition flex items-center gap-2.5 cursor-pointer ${
                  isDark
                    ? 'bg-[#C5A880] hover:bg-[#d4b992] text-[#0D0B0B]'
                    : 'bg-[#1A1716] hover:bg-[#8C2D38] text-white'
                }`}
              >
                <span>Siguiente: El Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* ===================================================================
            MODAL 3: ¿QUÉ SE TE ANTOJA? (MENÚ DE EXPERIENCIAS)
           =================================================================== */}
        {step === 3 && (
          <form onSubmit={handleConfirmAll} className="flex flex-col relative z-10">
            <div className="text-center mb-6">
              <span
                className={`text-[10px] uppercase tracking-[0.25em] font-medium ${
                  isDark ? 'text-[#C5A880]' : 'text-[#8C2D38]'
                }`}
              >
                Paso 02 — La Experiencia
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal mt-1">
                ¿Qué se te <span className="italic">antoja</span> hoy?
              </h2>
              <p className="text-xs opacity-65 mt-1">
                Elige la opción que más te provoque para nuestra salida
              </p>
            </div>

            {/* Lista minimalista de experiencias */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[270px] overflow-y-auto minimal-scroll pr-1 mb-4">
              {DEFAULT_CONFIG.cravingOptions.map((item) => {
                const active = selectedCraving?.id === item.id;
                const IconComponent = ICON_MAP[item.icon] || Sparkles;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedCraving(item);
                      setErrorMsg('');
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      active
                        ? isDark
                          ? 'bg-[#C5A880] text-[#0D0B0B] border-[#C5A880]'
                          : 'bg-[#8C2D38] text-white border-[#8C2D38] shadow-sm'
                        : isDark
                        ? 'border-[#2C2523] hover:border-[#C5A880]/40 bg-white/[0.02]'
                        : 'bg-[#FAF8F5] border-[#E6E0D6] hover:border-[#8C2D38]/40'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                        active
                          ? isDark
                            ? 'border-[#0D0B0B]/20 bg-[#0D0B0B]/10'
                            : 'border-white/25 bg-white/15'
                          : isDark
                          ? 'border-[#2C2523] text-[#C5A880]'
                          : 'border-[#E6E0D6] text-[#8C2D38] bg-white'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-[13px] font-semibold leading-snug">
                        {item.title}
                      </div>
                      <div
                        className={`text-[11px] leading-snug mt-0.5 ${
                          active ? 'opacity-85' : 'opacity-60'
                        }`}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Si eligió "Otro antojo en mente..." */}
            {selectedCraving?.id === 'otro' && (
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Escribe qué tienes ganas de comer o hacer..."
                  value={customCravingText}
                  onChange={(e) => {
                    setCustomCravingText(e.target.value);
                    setErrorMsg('');
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none ${
                    isDark
                      ? 'bg-[#1A1615] border-[#C5A880] text-white'
                      : 'bg-white border-[#8C2D38] text-[#1A1716]'
                  }`}
                  autoFocus
                />
              </div>
            )}

            {/* Nota opcional */}
            <div className="mb-5">
              <input
                type="text"
                placeholder="¿Algún restaurante, lugar o detalle que quieras agregar? (Opcional)"
                value={extraNote}
                onChange={(e) => setExtraNote(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none ${
                  isDark
                    ? 'bg-transparent border-[#2C2523] text-white placeholder:text-white/35 focus:border-[#C5A880]'
                    : 'bg-[#FAF8F5] border-[#E6E0D6] text-[#1A1716] placeholder:text-black/40 focus:border-[#8C2D38]'
                }`}
              />
            </div>

            {errorMsg && (
              <p className="text-[#B93848] text-xs font-medium text-center mb-3">
                {errorMsg}
              </p>
            )}

            {/* Navegación */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-current/10">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setStep(2);
                }}
                className="text-xs uppercase tracking-[0.15em] opacity-60 hover:opacity-100 transition flex items-center gap-1.5 py-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Fecha y Hora</span>
              </button>

              <button
                type="submit"
                className={`px-7 py-3.5 rounded-full text-xs uppercase tracking-[0.16em] font-medium transition flex items-center gap-2.5 cursor-pointer ${
                  isDark
                    ? 'bg-[#C5A880] hover:bg-[#d4b992] text-[#0D0B0B]'
                    : 'bg-[#8C2D38] hover:bg-[#73222C] text-white'
                }`}
              >
                <span>Confirmar Cita</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* ===================================================================
            MODAL 4: CONFIRMACIÓN FINAL + TARJETA DE RESERVA + WHATSAPP
           =================================================================== */}
        {step === 4 && (
          <div className="flex flex-col items-center text-center relative z-10 py-1">
            <span
              className={`text-[10px] uppercase tracking-[0.28em] font-medium mb-2 ${
                isDark ? 'text-[#C5A880]' : 'text-[#8C2D38]'
              }`}
            >
              Reserva Confirmada
            </span>

            <h2 className="font-editorial text-3xl sm:text-[42px] font-normal leading-tight mb-4">
              Me alegra mucho que <span className="italic">dijeras que sí</span>.
            </h2>

            {/* Frase clave solicitada: "Paso por ti a tal hora" */}
            <p
              className={`font-editorial text-xl sm:text-2xl leading-relaxed max-w-md mb-6 ${
                isDark ? 'text-[#E5DEC9]' : 'text-[#2D2624]'
              }`}
            >
              “Quedamos <span className="italic font-semibold">{getFinalDayText()}</span>.{' '}
              <span
                className={`underline underline-offset-4 ${
                  isDark ? 'text-[#C5A880]' : 'text-[#8C2D38]'
                }`}
              >
                Paso por ti a las {selectedTime}
              </span>{' '}
              para nuestro plan de <span className="italic font-semibold">{getFinalCravingText()}</span>.”
            </p>

            {/* TARJETA ARQUITECTÓNICA DE RESERVA */}
            <div
              className={`w-full rounded-2xl border p-5 mb-7 text-left ${
                isDark
                  ? 'bg-[#1A1615] border-[#2C2523]'
                  : 'bg-[#FAF8F5] border-[#E6E0D6]'
              }`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-current/10 text-[10px] uppercase tracking-[0.2em] opacity-60">
                <span>Pase Personal de Cita</span>
                <span>N° 001-VIP</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.15em] opacity-50">
                    Fecha
                  </div>
                  <div className="font-editorial text-lg font-semibold mt-0.5">
                    {getFinalDayText()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.15em] opacity-50">
                    Paso por ti
                  </div>
                  <div
                    className={`font-editorial text-lg font-semibold mt-0.5 ${
                      isDark ? 'text-[#C5A880]' : 'text-[#8C2D38]'
                    }`}
                  >
                    {selectedTime}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-current/10">
                <div className="text-[10px] uppercase tracking-[0.15em] opacity-50">
                  Experiencia elegida
                </div>
                <div className="font-editorial text-lg font-semibold mt-0.5">
                  {getFinalCravingText()}
                </div>
                {extraNote.trim() && (
                  <div className="text-xs opacity-70 italic mt-1">
                    Nota: “{extraNote.trim()}”
                  </div>
                )}
              </div>
            </div>

            {/* Botón principal para compartir a WhatsApp */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-4 px-6 rounded-full text-xs sm:text-sm uppercase tracking-[0.16em] font-medium transition-all flex items-center justify-center gap-2.5 shadow-lg ${
                isDark
                  ? 'bg-[#C5A880] hover:bg-[#d4b992] text-[#0D0B0B]'
                  : 'bg-[#8C2D38] hover:bg-[#73222C] text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar confirmación por WhatsApp</span>
            </a>

            <div className="w-full flex items-center justify-between mt-4 pt-2 text-[11px] uppercase tracking-[0.12em] opacity-65">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="hover:opacity-100 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Modificar detalles</span>
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="hover:opacity-100 flex items-center gap-1 cursor-pointer"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar resumen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Controles inferiores discretos (Modo Claro/Oscuro + Configurar WhatsApp) */}
      <div className="fixed bottom-4 right-4 z-30 flex items-center gap-2">
        <button
          onClick={() => setTheme(isDark ? 'claro' : 'oscuro')}
          className={`p-2.5 rounded-full border transition cursor-pointer ${
            isDark
              ? 'bg-[#1A1615] border-[#2C2523] text-[#C5A880]'
              : 'bg-white border-[#E6E0D6] text-[#1A1716] shadow-sm'
          }`}
          title="Alternar tema Marfil / Nocturno"
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {!isSharedLink && (
          <button
            onClick={() => setShowConfigModal(true)}
            className={`px-4 py-2 rounded-full border text-[11px] uppercase tracking-[0.12em] font-medium flex items-center gap-1.5 transition cursor-pointer ${
              isDark
                ? 'bg-[#1A1615] border-[#2C2523] text-[#E5DEC9]'
                : 'bg-white border-[#E6E0D6] text-[#1A1716] shadow-sm'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configurar WhatsApp</span>
          </button>
        )}
      </div>

      {/* MODAL DE CONFIGURACIÓN */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] text-[#1A1716] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E6E0D6] animate-reveal text-left">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E6E0D6]">
              <h3 className="font-editorial text-2xl font-normal">
                Personalizar Invitación
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-[0.14em] font-medium mb-1.5 opacity-75">
                  Tu número de WhatsApp (con código de país)
                </label>
                <input
                  type="text"
                  placeholder="Ej: 51987654321 o 5215512345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D8D0C5] rounded-xl focus:outline-none focus:border-[#8C2D38]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-[0.14em] font-medium mb-1.5 opacity-75">
                  Nombre de ella (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Valeria"
                  value={girlName}
                  onChange={(e) => setGirlName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D8D0C5] rounded-xl focus:outline-none focus:border-[#8C2D38]"
                />
              </div>

              <div className="pt-2 border-t border-[#E6E0D6]">
                <label className="block uppercase tracking-[0.14em] font-medium mb-1.5 opacity-75">
                  Enlace listo para enviarle:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getShareableLink()}
                    className="w-full px-3 py-2.5 bg-white border border-[#D8D0C5] rounded-xl text-[11px] opacity-75 select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 bg-[#8C2D38] text-white rounded-xl text-[11px] uppercase tracking-wider font-medium flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedLink ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-6 py-2.5 rounded-full bg-[#1A1716] text-white text-[11px] uppercase tracking-[0.15em] cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
