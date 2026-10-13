// Lesson content. Each lesson follows the same 5-step template:
// hello (warm-up + quick review) -> learn (word cards) -> watch (video) -> play (listen & tap + speak) -> stars
// Only lessons with ready:true are playable. To add a lesson: copy a ready lesson, change the content, set ready:true.
// Video IDs were checked on the official supersimple.com song pages (13 Oct 2026).
// Content follows the family's 4-week plan (PDF + ChatGPT lesson plan).

window.LESSONS = [
  // ---------------- WEEK 1 — Hello, my name is… ----------------
  {
    id: "w1d1", week: 1, day: "Monday", title: "Hello!", emoji: "👋", ready: true,
    warmup: {
      say: "Hello, {name}! Can you say hello?",
      prompt: "Wave and say: Hello!",
      parent: "Faites un grand signe de la main avec elle. Un geste suffit si elle ne parle pas encore."
    },
    cards: [
      { word: "hello", emoji: "👋", say: "Hello!" },
      { word: "goodbye", emoji: "🙋‍♀️", say: "Goodbye!" },
      { word: "yes", emoji: "👍", say: "Yes!" },
      { word: "no", emoji: "👎", say: "No!" }
    ],
    video: { title: "Hello! — Super Simple Songs", youtubeId: "tVlcKp3bWH8", page: "https://supersimple.com/song/hello/" },
    chant: ["Hello, hello!", "Hello, {name}!", "Yes, yes, yes!", "No, no, no!", "Goodbye, goodbye!"],
    speak: {
      script: [
        { who: "Parent", line: "Hello!" },
        { who: "{name}", line: "Hello!" },
        { who: "Parent", line: "Goodbye!" },
        { who: "{name}", line: "Goodbye!" }
      ],
      activity: "Cachez une peluche, faites-la réapparaître : « Hello, Teddy! ». Cachez-la : « Goodbye, Teddy! ». Saluez-vous 3 fois, puis inversez les rôles."
    },
    skill: "Dit « Hello! » / « Goodbye! »"
  },
  {
    id: "w1d2", week: 1, day: "Tuesday", title: "What's your name?", emoji: "🧸", ready: true,
    warmup: {
      say: "Hello, {name}! My name is Fox. What's your name?",
      prompt: "Say: My name is …",
      parent: "Montrez-vous du doigt : « My name is Papa. » Puis montrez-la : « What's your name? ». Si elle répond juste son prénom, c'est parfait. Redites la phrase complète pour elle."
    },
    cards: [
      { word: "name", emoji: "🏷️", say: "Name." },
      { word: "my", emoji: "🙋‍♀️", say: "My. My name." },
      { word: "your", emoji: "🫵", say: "Your. Your name." },
      { word: "What's your name?", emoji: "❓", say: "What's your name?" }
    ],
    video: { title: "What's Your Name? — Super Simple Songs", youtubeId: "BM7Cg905Wo8", page: "https://supersimple.com/song/whats-your-name-featuring-sesame-street/" },
    chant: ["Hello! Hello!", "What's your name?", "My name is {name}.", "Hello, {name}!"],
    speak: {
      script: [
        { who: "Parent", line: "Hello!" },
        { who: "{name}", line: "Hello!" },
        { who: "Parent", line: "What's your name?" },
        { who: "{name}", line: "My name is {name}." },
        { who: "Both", line: "Goodbye! See you!" }
      ],
      activity: "Le nounours parle : « Hello! My name is Teddy. What is your name? ». Elle répond au nounours, puis c'est elle qui fait parler le nounours. Bonus : chanson du British Council « Hello, hello, hello » (lien dans l'espace parent)."
    },
    skill: "Dit son prénom (avec aide)"
  },
  {
    id: "w1d3", week: 1, day: "Wednesday", title: "How are you?", emoji: "😊", ready: true,
    warmup: {
      say: "Hello, {name}! How are you? I'm happy!",
      prompt: "Make a happy face!",
      parent: "Révision d'abord : « Hello! What's your name? ». Puis faites des grimaces ensemble : content, triste, fatigué."
    },
    cards: [
      { word: "happy", emoji: "😀", say: "Happy! I'm happy!" },
      { word: "sad", emoji: "😢", say: "Sad. I'm sad." },
      { word: "tired", emoji: "😴", say: "Tired. I'm tired." },
      { word: "good", emoji: "🙂", say: "Good! I'm good!" }
    ],
    video: { title: "Hello! — Super Simple Songs (how are you?)", youtubeId: "tVlcKp3bWH8", page: "https://supersimple.com/song/hello/" },
    chant: ["How are you?", "I'm happy!", "How are you?", "I'm tired!", "How are you?", "I'm good!"],
    speak: {
      script: [
        { who: "Parent", line: "Hello!" },
        { who: "{name}", line: "Hello!" },
        { who: "Parent", line: "How are you?" },
        { who: "{name}", line: "I'm happy!" },
        { who: "Both", line: "Goodbye! See you!" }
      ],
      activity: "Faites une tête (contente, triste, fatiguée) et demandez : « Happy or sad? ». Elle répond, puis c'est elle qui fait la grimace et vous qui devinez."
    },
    skill: "Répond à « How are you? »"
  },
  {
    id: "w1d4", week: 1, day: "Thursday", title: "Numbers 1–5", emoji: "🖐️", ready: true,
    warmup: {
      say: "One, two, three, four, five! Let's count, {name}!",
      prompt: "Show me five fingers!",
      parent: "Révision : « How are you? ». Puis comptez sur vos doigts de 1 à 5 ensemble, lentement."
    },
    cards: [
      { word: "one", emoji: "1️⃣", say: "One." },
      { word: "two", emoji: "2️⃣", say: "Two." },
      { word: "three", emoji: "3️⃣", say: "Three." },
      { word: "four", emoji: "4️⃣", say: "Four." },
      { word: "five", emoji: "5️⃣", say: "Five." }
    ],
    video: { title: "10 Apples On My Head — Super Simple Songs", youtubeId: "BTlmy8LZO_8", page: "https://supersimple.com/song/ten-apples-on-my-head-noodle/" },
    chant: ["One, two, three!", "Four, five!", "One, two, three, four, five!", "Jump, jump, jump!"],
    speak: {
      script: [
        { who: "Parent", line: "How many?" },
        { who: "{name}", line: "Three!" },
        { who: "Parent", line: "Let's jump five times!" },
        { who: "Both", line: "One, two, three, four, five!" }
      ],
      activity: "Comptez des cubes, des doigts ou des sauts. Montrez 1 à 5 objets et demandez « How many? ». La vidéo va jusqu'à 10 : c'est normal, elle découvre la suite en écoutant."
    },
    skill: "Reconnaît les nombres 1 à 5"
  },
  {
    id: "w1d5", week: 1, day: "Friday", title: "Colors", emoji: "🎨", ready: true,
    warmup: {
      say: "Red, yellow, green, blue! Let's find colors, {name}!",
      prompt: "Find something red!",
      parent: "Jeu « Color detective » : « Find something red! ». Elle court chercher un objet rouge. Puis c'est elle qui donne l'ordre."
    },
    cards: [
      { word: "red", emoji: "🔴", say: "Red." },
      { word: "blue", emoji: "🔵", say: "Blue." },
      { word: "yellow", emoji: "🟡", say: "Yellow." },
      { word: "green", emoji: "🟢", say: "Green." }
    ],
    video: { title: "Red Yellow Green Blue — Super Simple Songs", youtubeId: "aMTIm-D1l54", page: "https://supersimple.com/song/red-yellow-green-blue/" },
    chant: ["Red, red, red!", "Blue, blue, blue!", "Yellow and green!", "It's red! It's blue!"],
    speak: {
      script: [
        { who: "Parent", line: "Hello! What's your name?" },
        { who: "{name}", line: "My name is {name}." },
        { who: "Parent", line: "How are you?" },
        { who: "{name}", line: "I'm happy!" },
        { who: "Parent", line: "What color is it?" },
        { who: "{name}", line: "It's red!" },
        { who: "Both", line: "Goodbye! See you!" }
      ],
      activity: "Bilan de la semaine (voir « Contrôle du vendredi » dans l'espace parent). Activité papier « My first English card » : elle se dessine, et dit à l'oral « My name is… », « I am six », « Today I feel happy », « My favorite color is… ». Vous pouvez écrire pour elle."
    },
    skill: "Reconnaît rouge, bleu, jaune, vert"
  },

  // ---------------- WEEK 2 ----------------
  { id: "w2d1", week: 2, day: "Monday", title: "Pets", emoji: "🐱", ready: false,
    words: ["cat", "dog", "fish", "bird"], target: "It's a cat. / I see a dog.",
    video: { title: "I Have A Pet — Super Simple Songs", youtubeId: "pWepfJ-8XU0", page: "https://supersimple.com/song/i-have-a-pet/" } },
  { id: "w2d2", week: 2, day: "Tuesday", title: "More animals", emoji: "🦁", ready: false,
    words: ["rabbit", "duck", "lion", "elephant"], target: "It's a lion. / It's a duck." },
  { id: "w2d3", week: 2, day: "Wednesday", title: "Colors around us", emoji: "🚗", ready: false,
    words: ["red", "blue", "yellow", "green"], target: "A red ball. / A blue car." },
  { id: "w2d4", week: 2, day: "Thursday", title: "Move your body", emoji: "🤸", ready: false,
    words: ["jump", "run", "sit", "stand"], target: "Jump! / Sit down. / Stand up." },
  { id: "w2d5", week: 2, day: "Friday", title: "Animal show", emoji: "🎪", ready: false,
    words: ["review"], target: "It's a dog. It's brown. Woof, woof!" },

  // ---------------- WEEK 3 ----------------
  { id: "w3d1", week: 3, day: "Monday", title: "Fruits", emoji: "🍎", ready: false,
    words: ["apple", "banana", "orange", "grapes"], target: "An apple, please." },
  { id: "w3d2", week: 3, day: "Tuesday", title: "Snacks and drinks", emoji: "🥛", ready: false,
    words: ["bread", "milk", "water", "egg"], target: "Water, please. / Thank you." },
  { id: "w3d3", week: 3, day: "Wednesday", title: "What do you like?", emoji: "😋", ready: false,
    words: ["like", "don't like", "yummy"], target: "I like bananas." },
  { id: "w3d4", week: 3, day: "Thursday", title: "At the café", emoji: "☕", ready: false,
    words: ["please", "thank you", "here you are"], target: "Here you are. / Thank you." },
  { id: "w3d5", week: 3, day: "Friday", title: "My little shop", emoji: "🛒", ready: false,
    words: ["review"], target: "I like apples. Water, please. Thank you!" },

  // ---------------- WEEK 4 ----------------
  { id: "w4d1", week: 4, day: "Monday", title: "My family", emoji: "👨‍👩‍👧", ready: false,
    words: ["mum", "dad", "sister", "brother", "family"], target: "This is my mum." },
  { id: "w4d2", week: 4, day: "Tuesday", title: "My body", emoji: "👀", ready: false,
    words: ["head", "eyes", "nose", "mouth", "hands", "feet"], target: "These are my eyes." },
  { id: "w4d3", week: 4, day: "Wednesday", title: "My favorite things", emoji: "🧸", ready: false,
    words: ["ball", "doll", "book", "teddy"], target: "I like my teddy. / It's brown." },
  { id: "w4d4", week: 4, day: "Thursday", title: "My day", emoji: "🌙", ready: false,
    words: ["wake up", "eat", "play", "sleep"], target: "I eat. / I play. / Good night!" },
  { id: "w4d5", week: 4, day: "Friday", title: "English show day", emoji: "⭐", ready: false,
    words: ["review"], target: "Hello! My name is … I am six. I like cats. Goodbye!" }
];

window.WEEK_THEMES = {
  1: "Hello, my name is…",
  2: "Animals, colors and actions",
  3: "Food, likes and polite speaking",
  4: "Family, body and everyday conversations"
};

// Friday speaking check (16 skills) — from the family plan. Ticked by the parent, stored on this device only.
window.SKILLS = {
  1: ["Dit « Hello! » pour saluer", "Dit son prénom (avec aide)", "Reconnaît les nombres 1 à 5", "Reconnaît rouge, bleu, jaune, vert"],
  2: ["Nomme au moins 4 animaux", "Comprend « sit down » et « stand up »", "Répond à « What is it? » par un mot", "Suit une consigne simple"],
  3: ["Nomme au moins 4 aliments", "Dit « I like… » (avec aide)", "Utilise « please » et « thank you »", "Fait semblant de commander en anglais"],
  4: ["Se présente (avec aide)", "Répond à « How are you? »", "Dit une ou deux phrases simples", "Participe à une petite conversation"]
};

// Sticker book: one new sticker every 3 stars. Each sticker is also a bonus English word.
window.STICKERS = [
  { e: "🦊", w: "fox" }, { e: "🐱", w: "cat" }, { e: "🐶", w: "dog" }, { e: "🐰", w: "rabbit" },
  { e: "🦁", w: "lion" }, { e: "🐘", w: "elephant" }, { e: "🦆", w: "duck" }, { e: "🐟", w: "fish" },
  { e: "🦋", w: "butterfly" }, { e: "🌈", w: "rainbow" }, { e: "⭐", w: "star" }, { e: "🌻", w: "flower" },
  { e: "🍎", w: "apple" }, { e: "🍌", w: "banana" }, { e: "🎈", w: "balloon" }, { e: "🚗", w: "car" },
  { e: "⚽", w: "ball" }, { e: "🧸", w: "teddy" }, { e: "🦄", w: "unicorn" }, { e: "👑", w: "crown" }
];
