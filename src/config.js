// Configuración de la invitación minimalista ✨

export const DEFAULT_CONFIG = {
  // Tu número de WhatsApp con código de país (sin + ni espacios, ej: "51987654321")
  whatsappNumber: "",

  // Nombre opcional (también puedes pasarlo en el link: ?nombre=Valeria)
  girlName: "",

  // Opciones rápidas de día
  quickDays: [
    { id: "viernes", label: "Este Viernes", sub: "Al caer la tarde / noche" },
    { id: "sabado", label: "Este Sábado", sub: "Fin de semana sin prisas" },
    { id: "domingo", label: "Este Domingo", sub: "Plan tranquilo" },
    { id: "manana", label: "Mañana", sub: "Cualquier excusa es buena" },
  ],

  // Horarios organizados por momento del día
  timeGroups: [
    {
      period: "Tarde",
      times: ["1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"],
    },
    {
      period: "Atardecer",
      times: ["5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"],
    },
    {
      period: "Noche",
      times: ["8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM"],
    },
  ],

  // Menú curado de planes / antojos (Modal 3)
  cravingOptions: [
    {
      id: "sushi",
      icon: "utensils",
      title: "Sushi & Coctelería",
      desc: "Rollos especiales, buen ambiente y conversación",
    },
    {
      id: "italiana",
      icon: "wine",
      title: "Cena Italiana & Vino",
      desc: "Pastas artesanales o pizza a la leña",
    },
    {
      id: "cafe",
      icon: "coffee",
      title: "Café de Especialidad & Postre",
      desc: "Algo dulce en un lugar tranquilo y acogedor",
    },
    {
      id: "tacos",
      icon: "flame",
      title: "Tacos, Alitas & Tragos",
      desc: "Un plan relajado para reírnos y pasarla bien",
    },
    {
      id: "burgers",
      icon: "sandwich",
      title: "Burgers Artesanales",
      desc: "Comida rica, papas crujientes y cero formalidad",
    },
    {
      id: "helado",
      icon: "sunset",
      title: "Helados & Caminata al Atardecer",
      desc: "Caminar sin rumbo fijo mientras cae el sol",
    },
    {
      id: "tragos",
      icon: "martini",
      title: "Rooftop / Bar de Cocteles",
      desc: "Buena música, vista bonita y un par de copas",
    },
    {
      id: "cine",
      icon: "film",
      title: "Cine & Plan Nocturno",
      desc: "Una buena película y comer algo saliendo",
    },
    {
      id: "sorpresa",
      icon: "sparkles",
      title: "Dejarlo en mis manos (Sorpresa)",
      desc: "Yo elijo el lugar, tú solo preocúpate por disfrutar",
    },
    {
      id: "otro",
      icon: "pen",
      title: "Otro antojo en mente...",
      desc: "Escribe exactamente lo que tengas ganas hoy",
    },
  ],

  // Textos sutiles cuando intenta tocar el botón "No"
  noButtonPhrases: [
    "No por ahora",
    "¿Estás segura?",
    "Piénsalo un segundo",
    "Ese botón no funciona",
    "Intenta la otra opción",
    "Prometo que valdrá la pena",
  ],
};
