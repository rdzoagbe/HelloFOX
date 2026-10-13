// Lesson content. Each lesson follows the same 5-step template:
// hello (warm-up) -> learn (word cards) -> watch (video) -> play (listen & tap + speak) -> stars (review)
// Only lessons with ready:true are playable. To add a lesson: fill in `cards`, `warmup`, `speak`, set ready:true.
// Video IDs below were checked on the official supersimple.com song pages (13 Oct 2026).

window.LESSONS = [
  // ---------------- WEEK 1 ----------------
  {
    id: "w1d1", week: 1, day: "Monday", title: "Hello!", emoji: "👋", ready: true,
    goal: "Dire bonjour et au revoir, répondre oui / non.",
    warmup: {
      say: "Hello! Hello! Hello, {name}!",
      prompt: "Wave and say: Hello!",
      parent: "Faites un grand signe de la main et dites « Hello! ». Attendez 3 à 5 secondes. Un geste suffit."
    },
    cards: [
      { word: "hello", emoji: "👋", say: "Hello!" },
      { word: "goodbye", emoji: "🚪", say: "Goodbye!" },
      { word: "yes", emoji: "👍", say: "Yes!" },
      { word: "no", emoji: "👎", say: "No!" }
    ],
    video: {
      title: "Hello! — Super Simple Songs",
      youtubeId: "tVlcKp3bWH8",
      page: "https://supersimple.com/song/hello/"
    },
    speak: {
      script: [
        { who: "Parent", line: "Hello!" },
        { who: "{name}", line: "Hello!" },
        { who: "Parent", line: "Goodbye!" },
        { who: "{name}", line: "Goodbye!" }
      ],
      activity: "Cachez une peluche, faites-la réapparaître : « Hello, Teddy! ». Cachez-la : « Goodbye, Teddy! ». Puis inversez les rôles."
    },
    skill: "Dit Hello / Goodbye"
  },
  { id: "w1d2", week: 1, day: "Tuesday", title: "What's your name?", emoji: "🧸", ready: false,
    words: ["name", "my", "your"], target: "What's your name? / My name is …" },
  { id: "w1d3", week: 1, day: "Wednesday", title: "How are you?", emoji: "😊", ready: false,
    words: ["happy", "sad", "tired", "good"], target: "How are you? / I'm happy." },
  { id: "w1d4", week: 1, day: "Thursday", title: "Numbers 1–5", emoji: "🖐️", ready: false,
    words: ["one", "two", "three", "four", "five"], target: "One, two, three…" },
  { id: "w1d5", week: 1, day: "Friday", title: "Colors", emoji: "🎨", ready: false,
    words: ["red", "blue", "yellow", "green"], target: "It's red. / It's blue.",
    video: { title: "Red Yellow Green Blue — Super Simple Songs", youtubeId: "aMTIm-D1l54", page: "https://supersimple.com/song/red-yellow-green-blue/" } },

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
    words: ["review"], target: "It's a brown dog. / I can jump." },

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
    words: ["review"], target: "I like apples. / Water, please." },

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
    words: ["review"], target: "Hello! My name is … I like cats. Goodbye!" }
];

window.WEEK_THEMES = {
  1: "Hello, my name is…",
  2: "Animals, colors and actions",
  3: "Food, likes and polite speaking",
  4: "Family, body and everyday conversations"
};
