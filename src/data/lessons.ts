import type { Lesson } from "@/types/learning";

export const lessons: Lesson[] = [
  // ════════════════════════════════════════════════════════════════════════════
  // SPANISH
  // ════════════════════════════════════════════════════════════════════════════

  // ── es-lesson-1 · Greetings ────────────────────────────────────────────────
  {
    id: "es-lesson-1",
    unitId: "es-unit-1",
    languageCode: "es",
    title: "Greetings",
    description: "Say hello and goodbye in Spanish.",
    type: "vocabulary",
    xpReward: 10,
    estimatedMinutes: 5,
    vocabulary: [
      {
        id: "es-v-1",
        word: "Hola",
        translation: "Hello",
        phonetic: "OH-lah",
        exampleSentence: "¡Hola! ¿Cómo estás?",
        exampleTranslation: "Hello! How are you?",
      },
      {
        id: "es-v-2",
        word: "Adiós",
        translation: "Goodbye",
        phonetic: "ah-dee-OHS",
        exampleSentence: "Adiós, hasta mañana.",
        exampleTranslation: "Goodbye, see you tomorrow.",
      },
      {
        id: "es-v-3",
        word: "Buenos días",
        translation: "Good morning",
        phonetic: "BWAY-nohs DEE-ahs",
        exampleSentence: "Buenos días, señor.",
        exampleTranslation: "Good morning, sir.",
      },
      {
        id: "es-v-4",
        word: "Buenas noches",
        translation: "Good night",
        phonetic: "BWAY-nahs NOH-chehs",
        exampleSentence: "Buenas noches, que descanses.",
        exampleTranslation: "Good night, rest well.",
      },
    ],
    phrases: [
      {
        id: "es-p-1",
        phrase: "¿Cómo estás?",
        translation: "How are you?",
        phonetic: "KOH-moh ehs-TAHS",
        usage: "Informal greeting between friends.",
      },
      {
        id: "es-p-2",
        phrase: "Muy bien, gracias.",
        translation: "Very well, thank you.",
        phonetic: "mwee byehn, GRAH-syahs",
        usage: "Common response to ¿Cómo estás?",
      },
    ],
    activities: [
      {
        type: "multiple_choice",
        id: "es-a-1",
        prompt: "What does 'Hola' mean?",
        options: ["Goodbye", "Hello", "Thank you", "Please"],
        correctIndex: 1,
      },
      {
        type: "translate",
        id: "es-a-2",
        prompt: "Good morning",
        correctAnswer: "Buenos días",
        hints: ["Buenos", "días", "Buenas", "noches"],
      },
      {
        type: "match_pairs",
        id: "es-a-3",
        pairs: [
          { left: "Hola", right: "Hello" },
          { left: "Adiós", right: "Goodbye" },
          { left: "Buenos días", right: "Good morning" },
          { left: "Buenas noches", right: "Good night" },
        ],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are an upbeat Spanish teacher named Sofia. Teach the student basic Spanish greetings. Use simple explanations and encourage them enthusiastically. Always provide the phonetic pronunciation. Keep each response short and fun.",
      openingMessage:
        "¡Hola! I'm Sofia, your Spanish teacher! Today we're going to learn how to say hello and goodbye in Spanish. Ready? Let's go! 🎉",
      teachingGoals: [
        "Teach Hola, Adiós, Buenos días, Buenas noches",
        "Explain when to use each greeting",
        "Practice pronunciation of each word",
        "Quiz the student with simple questions",
      ],
    },
  },

  // ── es-lesson-2 · Introductions ───────────────────────────────────────────
  {
    id: "es-lesson-2",
    unitId: "es-unit-1",
    languageCode: "es",
    title: "Introductions",
    description: "Introduce yourself and ask someone's name.",
    type: "phrases",
    xpReward: 10,
    estimatedMinutes: 5,
    vocabulary: [
      {
        id: "es-v-5",
        word: "Me llamo",
        translation: "My name is",
        phonetic: "meh YAH-moh",
        exampleSentence: "Me llamo Ana.",
        exampleTranslation: "My name is Ana.",
      },
      {
        id: "es-v-6",
        word: "¿Cómo te llamas?",
        translation: "What is your name?",
        phonetic: "KOH-moh teh YAH-mahs",
      },
      {
        id: "es-v-7",
        word: "Mucho gusto",
        translation: "Nice to meet you",
        phonetic: "MOO-choh GOOS-toh",
      },
      {
        id: "es-v-8",
        word: "Soy de",
        translation: "I am from",
        phonetic: "soy deh",
        exampleSentence: "Soy de España.",
        exampleTranslation: "I am from Spain.",
      },
    ],
    phrases: [
      {
        id: "es-p-3",
        phrase: "¿De dónde eres?",
        translation: "Where are you from?",
        phonetic: "deh DON-deh EH-rehs",
      },
      {
        id: "es-p-4",
        phrase: "Encantado / Encantada",
        translation: "Delighted to meet you",
        phonetic: "ehn-kahn-TAH-doh / ehn-kahn-TAH-dah",
        usage: "Use -ado if you're male, -ada if you're female.",
      },
    ],
    activities: [
      {
        type: "fill_blank",
        id: "es-a-4",
        sentence: "___ llamo Carlos.",
        correctAnswer: "Me",
        options: ["Mi", "Me", "Yo", "Tu"],
      },
      {
        type: "multiple_choice",
        id: "es-a-5",
        prompt: "How do you say 'Nice to meet you'?",
        options: ["Adiós", "Hola", "Mucho gusto", "Gracias"],
        correctIndex: 2,
      },
      {
        type: "translate",
        id: "es-a-6",
        prompt: "My name is Maria.",
        correctAnswer: "Me llamo Maria.",
        hints: ["Me", "llamo", "Maria", "Soy", "la"],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are an enthusiastic Spanish teacher named Sofia. Help the student practice introducing themselves in Spanish. Keep it conversational — ask their name, where they're from, and model the correct phrases. Be encouraging and correct mistakes gently.",
      openingMessage:
        "¡Hola de nuevo! Today we're going to practice introductions. I'll start — ¡Me llamo Sofia! Now, ¿cómo te llamas?",
      teachingGoals: [
        "Teach Me llamo, ¿Cómo te llamas?, Mucho gusto",
        "Model a full self-introduction",
        "Have the student introduce themselves",
        "Teach ¿De dónde eres? and Soy de ...",
      ],
    },
  },

  // ── es-lesson-3 · Numbers 1–10 ────────────────────────────────────────────
  {
    id: "es-lesson-3",
    unitId: "es-unit-1",
    languageCode: "es",
    title: "Numbers 1–10",
    description: "Count from one to ten in Spanish.",
    type: "vocabulary",
    xpReward: 10,
    estimatedMinutes: 5,
    vocabulary: [
      { id: "es-v-9", word: "uno", translation: "one", phonetic: "OO-noh" },
      { id: "es-v-10", word: "dos", translation: "two", phonetic: "dohs" },
      { id: "es-v-11", word: "tres", translation: "three", phonetic: "trehs" },
      { id: "es-v-12", word: "cuatro", translation: "four", phonetic: "KWAH-troh" },
      { id: "es-v-13", word: "cinco", translation: "five", phonetic: "SEEN-koh" },
      { id: "es-v-14", word: "seis", translation: "six", phonetic: "says" },
      { id: "es-v-15", word: "siete", translation: "seven", phonetic: "SYEH-teh" },
      { id: "es-v-16", word: "ocho", translation: "eight", phonetic: "OH-choh" },
      { id: "es-v-17", word: "nueve", translation: "nine", phonetic: "NWEH-beh" },
      { id: "es-v-18", word: "diez", translation: "ten", phonetic: "dyehs" },
    ],
    phrases: [],
    activities: [
      {
        type: "multiple_choice",
        id: "es-a-7",
        prompt: "What does 'cinco' mean?",
        options: ["three", "seven", "five", "nine"],
        correctIndex: 2,
      },
      {
        type: "match_pairs",
        id: "es-a-8",
        pairs: [
          { left: "uno", right: "one" },
          { left: "tres", right: "three" },
          { left: "siete", right: "seven" },
          { left: "diez", right: "ten" },
        ],
      },
      {
        type: "translate",
        id: "es-a-9",
        prompt: "eight",
        correctAnswer: "ocho",
        hints: ["ocho", "nueve", "seis", "cinco"],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are Sofia, a fun Spanish teacher. Teach numbers 1–10 in Spanish by counting together, asking the student to recall numbers, and correcting mistakes with praise. Keep the energy high.",
      openingMessage:
        "¡Vamos a contar! Let's count together in Spanish. Repeat after me: uno, dos, tres... Ready?",
      teachingGoals: [
        "Teach numbers uno through diez",
        "Practice pronunciation",
        "Quiz: say a number in English, student responds in Spanish",
        "Count objects together in a short conversation",
      ],
    },
  },

  // ── es-lesson-4 · Family ──────────────────────────────────────────────────
  {
    id: "es-lesson-4",
    unitId: "es-unit-2",
    languageCode: "es",
    title: "Family",
    description: "Talk about your family members.",
    type: "vocabulary",
    xpReward: 15,
    estimatedMinutes: 7,
    vocabulary: [
      { id: "es-v-19", word: "madre", translation: "mother", phonetic: "MAH-dreh" },
      { id: "es-v-20", word: "padre", translation: "father", phonetic: "PAH-dreh" },
      { id: "es-v-21", word: "hermano", translation: "brother", phonetic: "ehr-MAH-noh" },
      { id: "es-v-22", word: "hermana", translation: "sister", phonetic: "ehr-MAH-nah" },
      { id: "es-v-23", word: "abuelo", translation: "grandfather", phonetic: "ah-BWEH-loh" },
      { id: "es-v-24", word: "abuela", translation: "grandmother", phonetic: "ah-BWEH-lah" },
    ],
    phrases: [
      {
        id: "es-p-5",
        phrase: "Tengo una hermana.",
        translation: "I have a sister.",
        phonetic: "TEHN-goh OO-nah ehr-MAH-nah",
      },
      {
        id: "es-p-6",
        phrase: "¿Tienes hermanos?",
        translation: "Do you have siblings?",
        phonetic: "TYEH-nehs ehr-MAH-nohs",
      },
    ],
    activities: [
      {
        type: "multiple_choice",
        id: "es-a-10",
        prompt: "What does 'abuela' mean?",
        options: ["mother", "aunt", "grandmother", "sister"],
        correctIndex: 2,
      },
      {
        type: "match_pairs",
        id: "es-a-11",
        pairs: [
          { left: "madre", right: "mother" },
          { left: "padre", right: "father" },
          { left: "hermano", right: "brother" },
          { left: "abuelo", right: "grandfather" },
        ],
      },
      {
        type: "translate",
        id: "es-a-12",
        prompt: "I have a brother.",
        correctAnswer: "Tengo un hermano.",
        hints: ["Tengo", "un", "una", "hermano", "hermana"],
      },
    ],
  },

  // ── es-lesson-5 · Describing People ──────────────────────────────────────
  {
    id: "es-lesson-5",
    unitId: "es-unit-2",
    languageCode: "es",
    title: "Describing People",
    description: "Use adjectives to describe people around you.",
    type: "grammar",
    xpReward: 15,
    estimatedMinutes: 7,
    vocabulary: [
      { id: "es-v-25", word: "alto / alta", translation: "tall", phonetic: "AHL-toh / AHL-tah" },
      { id: "es-v-26", word: "bajo / baja", translation: "short", phonetic: "BAH-hoh / BAH-hah" },
      { id: "es-v-27", word: "joven", translation: "young", phonetic: "HOH-behn" },
      { id: "es-v-28", word: "viejo / vieja", translation: "old", phonetic: "BYEH-hoh / BYEH-hah" },
      { id: "es-v-29", word: "simpático / simpática", translation: "friendly", phonetic: "seem-PAH-tee-koh" },
    ],
    phrases: [
      {
        id: "es-p-7",
        phrase: "Mi madre es alta.",
        translation: "My mother is tall.",
        phonetic: "mee MAH-dreh ehs AHL-tah",
      },
    ],
    activities: [
      {
        type: "fill_blank",
        id: "es-a-13",
        sentence: "Mi abuelo es ___.",
        correctAnswer: "viejo",
        options: ["joven", "alto", "viejo", "simpático"],
      },
      {
        type: "multiple_choice",
        id: "es-a-14",
        prompt: "How do you say 'short' (for a female)?",
        options: ["bajo", "baja", "alta", "joven"],
        correctIndex: 1,
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // FRENCH
  // ════════════════════════════════════════════════════════════════════════════

  // ── fr-lesson-1 · Greetings ───────────────────────────────────────────────
  {
    id: "fr-lesson-1",
    unitId: "fr-unit-1",
    languageCode: "fr",
    title: "Greetings",
    description: "Say hello and goodbye in French.",
    type: "vocabulary",
    xpReward: 10,
    estimatedMinutes: 5,
    vocabulary: [
      {
        id: "fr-v-1",
        word: "Bonjour",
        translation: "Hello / Good day",
        phonetic: "bohn-ZHOOR",
        exampleSentence: "Bonjour, comment allez-vous ?",
        exampleTranslation: "Hello, how are you?",
      },
      {
        id: "fr-v-2",
        word: "Bonsoir",
        translation: "Good evening",
        phonetic: "bohn-SWAHR",
      },
      {
        id: "fr-v-3",
        word: "Au revoir",
        translation: "Goodbye",
        phonetic: "oh reh-VWAHR",
      },
      {
        id: "fr-v-4",
        word: "Salut",
        translation: "Hi / Bye (informal)",
        phonetic: "sah-LOO",
        usage: "Used between friends.",
      },
    ],
    phrases: [
      {
        id: "fr-p-1",
        phrase: "Comment ça va ?",
        translation: "How are you? (informal)",
        phonetic: "koh-mahn sah VAH",
      },
      {
        id: "fr-p-2",
        phrase: "Ça va bien, merci.",
        translation: "I'm doing well, thank you.",
        phonetic: "sah vah byahn, mehr-SEE",
      },
    ],
    activities: [
      {
        type: "multiple_choice",
        id: "fr-a-1",
        prompt: "What does 'Au revoir' mean?",
        options: ["Hello", "Good evening", "Goodbye", "Thank you"],
        correctIndex: 2,
      },
      {
        type: "translate",
        id: "fr-a-2",
        prompt: "Good evening",
        correctAnswer: "Bonsoir",
        hints: ["Bonsoir", "Bonjour", "Salut", "Au revoir"],
      },
      {
        type: "match_pairs",
        id: "fr-a-3",
        pairs: [
          { left: "Bonjour", right: "Hello" },
          { left: "Au revoir", right: "Goodbye" },
          { left: "Bonsoir", right: "Good evening" },
          { left: "Salut", right: "Hi (informal)" },
        ],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are Claire, a warm and elegant French teacher. Teach basic French greetings. Emphasize the formal vs informal distinction (Bonjour vs Salut, Comment allez-vous vs Ça va). Keep explanations short and pronunciation tips clear.",
      openingMessage:
        "Bonjour ! I'm Claire, your French teacher. Today we'll learn how to greet people in French. Let's start — say 'Bonjour' after me!",
      teachingGoals: [
        "Teach Bonjour, Bonsoir, Au revoir, Salut",
        "Explain formal vs informal greetings",
        "Teach Comment ça va and Ça va bien, merci",
        "Practice with a short role-play greeting",
      ],
    },
  },

  // ── fr-lesson-2 · Introductions ───────────────────────────────────────────
  {
    id: "fr-lesson-2",
    unitId: "fr-unit-1",
    languageCode: "fr",
    title: "Introductions",
    description: "Introduce yourself in French.",
    type: "phrases",
    xpReward: 10,
    estimatedMinutes: 5,
    vocabulary: [
      {
        id: "fr-v-5",
        word: "Je m'appelle",
        translation: "My name is",
        phonetic: "zhuh mah-PEHL",
        exampleSentence: "Je m'appelle Claire.",
        exampleTranslation: "My name is Claire.",
      },
      {
        id: "fr-v-6",
        word: "Comment vous appelez-vous ?",
        translation: "What is your name? (formal)",
        phonetic: "koh-mahn vooz ah-play-VOO",
      },
      {
        id: "fr-v-7",
        word: "Enchanté / Enchantée",
        translation: "Nice to meet you",
        phonetic: "ahn-shahn-TAY",
        usage: "Add -e at the end if you are female.",
      },
      {
        id: "fr-v-8",
        word: "Je suis de",
        translation: "I am from",
        phonetic: "zhuh swee duh",
        exampleSentence: "Je suis de Paris.",
        exampleTranslation: "I am from Paris.",
      },
    ],
    phrases: [
      {
        id: "fr-p-3",
        phrase: "D'où êtes-vous ?",
        translation: "Where are you from? (formal)",
        phonetic: "doo eht-VOO",
      },
    ],
    activities: [
      {
        type: "fill_blank",
        id: "fr-a-4",
        sentence: "Je ___ Claire.",
        correctAnswer: "m'appelle",
        options: ["suis", "m'appelle", "appelle", "veux"],
      },
      {
        type: "multiple_choice",
        id: "fr-a-5",
        prompt: "How do you say 'Nice to meet you' in French?",
        options: ["Bonjour", "Au revoir", "Enchanté", "Merci"],
        correctIndex: 2,
      },
      {
        type: "translate",
        id: "fr-a-6",
        prompt: "My name is Paul.",
        correctAnswer: "Je m'appelle Paul.",
        hints: ["Je", "m'appelle", "Paul", "suis", "Je suis"],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are Claire, a French teacher. Guide the student through a simple French self-introduction. Ask their name and where they are from. Model the phrases and gently correct errors. Be warm and encouraging.",
      openingMessage:
        "Bonjour ! Let's learn to introduce ourselves in French. I'll go first — Je m'appelle Claire, et je suis de Lyon. Maintenant, à toi ! What's your name?",
      teachingGoals: [
        "Teach Je m'appelle and Comment vous appelez-vous",
        "Teach Je suis de ... for origin",
        "Teach Enchanté / Enchantée",
        "Have a full introduction exchange with the student",
      ],
    },
  },

  // ── fr-lesson-3 · Numbers 1–10 ────────────────────────────────────────────
  {
    id: "fr-lesson-3",
    unitId: "fr-unit-1",
    languageCode: "fr",
    title: "Numbers 1–10",
    description: "Count from one to ten in French.",
    type: "vocabulary",
    xpReward: 10,
    estimatedMinutes: 5,
    vocabulary: [
      { id: "fr-v-9", word: "un", translation: "one", phonetic: "uhn" },
      { id: "fr-v-10", word: "deux", translation: "two", phonetic: "duh" },
      { id: "fr-v-11", word: "trois", translation: "three", phonetic: "twah" },
      { id: "fr-v-12", word: "quatre", translation: "four", phonetic: "KAH-truh" },
      { id: "fr-v-13", word: "cinq", translation: "five", phonetic: "sank" },
      { id: "fr-v-14", word: "six", translation: "six", phonetic: "sees" },
      { id: "fr-v-15", word: "sept", translation: "seven", phonetic: "seht" },
      { id: "fr-v-16", word: "huit", translation: "eight", phonetic: "weet" },
      { id: "fr-v-17", word: "neuf", translation: "nine", phonetic: "nuhf" },
      { id: "fr-v-18", word: "dix", translation: "ten", phonetic: "dees" },
    ],
    phrases: [],
    activities: [
      {
        type: "multiple_choice",
        id: "fr-a-7",
        prompt: "What does 'huit' mean?",
        options: ["six", "eight", "ten", "four"],
        correctIndex: 1,
      },
      {
        type: "match_pairs",
        id: "fr-a-8",
        pairs: [
          { left: "un", right: "one" },
          { left: "cinq", right: "five" },
          { left: "sept", right: "seven" },
          { left: "dix", right: "ten" },
        ],
      },
    ],
  },

  // ── fr-lesson-4 · At the Café ─────────────────────────────────────────────
  {
    id: "fr-lesson-4",
    unitId: "fr-unit-2",
    languageCode: "fr",
    title: "At the Café",
    description: "Order drinks and snacks at a French café.",
    type: "phrases",
    xpReward: 15,
    estimatedMinutes: 7,
    vocabulary: [
      { id: "fr-v-19", word: "un café", translation: "a coffee", phonetic: "uhn kah-FAY" },
      { id: "fr-v-20", word: "un thé", translation: "a tea", phonetic: "uhn tay" },
      { id: "fr-v-21", word: "de l'eau", translation: "water", phonetic: "duh loh" },
      { id: "fr-v-22", word: "un croissant", translation: "a croissant", phonetic: "uhn kwah-SAHN" },
      { id: "fr-v-23", word: "l'addition", translation: "the bill / check", phonetic: "lah-dee-SYOHN" },
    ],
    phrases: [
      {
        id: "fr-p-4",
        phrase: "Je voudrais un café, s'il vous plaît.",
        translation: "I would like a coffee, please.",
        phonetic: "zhuh voo-DREH uhn kah-FAY seel voo pleh",
      },
      {
        id: "fr-p-5",
        phrase: "L'addition, s'il vous plaît.",
        translation: "The bill, please.",
        phonetic: "lah-dee-SYOHN seel voo pleh",
      },
    ],
    activities: [
      {
        type: "multiple_choice",
        id: "fr-a-9",
        prompt: "How do you ask for the bill?",
        options: [
          "Un café, s'il vous plaît.",
          "L'addition, s'il vous plaît.",
          "Bonjour !",
          "Je suis de Paris.",
        ],
        correctIndex: 1,
      },
      {
        type: "translate",
        id: "fr-a-10",
        prompt: "I would like a tea, please.",
        correctAnswer: "Je voudrais un thé, s'il vous plaît.",
        hints: ["Je", "voudrais", "un", "thé", "café", "s'il vous plaît"],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are Claire, playing the role of a friendly French café waiter AND teacher. Role-play a café scenario to help the student practice ordering in French. Correct mistakes naturally within the conversation.",
      openingMessage:
        "Bienvenue au café ! Welcome! Today we're going to practice ordering at a French café. I'll be the waiter — Qu'est-ce que vous désirez ? What would you like?",
      teachingGoals: [
        "Teach Je voudrais + item + s'il vous plaît",
        "Introduce café vocabulary: café, thé, eau, croissant",
        "Teach how to ask for the bill: L'addition, s'il vous plaît",
        "Complete a full café ordering role-play",
      ],
    },
  },

  // ── fr-lesson-5 · Food Vocabulary ────────────────────────────────────────
  {
    id: "fr-lesson-5",
    unitId: "fr-unit-2",
    languageCode: "fr",
    title: "Food Vocabulary",
    description: "Learn common French food words.",
    type: "vocabulary",
    xpReward: 15,
    estimatedMinutes: 7,
    vocabulary: [
      { id: "fr-v-24", word: "le pain", translation: "bread", phonetic: "luh pahn" },
      { id: "fr-v-25", word: "le fromage", translation: "cheese", phonetic: "luh froh-MAHZH" },
      { id: "fr-v-26", word: "la pomme", translation: "apple", phonetic: "lah pohm" },
      { id: "fr-v-27", word: "le poulet", translation: "chicken", phonetic: "luh poo-LEH" },
      { id: "fr-v-28", word: "les légumes", translation: "vegetables", phonetic: "lay lay-GYOOM" },
    ],
    phrases: [],
    activities: [
      {
        type: "match_pairs",
        id: "fr-a-11",
        pairs: [
          { left: "le pain", right: "bread" },
          { left: "le fromage", right: "cheese" },
          { left: "la pomme", right: "apple" },
          { left: "le poulet", right: "chicken" },
        ],
      },
      {
        type: "multiple_choice",
        id: "fr-a-12",
        prompt: "What does 'les légumes' mean?",
        options: ["fruits", "bread", "vegetables", "meat"],
        correctIndex: 2,
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // JAPANESE
  // ════════════════════════════════════════════════════════════════════════════

  // ── ja-lesson-1 · Greetings ───────────────────────────────────────────────
  {
    id: "ja-lesson-1",
    unitId: "ja-unit-1",
    languageCode: "ja",
    title: "Greetings",
    description: "Essential Japanese greetings for any time of day.",
    type: "vocabulary",
    xpReward: 10,
    estimatedMinutes: 5,
    vocabulary: [
      {
        id: "ja-v-1",
        word: "こんにちは",
        translation: "Hello / Good afternoon",
        phonetic: "Konnichiwa",
        exampleSentence: "こんにちは、田中さん。",
        exampleTranslation: "Hello, Tanaka-san.",
      },
      {
        id: "ja-v-2",
        word: "おはようございます",
        translation: "Good morning (formal)",
        phonetic: "Ohayō gozaimasu",
      },
      {
        id: "ja-v-3",
        word: "こんばんは",
        translation: "Good evening",
        phonetic: "Konbanwa",
      },
      {
        id: "ja-v-4",
        word: "さようなら",
        translation: "Goodbye",
        phonetic: "Sayōnara",
      },
      {
        id: "ja-v-5",
        word: "ありがとうございます",
        translation: "Thank you (formal)",
        phonetic: "Arigatō gozaimasu",
      },
    ],
    phrases: [
      {
        id: "ja-p-1",
        phrase: "お元気ですか？",
        translation: "How are you?",
        phonetic: "Ogenki desu ka?",
      },
      {
        id: "ja-p-2",
        phrase: "元気です。",
        translation: "I'm fine.",
        phonetic: "Genki desu.",
      },
    ],
    activities: [
      {
        type: "multiple_choice",
        id: "ja-a-1",
        prompt: "What does 'こんにちは' mean?",
        options: ["Good morning", "Goodbye", "Hello / Good afternoon", "Thank you"],
        correctIndex: 2,
      },
      {
        type: "match_pairs",
        id: "ja-a-2",
        pairs: [
          { left: "こんにちは", right: "Hello" },
          { left: "さようなら", right: "Goodbye" },
          { left: "こんばんは", right: "Good evening" },
          { left: "ありがとう", right: "Thank you" },
        ],
      },
      {
        type: "translate",
        id: "ja-a-3",
        prompt: "Good morning (formal)",
        correctAnswer: "おはようございます",
        hints: ["おはようございます", "こんにちは", "こんばんは", "さようなら"],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are Yuki, an encouraging Japanese teacher. Teach basic Japanese greetings. Explain the phonetic (romaji) for each phrase since the student is a beginner. Note the difference between formal and informal. Keep explanations short and fun.",
      openingMessage:
        "こんにちは！(Konnichiwa!) I'm Yuki, your Japanese teacher! Today we'll learn the most important Japanese greetings. Let's start with the basics!",
      teachingGoals: [
        "Teach こんにちは, おはようございます, こんばんは, さようなら",
        "Teach ありがとうございます",
        "Explain formal vs casual forms",
        "Practice お元気ですか and 元気です",
      ],
    },
  },

  // ── ja-lesson-2 · Introductions ───────────────────────────────────────────
  {
    id: "ja-lesson-2",
    unitId: "ja-unit-1",
    languageCode: "ja",
    title: "Introductions",
    description: "Introduce yourself in Japanese.",
    type: "phrases",
    xpReward: 10,
    estimatedMinutes: 5,
    vocabulary: [
      {
        id: "ja-v-6",
        word: "私の名前は〜です",
        translation: "My name is ~",
        phonetic: "Watashi no namae wa ~ desu",
        exampleSentence: "私の名前は田中です。",
        exampleTranslation: "My name is Tanaka.",
      },
      {
        id: "ja-v-7",
        word: "はじめまして",
        translation: "Nice to meet you",
        phonetic: "Hajimemashite",
      },
      {
        id: "ja-v-8",
        word: "よろしくお願いします",
        translation: "Please treat me kindly / Nice to meet you",
        phonetic: "Yoroshiku onegaishimasu",
        usage: "Said at the end of a formal introduction.",
      },
      {
        id: "ja-v-9",
        word: "〜から来ました",
        translation: "I am from ~",
        phonetic: "~ kara kimashita",
        exampleSentence: "アメリカから来ました。",
        exampleTranslation: "I am from America.",
      },
    ],
    phrases: [],
    activities: [
      {
        type: "multiple_choice",
        id: "ja-a-4",
        prompt: "What does 'はじめまして' mean?",
        options: ["Goodbye", "Thank you", "Nice to meet you", "Good morning"],
        correctIndex: 2,
      },
      {
        type: "fill_blank",
        id: "ja-a-5",
        sentence: "私の名前は田中___。",
        correctAnswer: "です",
        options: ["は", "が", "です", "を"],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are Yuki, a Japanese teacher. Guide the student through a Japanese self-introduction. Use romaji alongside Japanese script. Explain はじめまして and よろしくお願いします. Have the student introduce themselves step by step.",
      openingMessage:
        "こんにちは！Today we'll learn to introduce ourselves in Japanese. はじめまして！私の名前はYukiです。(Hajimemashite! Watashi no namae wa Yuki desu.) Your turn!",
      teachingGoals: [
        "Teach 私の名前は〜です",
        "Teach はじめまして and よろしくお願いします",
        "Teach 〜から来ました for origin",
        "Guide a full Japanese introduction role-play",
      ],
    },
  },

  // ── ja-lesson-3 · Numbers 1–10 ────────────────────────────────────────────
  {
    id: "ja-lesson-3",
    unitId: "ja-unit-1",
    languageCode: "ja",
    title: "Numbers 1–10",
    description: "Learn to count in Japanese.",
    type: "vocabulary",
    xpReward: 10,
    estimatedMinutes: 5,
    vocabulary: [
      { id: "ja-v-10", word: "一 (いち)", translation: "one", phonetic: "ichi" },
      { id: "ja-v-11", word: "二 (に)", translation: "two", phonetic: "ni" },
      { id: "ja-v-12", word: "三 (さん)", translation: "three", phonetic: "san" },
      { id: "ja-v-13", word: "四 (し/よん)", translation: "four", phonetic: "shi / yon" },
      { id: "ja-v-14", word: "五 (ご)", translation: "five", phonetic: "go" },
      { id: "ja-v-15", word: "六 (ろく)", translation: "six", phonetic: "roku" },
      { id: "ja-v-16", word: "七 (しち/なな)", translation: "seven", phonetic: "shichi / nana" },
      { id: "ja-v-17", word: "八 (はち)", translation: "eight", phonetic: "hachi" },
      { id: "ja-v-18", word: "九 (く/きゅう)", translation: "nine", phonetic: "ku / kyū" },
      { id: "ja-v-19", word: "十 (じゅう)", translation: "ten", phonetic: "jū" },
    ],
    phrases: [],
    activities: [
      {
        type: "multiple_choice",
        id: "ja-a-6",
        prompt: "What does 'はち' (hachi) mean?",
        options: ["six", "nine", "eight", "three"],
        correctIndex: 2,
      },
      {
        type: "match_pairs",
        id: "ja-a-7",
        pairs: [
          { left: "いち", right: "one" },
          { left: "ご", right: "five" },
          { left: "じゅう", right: "ten" },
          { left: "さん", right: "three" },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // GERMAN
  // ════════════════════════════════════════════════════════════════════════════

  // ── de-lesson-1 · Greetings ───────────────────────────────────────────────
  {
    id: "de-lesson-1",
    unitId: "de-unit-1",
    languageCode: "de",
    title: "Greetings",
    description: "Say hello and goodbye in German.",
    type: "vocabulary",
    xpReward: 10,
    estimatedMinutes: 5,
    vocabulary: [
      {
        id: "de-v-1",
        word: "Hallo",
        translation: "Hello",
        phonetic: "HAH-loh",
        exampleSentence: "Hallo! Wie geht es Ihnen?",
        exampleTranslation: "Hello! How are you?",
      },
      {
        id: "de-v-2",
        word: "Guten Morgen",
        translation: "Good morning",
        phonetic: "GOO-ten MOR-gen",
      },
      {
        id: "de-v-3",
        word: "Guten Abend",
        translation: "Good evening",
        phonetic: "GOO-ten AH-bent",
      },
      {
        id: "de-v-4",
        word: "Auf Wiedersehen",
        translation: "Goodbye (formal)",
        phonetic: "owf VEE-der-zayn",
      },
      {
        id: "de-v-5",
        word: "Tschüss",
        translation: "Bye (informal)",
        phonetic: "chyoos",
      },
    ],
    phrases: [
      {
        id: "de-p-1",
        phrase: "Wie geht es Ihnen?",
        translation: "How are you? (formal)",
        phonetic: "vee gayt es EE-nen",
      },
      {
        id: "de-p-2",
        phrase: "Danke, gut.",
        translation: "Thank you, fine.",
        phonetic: "DAHN-keh, goot",
      },
    ],
    activities: [
      {
        type: "multiple_choice",
        id: "de-a-1",
        prompt: "What does 'Auf Wiedersehen' mean?",
        options: ["Good morning", "Hello", "Goodbye (formal)", "Good evening"],
        correctIndex: 2,
      },
      {
        type: "match_pairs",
        id: "de-a-2",
        pairs: [
          { left: "Hallo", right: "Hello" },
          { left: "Guten Morgen", right: "Good morning" },
          { left: "Tschüss", right: "Bye (informal)" },
          { left: "Guten Abend", right: "Good evening" },
        ],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are Max, a friendly German teacher. Teach basic German greetings and explain the formal vs informal distinction. Keep explanations clear and short. Encourage the student after every correct response.",
      openingMessage:
        "Hallo! I'm Max, your German teacher. Willkommen! Today we'll learn how to greet people in German — both formally and casually. Ready? Let's go!",
      teachingGoals: [
        "Teach Hallo, Guten Morgen, Guten Abend, Auf Wiedersehen, Tschüss",
        "Explain formal (Auf Wiedersehen) vs casual (Tschüss)",
        "Teach Wie geht es Ihnen and Danke, gut",
        "Practice with a greeting dialogue",
      ],
    },
  },

  // ── de-lesson-2 · Introductions ───────────────────────────────────────────
  {
    id: "de-lesson-2",
    unitId: "de-unit-1",
    languageCode: "de",
    title: "Introductions",
    description: "Introduce yourself in German.",
    type: "phrases",
    xpReward: 10,
    estimatedMinutes: 5,
    vocabulary: [
      {
        id: "de-v-6",
        word: "Ich heiße",
        translation: "My name is",
        phonetic: "ikh HY-seh",
        exampleSentence: "Ich heiße Max.",
        exampleTranslation: "My name is Max.",
      },
      {
        id: "de-v-7",
        word: "Wie heißen Sie?",
        translation: "What is your name? (formal)",
        phonetic: "vee HY-sen zee",
      },
      {
        id: "de-v-8",
        word: "Freut mich",
        translation: "Nice to meet you",
        phonetic: "froyt mikh",
      },
      {
        id: "de-v-9",
        word: "Ich komme aus",
        translation: "I come from",
        phonetic: "ikh KOM-meh ows",
        exampleSentence: "Ich komme aus Deutschland.",
        exampleTranslation: "I come from Germany.",
      },
    ],
    phrases: [],
    activities: [
      {
        type: "fill_blank",
        id: "de-a-3",
        sentence: "Ich ___ Max.",
        correctAnswer: "heiße",
        options: ["bin", "heiße", "komme", "habe"],
      },
      {
        type: "multiple_choice",
        id: "de-a-4",
        prompt: "How do you say 'Nice to meet you'?",
        options: ["Hallo", "Danke", "Freut mich", "Tschüss"],
        correctIndex: 2,
      },
    ],
  },

  // ── de-lesson-3 · Numbers 1–10 ────────────────────────────────────────────
  {
    id: "de-lesson-3",
    unitId: "de-unit-1",
    languageCode: "de",
    title: "Numbers 1–10",
    description: "Count from one to ten in German.",
    type: "vocabulary",
    xpReward: 10,
    estimatedMinutes: 5,
    vocabulary: [
      { id: "de-v-10", word: "eins", translation: "one", phonetic: "ynts" },
      { id: "de-v-11", word: "zwei", translation: "two", phonetic: "tsvy" },
      { id: "de-v-12", word: "drei", translation: "three", phonetic: "dry" },
      { id: "de-v-13", word: "vier", translation: "four", phonetic: "feer" },
      { id: "de-v-14", word: "fünf", translation: "five", phonetic: "fynf" },
      { id: "de-v-15", word: "sechs", translation: "six", phonetic: "zeks" },
      { id: "de-v-16", word: "sieben", translation: "seven", phonetic: "ZEE-ben" },
      { id: "de-v-17", word: "acht", translation: "eight", phonetic: "akht" },
      { id: "de-v-18", word: "neun", translation: "nine", phonetic: "noyn" },
      { id: "de-v-19", word: "zehn", translation: "ten", phonetic: "tsayn" },
    ],
    phrases: [],
    activities: [
      {
        type: "multiple_choice",
        id: "de-a-5",
        prompt: "What does 'sieben' mean?",
        options: ["six", "eight", "seven", "nine"],
        correctIndex: 2,
      },
      {
        type: "match_pairs",
        id: "de-a-6",
        pairs: [
          { left: "eins", right: "one" },
          { left: "fünf", right: "five" },
          { left: "acht", right: "eight" },
          { left: "zehn", right: "ten" },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // PORTUGUESE
  // ════════════════════════════════════════════════════════════════════════════

  // ── pt-lesson-1 · Greetings ───────────────────────────────────────────────
  {
    id: "pt-lesson-1",
    unitId: "pt-unit-1",
    languageCode: "pt",
    title: "Greetings",
    description: "Say hello and goodbye in Portuguese.",
    type: "vocabulary",
    xpReward: 10,
    estimatedMinutes: 5,
    vocabulary: [
      {
        id: "pt-v-1",
        word: "Olá",
        translation: "Hello",
        phonetic: "oh-LAH",
        exampleSentence: "Olá! Tudo bem?",
        exampleTranslation: "Hello! Everything good?",
      },
      {
        id: "pt-v-2",
        word: "Bom dia",
        translation: "Good morning",
        phonetic: "bohn JEE-ah",
      },
      {
        id: "pt-v-3",
        word: "Boa noite",
        translation: "Good night",
        phonetic: "BOH-ah NOY-cheh",
      },
      {
        id: "pt-v-4",
        word: "Tchau",
        translation: "Bye",
        phonetic: "chow",
      },
    ],
    phrases: [
      {
        id: "pt-p-1",
        phrase: "Tudo bem?",
        translation: "Everything good? / How are you?",
        phonetic: "TOO-doo behm",
      },
      {
        id: "pt-p-2",
        phrase: "Tudo bem, obrigado/a.",
        translation: "All good, thank you.",
        phonetic: "TOO-doo behm, oh-bree-GAH-doo / oh-bree-GAH-dah",
        usage: "Use obrigado if male, obrigada if female.",
      },
    ],
    activities: [
      {
        type: "multiple_choice",
        id: "pt-a-1",
        prompt: "What does 'Bom dia' mean?",
        options: ["Good night", "Goodbye", "Good morning", "Hello"],
        correctIndex: 2,
      },
      {
        type: "match_pairs",
        id: "pt-a-2",
        pairs: [
          { left: "Olá", right: "Hello" },
          { left: "Tchau", right: "Bye" },
          { left: "Bom dia", right: "Good morning" },
          { left: "Boa noite", right: "Good night" },
        ],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are Ana, a cheerful Brazilian Portuguese teacher. Teach basic greetings and the difference between obrigado and obrigada. Keep it casual and fun — Brazilian Portuguese is warm and friendly.",
      openingMessage:
        "Olá! Tudo bem? I'm Ana, your Portuguese teacher! Today we'll learn how to greet people in Brazilian Portuguese. Vamos lá — let's go!",
      teachingGoals: [
        "Teach Olá, Bom dia, Boa noite, Tchau",
        "Teach Tudo bem? and the reply Tudo bem, obrigado/a",
        "Explain obrigado vs obrigada (gender agreement)",
        "Practice a full greeting exchange",
      ],
    },
  },

  // ── pt-lesson-2 · Introductions ───────────────────────────────────────────
  {
    id: "pt-lesson-2",
    unitId: "pt-unit-1",
    languageCode: "pt",
    title: "Introductions",
    description: "Introduce yourself in Portuguese.",
    type: "phrases",
    xpReward: 10,
    estimatedMinutes: 5,
    vocabulary: [
      {
        id: "pt-v-5",
        word: "Meu nome é",
        translation: "My name is",
        phonetic: "meh-oo NOH-meh eh",
        exampleSentence: "Meu nome é Ana.",
        exampleTranslation: "My name is Ana.",
      },
      {
        id: "pt-v-6",
        word: "Prazer",
        translation: "Nice to meet you",
        phonetic: "prah-ZEHR",
      },
      {
        id: "pt-v-7",
        word: "Sou do/da",
        translation: "I am from",
        phonetic: "soh doo / dah",
        exampleSentence: "Sou do Brasil.",
        exampleTranslation: "I am from Brazil.",
      },
    ],
    phrases: [],
    activities: [
      {
        type: "multiple_choice",
        id: "pt-a-3",
        prompt: "How do you say 'Nice to meet you'?",
        options: ["Obrigado", "Prazer", "Tchau", "Olá"],
        correctIndex: 1,
      },
      {
        type: "translate",
        id: "pt-a-4",
        prompt: "My name is Lucas.",
        correctAnswer: "Meu nome é Lucas.",
        hints: ["Meu", "nome", "é", "Lucas", "sou"],
      },
    ],
  },

  // ── pt-lesson-3 · Numbers 1–10 ────────────────────────────────────────────
  {
    id: "pt-lesson-3",
    unitId: "pt-unit-1",
    languageCode: "pt",
    title: "Numbers 1–10",
    description: "Count from one to ten in Portuguese.",
    type: "vocabulary",
    xpReward: 10,
    estimatedMinutes: 5,
    vocabulary: [
      { id: "pt-v-8", word: "um / uma", translation: "one", phonetic: "oom / OO-mah" },
      { id: "pt-v-9", word: "dois / duas", translation: "two", phonetic: "doysh / DOO-ahs" },
      { id: "pt-v-10", word: "três", translation: "three", phonetic: "treysh" },
      { id: "pt-v-11", word: "quatro", translation: "four", phonetic: "KWAH-troo" },
      { id: "pt-v-12", word: "cinco", translation: "five", phonetic: "SEEN-koo" },
      { id: "pt-v-13", word: "seis", translation: "six", phonetic: "saysh" },
      { id: "pt-v-14", word: "sete", translation: "seven", phonetic: "SEH-cheh" },
      { id: "pt-v-15", word: "oito", translation: "eight", phonetic: "OY-too" },
      { id: "pt-v-16", word: "nove", translation: "nine", phonetic: "NOH-veh" },
      { id: "pt-v-17", word: "dez", translation: "ten", phonetic: "desh" },
    ],
    phrases: [],
    activities: [
      {
        type: "multiple_choice",
        id: "pt-a-5",
        prompt: "What does 'oito' mean?",
        options: ["six", "nine", "seven", "eight"],
        correctIndex: 3,
      },
      {
        type: "match_pairs",
        id: "pt-a-6",
        pairs: [
          { left: "um", right: "one" },
          { left: "cinco", right: "five" },
          { left: "oito", right: "eight" },
          { left: "dez", right: "ten" },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // JAPANESE — Unit 2
  // ════════════════════════════════════════════════════════════════════════════

  // ── ja-lesson-4 · At the Restaurant ──────────────────────────────────────
  {
    id: "ja-lesson-4",
    unitId: "ja-unit-2",
    languageCode: "ja",
    title: "At the Restaurant",
    description: "Order food and drinks at a Japanese restaurant.",
    type: "phrases",
    xpReward: 15,
    estimatedMinutes: 7,
    vocabulary: [
      { id: "ja-v-20", word: "メニュー", translation: "menu", phonetic: "menyū" },
      { id: "ja-v-21", word: "おすすめ", translation: "recommendation / special", phonetic: "osusume" },
      { id: "ja-v-22", word: "お水", translation: "water", phonetic: "omizu" },
      { id: "ja-v-23", word: "おいしい", translation: "delicious", phonetic: "oishii" },
      { id: "ja-v-24", word: "お会計", translation: "the bill / check", phonetic: "okaikei" },
    ],
    phrases: [
      {
        id: "ja-p-3",
        phrase: "これをください。",
        translation: "I'll have this, please.",
        phonetic: "Kore wo kudasai.",
      },
      {
        id: "ja-p-4",
        phrase: "お会計をお願いします。",
        translation: "Check, please.",
        phonetic: "Okaikei wo onegaishimasu.",
      },
    ],
    activities: [
      {
        type: "multiple_choice",
        id: "ja-a-8",
        prompt: "How do you say 'delicious'?",
        options: ["おいしい", "おなか", "おみず", "おしごと"],
        correctIndex: 0,
      },
      {
        type: "translate",
        id: "ja-a-9",
        prompt: "Check, please.",
        correctAnswer: "お会計をお願いします。",
        hints: ["お会計", "を", "お願いします", "ください"],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are Yuki, a Japanese teacher. Role-play a restaurant scenario. Help the student order food using これをください and ask for the bill. Keep the conversation fun and practical.",
      openingMessage:
        "いらっしゃいませ！Welcome! Today we're practicing at a Japanese restaurant. I'm the waiter — ご注文はお決まりですか？ (Gochuumon wa okimari desu ka?) — Are you ready to order?",
      teachingGoals: [
        "Teach これをください for ordering",
        "Introduce restaurant vocabulary: メニュー, おすすめ, おいしい",
        "Teach お会計をお願いします for asking the bill",
        "Complete a full ordering role-play",
      ],
    },
  },

  // ── ja-lesson-5 · Family ──────────────────────────────────────────────────
  {
    id: "ja-lesson-5",
    unitId: "ja-unit-2",
    languageCode: "ja",
    title: "Family",
    description: "Talk about family members in Japanese.",
    type: "vocabulary",
    xpReward: 15,
    estimatedMinutes: 7,
    vocabulary: [
      { id: "ja-v-25", word: "お母さん", translation: "mother", phonetic: "okāsan" },
      { id: "ja-v-26", word: "お父さん", translation: "father", phonetic: "otōsan" },
      { id: "ja-v-27", word: "兄 (あに)", translation: "older brother", phonetic: "ani" },
      { id: "ja-v-28", word: "姉 (あね)", translation: "older sister", phonetic: "ane" },
      { id: "ja-v-29", word: "家族 (かぞく)", translation: "family", phonetic: "kazoku" },
    ],
    phrases: [
      {
        id: "ja-p-5",
        phrase: "家族は四人です。",
        translation: "There are four people in my family.",
        phonetic: "Kazoku wa yonin desu.",
      },
    ],
    activities: [
      {
        type: "multiple_choice",
        id: "ja-a-10",
        prompt: "What does 'お母さん' mean?",
        options: ["father", "mother", "sister", "brother"],
        correctIndex: 1,
      },
      {
        type: "match_pairs",
        id: "ja-a-11",
        pairs: [
          { left: "お母さん", right: "mother" },
          { left: "お父さん", right: "father" },
          { left: "兄", right: "older brother" },
          { left: "姉", right: "older sister" },
        ],
      },
    ],
  },

  // ── ja-lesson-6 · Time & Dates ────────────────────────────────────────────
  {
    id: "ja-lesson-6",
    unitId: "ja-unit-2",
    languageCode: "ja",
    title: "Time & Dates",
    description: "Ask and tell the time in Japanese.",
    type: "vocabulary",
    xpReward: 15,
    estimatedMinutes: 7,
    vocabulary: [
      { id: "ja-v-30", word: "今、何時ですか？", translation: "What time is it now?", phonetic: "Ima, nanji desu ka?" },
      { id: "ja-v-31", word: "〜時 (じ)", translation: "o'clock", phonetic: "~ji" },
      { id: "ja-v-32", word: "午前 (ごぜん)", translation: "AM / morning", phonetic: "gozen" },
      { id: "ja-v-33", word: "午後 (ごご)", translation: "PM / afternoon", phonetic: "gogo" },
      { id: "ja-v-34", word: "〜分 (ふん)", translation: "minutes", phonetic: "~fun" },
    ],
    phrases: [
      {
        id: "ja-p-6",
        phrase: "三時です。",
        translation: "It is three o'clock.",
        phonetic: "Sanji desu.",
      },
    ],
    activities: [
      {
        type: "multiple_choice",
        id: "ja-a-12",
        prompt: "What does '午前' mean?",
        options: ["PM / afternoon", "evening", "AM / morning", "night"],
        correctIndex: 2,
      },
      {
        type: "translate",
        id: "ja-a-13",
        prompt: "It is three o'clock.",
        correctAnswer: "三時です。",
        hints: ["三時", "です", "四時", "二時"],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // GERMAN — Unit 2
  // ════════════════════════════════════════════════════════════════════════════

  // ── de-lesson-4 · At the Restaurant ──────────────────────────────────────
  {
    id: "de-lesson-4",
    unitId: "de-unit-2",
    languageCode: "de",
    title: "At the Restaurant",
    description: "Order food and ask for the bill in German.",
    type: "phrases",
    xpReward: 15,
    estimatedMinutes: 7,
    vocabulary: [
      { id: "de-v-20", word: "die Speisekarte", translation: "the menu", phonetic: "dee SHPY-zeh-kar-teh" },
      { id: "de-v-21", word: "das Wasser", translation: "water", phonetic: "dahs VAH-ser" },
      { id: "de-v-22", word: "das Brot", translation: "bread", phonetic: "dahs broht" },
      { id: "de-v-23", word: "lecker", translation: "delicious / tasty", phonetic: "LEK-er" },
      { id: "de-v-24", word: "die Rechnung", translation: "the bill", phonetic: "dee RECH-nung" },
    ],
    phrases: [
      {
        id: "de-p-3",
        phrase: "Ich hätte gern...",
        translation: "I would like...",
        phonetic: "ikh HEH-teh gehrn",
      },
      {
        id: "de-p-4",
        phrase: "Die Rechnung, bitte.",
        translation: "The bill, please.",
        phonetic: "dee RECH-nung, BIT-teh",
      },
    ],
    activities: [
      {
        type: "multiple_choice",
        id: "de-a-7",
        prompt: "How do you ask for the bill?",
        options: ["Danke schön.", "Die Rechnung, bitte.", "Guten Appetit.", "Prost!"],
        correctIndex: 1,
      },
      {
        type: "translate",
        id: "de-a-8",
        prompt: "I would like water, please.",
        correctAnswer: "Ich hätte gern Wasser, bitte.",
        hints: ["Ich", "hätte", "gern", "Wasser", "bitte"],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are Max, a German teacher. Role-play a restaurant scene. Help the student order using 'Ich hätte gern' and ask for the bill. Be encouraging and correct mistakes gently.",
      openingMessage:
        "Willkommen im Restaurant! Today we'll practice ordering in German. I'll be the waiter — Was darf es sein? What would you like?",
      teachingGoals: [
        "Teach Ich hätte gern + item",
        "Introduce vocabulary: Speisekarte, Wasser, Brot, lecker",
        "Teach Die Rechnung, bitte",
        "Complete a restaurant role-play",
      ],
    },
  },

  // ── de-lesson-5 · Family ──────────────────────────────────────────────────
  {
    id: "de-lesson-5",
    unitId: "de-unit-2",
    languageCode: "de",
    title: "Family",
    description: "Talk about your family in German.",
    type: "vocabulary",
    xpReward: 15,
    estimatedMinutes: 7,
    vocabulary: [
      { id: "de-v-25", word: "die Mutter", translation: "mother", phonetic: "dee MUT-ter" },
      { id: "de-v-26", word: "der Vater", translation: "father", phonetic: "dehr FAH-ter" },
      { id: "de-v-27", word: "der Bruder", translation: "brother", phonetic: "dehr BROO-der" },
      { id: "de-v-28", word: "die Schwester", translation: "sister", phonetic: "dee SHVES-ter" },
      { id: "de-v-29", word: "die Familie", translation: "family", phonetic: "dee fah-MEE-lyeh" },
    ],
    phrases: [
      {
        id: "de-p-5",
        phrase: "Ich habe einen Bruder.",
        translation: "I have a brother.",
        phonetic: "ikh HAH-beh EYE-nen BROO-der",
      },
      {
        id: "de-p-6",
        phrase: "Hast du Geschwister?",
        translation: "Do you have siblings?",
        phonetic: "hahst doo geh-SHVIS-ter",
      },
    ],
    activities: [
      {
        type: "match_pairs",
        id: "de-a-9",
        pairs: [
          { left: "die Mutter", right: "mother" },
          { left: "der Vater", right: "father" },
          { left: "der Bruder", right: "brother" },
          { left: "die Schwester", right: "sister" },
        ],
      },
      {
        type: "multiple_choice",
        id: "de-a-10",
        prompt: "How do you say 'family' in German?",
        options: ["der Freund", "die Familie", "der Bruder", "die Mutter"],
        correctIndex: 1,
      },
    ],
  },

  // ── de-lesson-6 · Shopping ────────────────────────────────────────────────
  {
    id: "de-lesson-6",
    unitId: "de-unit-2",
    languageCode: "de",
    title: "Shopping",
    description: "Shop and ask about prices in German.",
    type: "phrases",
    xpReward: 15,
    estimatedMinutes: 7,
    vocabulary: [
      { id: "de-v-30", word: "das Geschäft", translation: "the shop / store", phonetic: "dahs geh-SHEFT" },
      { id: "de-v-31", word: "Was kostet das?", translation: "How much does this cost?", phonetic: "vahs KOS-tet dahs" },
      { id: "de-v-32", word: "teuer", translation: "expensive", phonetic: "TOY-er" },
      { id: "de-v-33", word: "billig", translation: "cheap", phonetic: "BIL-ikh" },
      { id: "de-v-34", word: "Ich nehme das.", translation: "I'll take it.", phonetic: "ikh NEH-meh dahs" },
    ],
    phrases: [
      {
        id: "de-p-7",
        phrase: "Haben Sie das in einer anderen Größe?",
        translation: "Do you have this in another size?",
        phonetic: "HAH-ben zee dahs in EYE-ner AN-deh-ren GROH-seh",
      },
    ],
    activities: [
      {
        type: "multiple_choice",
        id: "de-a-11",
        prompt: "How do you ask 'How much does this cost?'",
        options: ["Das ist teuer.", "Was kostet das?", "Ich nehme das.", "Wo ist das Geschäft?"],
        correctIndex: 1,
      },
      {
        type: "translate",
        id: "de-a-12",
        prompt: "I'll take it.",
        correctAnswer: "Ich nehme das.",
        hints: ["Ich", "nehme", "das", "kaufe", "habe"],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // PORTUGUESE — Unit 2
  // ════════════════════════════════════════════════════════════════════════════

  // ── pt-lesson-4 · At the Restaurant ──────────────────────────────────────
  {
    id: "pt-lesson-4",
    unitId: "pt-unit-2",
    languageCode: "pt",
    title: "At the Restaurant",
    description: "Order food and drinks at a Brazilian restaurant.",
    type: "phrases",
    xpReward: 15,
    estimatedMinutes: 7,
    vocabulary: [
      { id: "pt-v-18", word: "o cardápio", translation: "the menu", phonetic: "oo kar-DAH-pyoo" },
      { id: "pt-v-19", word: "a água", translation: "water", phonetic: "ah AH-gwah" },
      { id: "pt-v-20", word: "gostoso / gostosa", translation: "tasty / delicious", phonetic: "goh-STOH-zoo / goh-STOH-zah" },
      { id: "pt-v-21", word: "a conta", translation: "the bill", phonetic: "ah KON-tah" },
      { id: "pt-v-22", word: "o prato do dia", translation: "today's special", phonetic: "oo PRAH-too doo JEE-ah" },
    ],
    phrases: [
      {
        id: "pt-p-3",
        phrase: "Eu quero isso, por favor.",
        translation: "I want this, please.",
        phonetic: "eoo KER-oo EE-soo, por fah-VOR",
      },
      {
        id: "pt-p-4",
        phrase: "A conta, por favor.",
        translation: "The bill, please.",
        phonetic: "ah KON-tah, por fah-VOR",
      },
    ],
    activities: [
      {
        type: "multiple_choice",
        id: "pt-a-7",
        prompt: "How do you ask for the bill?",
        options: ["Obrigado!", "A conta, por favor.", "Tudo bem?", "Bom dia!"],
        correctIndex: 1,
      },
      {
        type: "translate",
        id: "pt-a-8",
        prompt: "I want this, please.",
        correctAnswer: "Eu quero isso, por favor.",
        hints: ["Eu", "quero", "isso", "por favor", "obrigado"],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are Ana, a Brazilian Portuguese teacher. Role-play a restaurant scenario. Teach the student to order food and ask for the bill. Keep the energy warm and fun — Brazilian Portuguese style!",
      openingMessage:
        "Oi! Bem-vindo ao restaurante! Today we practice ordering food in Portuguese. I'll be your waiter — O que você vai querer? What would you like?",
      teachingGoals: [
        "Teach Eu quero + item + por favor",
        "Introduce vocabulary: cardápio, água, gostoso, conta",
        "Teach A conta, por favor",
        "Complete a full restaurant role-play",
      ],
    },
  },

  // ── pt-lesson-5 · Family ──────────────────────────────────────────────────
  {
    id: "pt-lesson-5",
    unitId: "pt-unit-2",
    languageCode: "pt",
    title: "Family",
    description: "Talk about your family in Portuguese.",
    type: "vocabulary",
    xpReward: 15,
    estimatedMinutes: 7,
    vocabulary: [
      { id: "pt-v-23", word: "a mãe", translation: "mother", phonetic: "ah mahn" },
      { id: "pt-v-24", word: "o pai", translation: "father", phonetic: "oo py" },
      { id: "pt-v-25", word: "o irmão", translation: "brother", phonetic: "oo eer-MAHN" },
      { id: "pt-v-26", word: "a irmã", translation: "sister", phonetic: "ah eer-MAH" },
      { id: "pt-v-27", word: "a família", translation: "family", phonetic: "ah fah-MEE-lyah" },
    ],
    phrases: [
      {
        id: "pt-p-5",
        phrase: "Tenho dois irmãos.",
        translation: "I have two brothers.",
        phonetic: "TEHN-yoo doysh eer-MAHNS",
      },
      {
        id: "pt-p-6",
        phrase: "Você tem irmãos?",
        translation: "Do you have siblings?",
        phonetic: "voh-SAY tehm eer-MAHNS",
      },
    ],
    activities: [
      {
        type: "match_pairs",
        id: "pt-a-9",
        pairs: [
          { left: "a mãe", right: "mother" },
          { left: "o pai", right: "father" },
          { left: "o irmão", right: "brother" },
          { left: "a irmã", right: "sister" },
        ],
      },
      {
        type: "multiple_choice",
        id: "pt-a-10",
        prompt: "How do you say 'family' in Portuguese?",
        options: ["o amigo", "a família", "o irmão", "a mãe"],
        correctIndex: 1,
      },
    ],
  },

  // ── pt-lesson-6 · Travel ──────────────────────────────────────────────────
  {
    id: "pt-lesson-6",
    unitId: "pt-unit-2",
    languageCode: "pt",
    title: "Travel",
    description: "Navigate transportation and ask for directions in Portuguese.",
    type: "phrases",
    xpReward: 15,
    estimatedMinutes: 7,
    vocabulary: [
      { id: "pt-v-28", word: "o aeroporto", translation: "the airport", phonetic: "oo ah-eh-roh-POR-too" },
      { id: "pt-v-29", word: "o ônibus", translation: "the bus", phonetic: "oo OH-nee-boos" },
      { id: "pt-v-30", word: "Onde é...?", translation: "Where is...?", phonetic: "ON-jeh eh" },
      { id: "pt-v-31", word: "à direita", translation: "to the right", phonetic: "ah dee-RAY-tah" },
      { id: "pt-v-32", word: "à esquerda", translation: "to the left", phonetic: "ah ehs-KEHR-dah" },
    ],
    phrases: [
      {
        id: "pt-p-7",
        phrase: "Onde fica a estação de metrô?",
        translation: "Where is the subway station?",
        phonetic: "ON-jeh FEE-kah ah ehs-tah-SAHN jeh meh-TROH",
      },
    ],
    activities: [
      {
        type: "multiple_choice",
        id: "pt-a-11",
        prompt: "What does 'à esquerda' mean?",
        options: ["to the right", "straight ahead", "to the left", "behind"],
        correctIndex: 2,
      },
      {
        type: "translate",
        id: "pt-a-12",
        prompt: "Where is the airport?",
        correctAnswer: "Onde é o aeroporto?",
        hints: ["Onde", "é", "o", "aeroporto", "ônibus"],
      },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getLessonsByUnit(unitId: string): Lesson[] {
  return lessons.filter((l) => l.unitId === unitId);
}

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function getLessonsByLanguage(languageCode: string): Lesson[] {
  return lessons.filter((l) => l.languageCode === languageCode);
}
