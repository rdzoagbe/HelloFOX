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
      say: "Hello, {name}! Can you say hello?", key: "hello",
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
      say: "Hello, {name}! My name is Fox. What's your name?", key: "my name is",
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
      say: "Hello, {name}! How are you? I'm happy!", key: "I'm happy",
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
      say: "One, two, three, four, five! Let's count, {name}!", key: "one two three",
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
      say: "Red, yellow, green, blue! Let's find colors, {name}!", key: "red",
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

  // ---------------- WEEK 2 — Animals, colors and actions ----------------
  // card.ask: on some game rounds Fox asks with the animal sound instead of the word.
  // moves: "Simon says" actions done in the Play step (she acts, no listening).
  {
    id: "w2d1", week: 2, day: "Monday", title: "Pets", emoji: "🐱", ready: true,
    warmup: {
      say: "Hello, {name}! Meow! Woof! Let's meet some pets!", key: "hello",
      prompt: "Say: Hello, pets!",
      parent: "Révision rapide de la semaine 1 (Hello, name, colors). Si vous avez des animaux en peluche, sortez-les : un chat, un chien…"
    },
    cards: [
      { word: "cat", emoji: "🐱", say: "Cat. It's a cat!", ask: "Meow! Who says meow?" },
      { word: "dog", emoji: "🐶", say: "Dog. It's a dog!", ask: "Woof woof! Who says woof?" },
      { word: "fish", emoji: "🐟", say: "Fish. It's a fish!", ask: "Glub glub! Who says glub glub?" },
      { word: "bird", emoji: "🐦", say: "Bird. It's a bird!", ask: "Tweet tweet! Who says tweet?" }
    ],
    video: { title: "I Have A Pet — Super Simple Songs", youtubeId: "pWepfJ-8XU0", page: "https://supersimple.com/song/i-have-a-pet/" },
    chant: ["I have a pet!", "It's a cat. Meow!", "It's a dog. Woof!", "It's a fish. Glub glub!", "It's a bird. Tweet tweet!"],
    speak: {
      script: [
        { who: "Parent", line: "What is it?" },
        { who: "{name}", line: "It's a cat!" },
        { who: "Parent", line: "What does the dog say?" },
        { who: "{name}", line: "Woof woof!" },
        { who: "Parent", line: "I see a bird!" },
        { who: "{name}", line: "I see a fish!" }
      ],
      activity: "Associez les animaux en peluche aux images. Tenez un animal : « What is it? ». Si elle hésite, proposez un choix : « Is it a cat or a dog? ». Elle peut d'abord montrer du doigt, puis répéter."
    },
    skill: "Nomme chat, chien, poisson, oiseau"
  },
  {
    id: "w2d2", week: 2, day: "Tuesday", title: "More animals", emoji: "🦁", ready: true,
    warmup: {
      say: "Roar! I'm a lion! Hello, {name}! Can you roar?", key: "roar",
      prompt: "Roar like a lion!",
      parent: "Faites le lion ensemble (mains en griffes). Révision : montrez un chat et un chien, demandez « What is it? »."
    },
    cards: [
      { word: "rabbit", emoji: "🐰", say: "Rabbit. It's a rabbit!", ask: "Hop, hop, hop! Who hops?" },
      { word: "duck", emoji: "🦆", say: "Duck. It's a duck!", ask: "Quack quack! Who says quack?" },
      { word: "lion", emoji: "🦁", say: "Lion. It's a lion!", ask: "Roar! Who says roar?" },
      { word: "elephant", emoji: "🐘", say: "Elephant. It's an elephant!" }
    ],
    video: { title: "Let's Go To The Zoo — Super Simple Songs", youtubeId: "OwRmivbNgQk", page: "https://supersimple.com/song/lets-go-to-the-zoo/" },
    moves: [
      { emoji: "🐰", say: "Hop like a rabbit!" },
      { emoji: "🦆", say: "Walk like a duck! Quack quack!" },
      { emoji: "🦁", say: "Roar like a lion!" },
      { emoji: "🐘", say: "Stomp like an elephant!" }
    ],
    chant: ["Hop, hop, rabbit!", "Quack, quack, duck!", "Roar, roar, lion!", "Stomp, stomp, elephant!"],
    speak: {
      script: [
        { who: "Parent", line: "What is it?" },
        { who: "{name}", line: "It's a lion!" },
        { who: "Parent", line: "Is it a duck or a rabbit?" },
        { who: "{name}", line: "It's a duck!" }
      ],
      activity: "Devinette : imitez un animal (lion, canard, lapin, éléphant), elle devine en anglais : « It's a lion! ». Puis c'est elle qui imite et vous qui devinez. La vidéo du zoo montre d'autres animaux (kangourou, singe, pingouin) : bonus, pas besoin de les retenir."
    },
    skill: "Nomme lapin, canard, lion, éléphant"
  },
  {
    id: "w2d3", week: 2, day: "Wednesday", title: "Colors around us", emoji: "🚗", ready: true,
    warmup: {
      say: "Hello, {name}! Red, blue, yellow, green! Can you say red?", key: "red",
      prompt: "Say: Red!",
      parent: "Révision des couleurs de la semaine 1. Préparez des jouets de 4 couleurs (rouge, bleu, jaune, vert) pour le jeu de tri."
    },
    cards: [
      { word: "a red apple", emoji: "🍎", say: "A red apple.", key: "red apple" },
      { word: "a blue car", emoji: "🚙", say: "A blue car.", key: "blue car" },
      { word: "a yellow banana", emoji: "🍌", say: "A yellow banana.", key: "yellow banana" },
      { word: "a green frog", emoji: "🐸", say: "A green frog.", key: "green frog" }
    ],
    video: { title: "What's Your Favorite Color? — Super Simple Songs", youtubeId: "zxIpA5nF_LY", page: "https://supersimple.com/song/whats-your-favorite-color/" },
    chant: ["Red, red, a red apple!", "Blue, blue, a blue car!", "Yellow, yellow, a yellow banana!", "Green, green, a green frog!"],
    speak: {
      script: [
        { who: "Parent", line: "What color is it?" },
        { who: "{name}", line: "It's red!" },
        { who: "Parent", line: "What's your favorite color?" },
        { who: "{name}", line: "Blue!" },
        { who: "Parent", line: "A blue car!" }
      ],
      activity: "Tri des couleurs : mettez les jouets en 4 tas (red, blue, yellow, green) en disant la couleur. Puis « A red ball », « A blue car »… La chanson cite aussi orange et purple : bonus."
    },
    skill: "Dit « a red ball », « a blue car »"
  },
  {
    id: "w2d4", week: 2, day: "Thursday", title: "Move your body", emoji: "🤸", ready: true,
    warmup: {
      say: "Hello, {name}! Stand up! Jump! Can you jump?", key: "jump",
      prompt: "Stand up and jump!",
      parent: "Faites de la place pour bouger ! Montrez chaque geste en le disant, elle copie."
    },
    cards: [
      { word: "jump", emoji: "🦘", say: "Jump!" },
      { word: "run", emoji: "🏃", say: "Run!" },
      { word: "sit down", emoji: "🪑", say: "Sit down!" },
      { word: "stand up", emoji: "🧍", say: "Stand up!" }
    ],
    video: { title: "Stand Up, Sit Down — Super Simple Songs", youtubeId: "-iMGSD_35pM", page: "https://supersimple.com/song/stand-up-sit-down/" },
    moves: [
      { emoji: "🧍", say: "Simon says: stand up!" },
      { emoji: "🦘", say: "Simon says: jump!" },
      { emoji: "🪑", say: "Simon says: sit down!" },
      { emoji: "🏃", say: "Simon says: run on the spot!" },
      { emoji: "👏", say: "Simon says: clap your hands!" },
      { emoji: "🧍", say: "Simon says: stand up!" }
    ],
    chant: ["Stand up!", "Sit down!", "Jump, jump, jump!", "Run, run, run!", "Stand up and sit down!"],
    speak: {
      script: [
        { who: "Parent", line: "Can you jump?" },
        { who: "{name}", line: "Yes!" },
        { who: "Parent", line: "Let's jump five times!" },
        { who: "Both", line: "One, two, three, four, five!" },
        { who: "{name}", line: "Sit down!" }
      ],
      activity: "Simon Says : le renard donne les ordres, elle fait le geste pendant la barre violette. Ensuite, c'est elle qui donne les ordres à vous : « Jump! », « Sit down! »."
    },
    skill: "Comprend « sit down » et « stand up »"
  },
  {
    id: "w2d5", week: 2, day: "Friday", title: "Animal show", emoji: "🎪", ready: true,
    warmup: {
      say: "Welcome to the animal show, {name}! Hello!", key: "hello",
      prompt: "Say: Hello!",
      parent: "Jour de spectacle ! Elle choisit 2 ou 3 animaux en peluche pour le spectacle de fin de semaine."
    },
    cards: [
      { word: "a brown dog", emoji: "🐶", say: "It's a dog. It's brown. Woof woof!", key: "dog", ask: "Woof woof! Who says woof?" },
      { word: "a yellow lion", emoji: "🦁", say: "It's a lion. It's yellow. Roar!", key: "lion", ask: "Roar! Who says roar?" },
      { word: "a black cat", emoji: "🐈‍⬛", say: "It's a cat. It's black. Meow!", key: "cat", ask: "Meow! Who says meow?" },
      { word: "a blue bird", emoji: "🐦", say: "It's a bird. It's blue. Tweet tweet!", key: "bird", ask: "Tweet tweet! Who says tweet?" }
    ],
    video: { title: "I Have A Pet — Super Simple Songs", youtubeId: "pWepfJ-8XU0", page: "https://supersimple.com/song/i-have-a-pet/" },
    moves: [
      { emoji: "🐶", say: "Be a dog! Woof woof!" },
      { emoji: "🦁", say: "Be a lion! Roar!" },
      { emoji: "🐰", say: "Jump like a rabbit!" },
      { emoji: "🦆", say: "Walk like a duck!" },
      { emoji: "🪑", say: "Sit down! Well done!" }
    ],
    chant: ["It's a dog! Woof woof!", "It's a cat! Meow!", "It's a lion! Roar!", "Jump, jump, jump!"],
    speak: {
      script: [
        { who: "Parent", line: "What is it?" },
        { who: "{name}", line: "A cat!" },
        { who: "Parent", line: "What color is it?" },
        { who: "{name}", line: "It's black." },
        { who: "Parent", line: "Can you jump?" },
        { who: "{name}", line: "Yes!" },
        { who: "Parent", line: "Let's jump five times!" }
      ],
      activity: "Spectacle : elle présente chaque peluche (« It's a dog. It's brown. Woof, woof! ») et l'imite. Bilan de la semaine 2 : voir « Contrôle du vendredi » dans l'espace parent. Activité papier « Match the animal » : reliez CAT, DOG, FISH, BIRD aux dessins, ou montrez l'image quand vous dites le mot."
    },
    skill: "Présente un animal : « It's a dog. It's brown. »"
  },

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
