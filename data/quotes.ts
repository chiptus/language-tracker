export const MOTIVATIONAL_QUOTES = [
  {
    text: "El límite de tu lenguaje es el límite de tu mundo.",
    translation: "The limit of your language is the limit of your world.",
    author: "Ludwig Wittgenstein"
  },
  {
    text: "Cada idioma es una forma diferente de ver la vida.",
    translation: "Every language is a different way of seeing life.",
    author: "Federico Fellini"
  },
  {
    text: "Quien no conoce idiomas extranjeros nada sabe del suyo propio.",
    translation: "He who knows no foreign languages knows nothing of his own.",
    author: "Johann Wolfgang von Goethe"
  },
  {
    text: "Un idioma diferente es una visión diferente de la vida.",
    translation: "A different language is a different vision of life.",
    author: "Federico Fellini"
  },
  {
    text: "Aprender otro idioma no es solo aprender diferentes palabras para las mismas cosas, sino aprender otra forma de pensar sobre las cosas.",
    translation: "Learning another language is not only learning different words for the same things, but learning another way to think about things.",
    author: "Flora Lewis"
  },
  {
    text: "Si hablas a un hombre en un idioma que entiende, eso le llega a su cabeza. Si le hablas en su idioma, eso le llega a su corazón.",
    translation: "If you talk to a man in a language he understands, that goes to his head. If you talk to him in his language, that goes to his heart.",
    author: "Nelson Mandela"
  },
  {
    text: "Los límites de mi idioma significan los límites de mi mundo.",
    translation: "The limits of my language mean the limits of my world.",
    author: "Ludwig Wittgenstein"
  },
  {
    text: "Cambiar de idioma es cambiar de personalidad.",
    translation: "To change language is to change personality.",
    author: "Charlemagne"
  }
];

export const WEEKLY_REVIEW_QUOTES = [
  {
    text: "¡Cada pequeño paso cuenta en tu viaje de aprendizaje!",
    translation: "Every small step counts in your learning journey!"
  },
  {
    text: "El progreso, no la perfección, es el objetivo.",
    translation: "Progress, not perfection, is the goal."
  },
  {
    text: "Cada minuto practicando te acerca más a la fluidez.",
    translation: "Every minute practicing brings you closer to fluency."
  },
  {
    text: "¡Tu dedicación de esta semana es admirable!",
    translation: "Your dedication this week is admirable!"
  },
  {
    text: "El aprendizaje es un maratón, no una carrera de velocidad.",
    translation: "Learning is a marathon, not a sprint."
  }
];

export function getRandomQuote(quotes: typeof MOTIVATIONAL_QUOTES): typeof MOTIVATIONAL_QUOTES[0] {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getQuoteForWeek(weekNumber: number): typeof WEEKLY_REVIEW_QUOTES[0] {
  return WEEKLY_REVIEW_QUOTES[weekNumber % WEEKLY_REVIEW_QUOTES.length];
}