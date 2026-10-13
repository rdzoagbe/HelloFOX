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

  // ---------------- WEEK 3 — Food, likes and polite speaking ----------------
  // game: { type: "tap" (default) | "cafe" | "memory" | "missing", items?: [...] } — items default to the lesson cards.
  {
    id: "w3d1", week: 3, day: "Monday", title: "Fruits", emoji: "🍎", ready: true,
    warmup: {
      say: "Hello, {name}! Are you hungry? Yummy, fruit!", key: "yes",
      prompt: "Say: Yes!",
      parent: "Révision : un animal et une couleur de la semaine 2. Si possible, préparez de vrais fruits : les vrais objets donnent envie de parler."
    },
    cards: [
      { word: "apple", emoji: "🍎", say: "Apple. An apple!" },
      { word: "banana", emoji: "🍌", say: "Banana. A banana!" },
      { word: "orange", emoji: "🍊", say: "Orange. An orange!" },
      { word: "grapes", emoji: "🍇", say: "Grapes!" }
    ],
    video: { title: "Fruit Is Yummy — Super Simple Songs", youtubeId: "DDjOLRNby20", page: "https://supersimple.com/song/fruit-is-yummy/" },
    chant: ["Apple, apple, yummy!", "Banana, banana, yummy!", "Orange and grapes!", "Fruit is yummy!"],
    speak: {
      script: [
        { who: "Parent", line: "Apple or banana?" },
        { who: "{name}", line: "Banana, please!" },
        { who: "Parent", line: "Here you are." },
        { who: "{name}", line: "Thank you!" }
      ],
      activity: "Panier à faire semblant : elle choisit un fruit. « Apple or banana? » puis attendez quelques secondes. La vidéo cite aussi mango, pineapple, kiwi : bonus."
    },
    skill: "Nomme pomme, banane, orange, raisin"
  },
  {
    id: "w3d2", week: 3, day: "Tuesday", title: "Snacks and drinks", emoji: "🥛", ready: true,
    warmup: {
      say: "Hello, {name}! Are you hungry? I'm hungry!", key: "hungry",
      prompt: "Say: I'm hungry!",
      parent: "Révision des fruits d'hier. Préparez des tasses et assiettes (dînette) pour le café."
    },
    cards: [
      { word: "bread", emoji: "🍞", say: "Bread.", order: "Bread, please!" },
      { word: "milk", emoji: "🥛", say: "Milk.", order: "Milk, please!" },
      { word: "water", emoji: "💧", say: "Water.", order: "Water, please!" },
      { word: "egg", emoji: "🥚", say: "Egg. An egg!", order: "An egg, please!" }
    ],
    game: { type: "cafe" },
    video: { title: "Are You Hungry? — Super Simple Songs", youtubeId: "jpyb_uyNaEI", page: "https://supersimple.com/song/are-you-hungry/" },
    chant: ["Are you hungry?", "Yes, I am!", "Water, please!", "Thank you!"],
    speak: {
      script: [
        { who: "Parent", line: "Are you hungry?" },
        { who: "{name}", line: "Yes!" },
        { who: "Parent", line: "What do you want?" },
        { who: "{name}", line: "Water, please." },
        { who: "Parent", line: "Here you are." },
        { who: "{name}", line: "Thank you!" }
      ],
      activity: "Café à faire semblant avec la dînette : elle commande (« Water, please »), vous servez (« Here you are »), elle dit « Thank you! ». Puis on échange les rôles. Le jeu « Fox's café » : le renard commande, elle sert en touchant la bonne image."
    },
    skill: "Dit « Water, please » / « Thank you »"
  },
  {
    id: "w3d3", week: 3, day: "Wednesday", title: "What do you like?", emoji: "😋", ready: true,
    warmup: {
      say: "Hello, {name}! I like bananas! Yummy!", key: "yummy",
      prompt: "Say: Yummy!",
      parent: "Révision : « Water, please », « Thank you ». Puis frottez-vous le ventre en disant « Yummy! »."
    },
    cards: [
      { word: "yummy", emoji: "😋", say: "Yummy!" },
      { word: "I like it", emoji: "👍", say: "I like it!", key: "like it" },
      { word: "I don't like it", emoji: "👎", say: "I don't like it.", key: "dont like" },
      { word: "I like bananas", emoji: "🍌", say: "I like bananas!", key: "like bananas" }
    ],
    game: { type: "missing" },
    video: { title: "Do You Like Broccoli Ice Cream? — Super Simple Songs", youtubeId: "frN3nvhIHUk", page: "https://supersimple.com/song/do-you-like-broccoli-ice-cream/" },
    chant: ["Do you like bananas?", "Yes, I do! Yummy!", "Do you like broccoli ice cream?", "No, I don't!"],
    speak: {
      script: [
        { who: "Parent", line: "Do you like bananas?" },
        { who: "{name}", line: "Yes, I do!" },
        { who: "Parent", line: "Do you like broccoli ice cream?" },
        { who: "{name}", line: "No, I don't!" },
        { who: "{name}", line: "I like apples!" }
      ],
      activity: "Triez des images d'aliments en deux tas : « I like it » et « Not today ». La chanson est volontairement drôle (glace au brocoli) : riez ensemble, ça aide à retenir."
    },
    skill: "Dit « I like… » (avec aide)"
  },
  {
    id: "w3d4", week: 3, day: "Thursday", title: "At the café", emoji: "☕", ready: true,
    warmup: {
      say: "Welcome to Fox's café, {name}! Hello!", key: "hello",
      prompt: "Say: Hello!",
      parent: "Révision : « I like… ». Installez un petit café (table, tasses, fruits en jouet)."
    },
    cards: [
      { word: "please", emoji: "🙏", say: "Please." },
      { word: "thank you", emoji: "💛", say: "Thank you!", key: "thank you" },
      { word: "here you are", emoji: "🤲", say: "Here you are.", key: "here you are" },
      { word: "an apple, please", emoji: "🍎", say: "An apple, please.", key: "apple please" }
    ],
    game: { type: "cafe", items: [
      { word: "apple", emoji: "🍎", say: "Apple.", order: "An apple, please!" },
      { word: "banana", emoji: "🍌", say: "Banana.", order: "A banana, please!" },
      { word: "milk", emoji: "🥛", say: "Milk.", order: "Milk, please!" },
      { word: "bread", emoji: "🍞", say: "Bread.", order: "Bread, please!" },
      { word: "water", emoji: "💧", say: "Water.", order: "Water, please!" }
    ] },
    video: { title: "Fruit Is Yummy — Super Simple Songs", youtubeId: "DDjOLRNby20", page: "https://supersimple.com/song/fruit-is-yummy/" },
    chant: ["An apple, please!", "Here you are!", "Thank you!", "You're welcome!"],
    speak: {
      script: [
        { who: "{name}", line: "Hello!" },
        { who: "Parent", line: "Hello! What do you want?" },
        { who: "{name}", line: "An apple, please." },
        { who: "Parent", line: "Here you are." },
        { who: "{name}", line: "Thank you!" }
      ],
      activity: "Chacun son tour client et serveur. Le serveur dit « Here you are », le client « Thank you! ». Pas besoin de phrases parfaites : « Apple, please » c'est très bien."
    },
    skill: "Utilise « please » et « thank you »"
  },
  {
    id: "w3d5", week: 3, day: "Friday", title: "My little shop", emoji: "🛒", ready: true,
    warmup: {
      say: "Hello, {name}! Welcome to your little shop!", key: "hello",
      prompt: "Say: Hello!",
      parent: "Jour du magasin ! Elle choisit 3 aliments (jouets ou vrais) à vendre."
    },
    cards: [
      { word: "I like apples", emoji: "🍎", say: "I like apples!", key: "like apples" },
      { word: "water, please", emoji: "💧", say: "Water, please.", key: "water please" },
      { word: "here you are", emoji: "🤲", say: "Here you are.", key: "here you are" },
      { word: "thank you", emoji: "💛", say: "Thank you!", key: "thank you" }
    ],
    game: { type: "cafe", items: [
      { word: "apple", emoji: "🍎", say: "Apple.", order: "An apple, please!" },
      { word: "orange", emoji: "🍊", say: "Orange.", order: "An orange, please!" },
      { word: "grapes", emoji: "🍇", say: "Grapes.", order: "Grapes, please!" },
      { word: "egg", emoji: "🥚", say: "Egg.", order: "An egg, please!" },
      { word: "milk", emoji: "🥛", say: "Milk.", order: "Milk, please!" }
    ] },
    video: { title: "Do You Like Broccoli Ice Cream? — Super Simple Songs", youtubeId: "frN3nvhIHUk", page: "https://supersimple.com/song/do-you-like-broccoli-ice-cream/" },
    chant: ["I like apples!", "Water, please!", "Here you are!", "Thank you!"],
    speak: {
      script: [
        { who: "Parent", line: "Are you hungry?" },
        { who: "{name}", line: "Yes!" },
        { who: "Parent", line: "What do you want?" },
        { who: "{name}", line: "An apple, please." },
        { who: "Parent", line: "Here you are." },
        { who: "{name}", line: "Thank you!" },
        { who: "Parent", line: "Do you like bananas?" },
        { who: "{name}", line: "Yes, I do!" }
      ],
      activity: "Proposez 3 choix, elle commande. Bilan de la semaine 3 (« Contrôle du vendredi »). Activité papier « My mini menu » : dessinez Apple, Banana, Water, Milk ; elle entoure ce qu'elle veut et dit « I'd like…, please »."
    },
    skill: "Fait semblant de commander en anglais"
  },

  // ---------------- WEEK 4 — Family, body and everyday conversations ----------------
  {
    id: "w4d1", week: 4, day: "Monday", title: "My family", emoji: "👨‍👩‍👧", ready: true,
    warmup: {
      say: "Hello, {name}! This is my family. Hello, family!", key: "hello",
      prompt: "Say: Hello, family!",
      parent: "Révision du café (« please », « thank you »). Préparez une photo de famille."
    },
    cards: [
      { word: "mum", emoji: "👩", say: "Mum. This is my mum.", key: "mum" },
      { word: "dad", emoji: "👨", say: "Dad. This is my dad.", key: "dad" },
      { word: "sister", emoji: "👧", say: "Sister. This is my sister.", key: "sister" },
      { word: "brother", emoji: "👦", say: "Brother. This is my brother.", key: "brother" }
    ],
    game: { type: "memory" },
    video: { title: "The People In My Family — Super Simple Songs", youtubeId: "yDua9ms9_eg", page: "https://supersimple.com/song/the-people-in-my-family/" },
    chant: ["This is my mum!", "This is my dad!", "This is my sister!", "This is my brother!", "I love my family!"],
    speak: {
      script: [
        { who: "Parent", line: "Who is this?" },
        { who: "{name}", line: "This is my mum." },
        { who: "Parent", line: "And who is this?" },
        { who: "{name}", line: "This is my dad." },
        { who: "Both", line: "I love my family!" }
      ],
      activity: "Montrez une photo de famille, elle désigne chacun : « This is my mum. » La chanson dit « mother / father » : c'est le même sens que « mum / dad », précisez-le en une phrase. Jeu de mémoire : retrouver les paires."
    },
    skill: "Nomme les membres de la famille"
  },
  {
    id: "w4d2", week: 4, day: "Tuesday", title: "My body", emoji: "👀", ready: true,
    warmup: {
      say: "Hello, {name}! Touch your head! Can you say head?", key: "head",
      prompt: "Touch your head and say: Head!",
      parent: "Révision de la famille. Debout, prêts à bouger pour « Head, shoulders, knees and toes »."
    },
    cards: [
      { word: "head", emoji: "🙆", say: "Head." },
      { word: "eyes", emoji: "👀", say: "Eyes." },
      { word: "nose", emoji: "👃", say: "Nose." },
      { word: "mouth", emoji: "👄", say: "Mouth." },
      { word: "hands", emoji: "👐", say: "Hands." },
      { word: "feet", emoji: "🦶", say: "Feet." }
    ],
    video: { title: "Head Shoulders Knees & Toes — Super Simple Songs", youtubeId: "VAOOT5ZfQyU", page: "https://supersimple.com/song/head-shoulders-knees-toes/" },
    moves: [
      { emoji: "🙆", say: "Simon says: touch your head!" },
      { emoji: "👃", say: "Simon says: touch your nose!" },
      { emoji: "👀", say: "Simon says: close your eyes!" },
      { emoji: "👏", say: "Simon says: clap your hands!" },
      { emoji: "🦶", say: "Simon says: stamp your feet!" },
      { emoji: "👄", say: "Simon says: touch your mouth!" }
    ],
    chant: ["Head and nose!", "Eyes and mouth!", "Clap your hands!", "Stamp your feet!"],
    speak: {
      script: [
        { who: "Parent", line: "What is this?" },
        { who: "{name}", line: "My nose!" },
        { who: "Parent", line: "How many eyes?" },
        { who: "{name}", line: "Two eyes!" },
        { who: "{name}", line: "These are my eyes." }
      ],
      activity: "Touchez chaque partie du corps en la nommant. Dessinez une personne ensemble et nommez chaque partie. La chanson ajoute shoulders, knees, toes, ears : bonus."
    },
    skill: "Montre et nomme les parties du corps"
  },
  {
    id: "w4d3", week: 4, day: "Wednesday", title: "My favorite things", emoji: "🧸", ready: true,
    warmup: {
      say: "Hello, {name}! I like my teddy! What do you like?", key: "like",
      prompt: "Show your favorite toy!",
      parent: "Révision du corps (« touch your nose »). Elle va chercher 2 ou 3 jouets préférés."
    },
    cards: [
      { word: "ball", emoji: "⚽", say: "Ball. A ball!" },
      { word: "doll", emoji: "🪆", say: "Doll. A doll!" },
      { word: "book", emoji: "📖", say: "Book. A book!" },
      { word: "teddy", emoji: "🧸", say: "Teddy. I like my teddy!", key: "teddy" }
    ],
    game: { type: "missing" },
    video: { title: "I Have A Toy — Super Simple Songs", youtubeId: "KkB3jcqyQ5g", page: "https://supersimple.com/song/i-have-a-toy/" },
    chant: ["I have a ball!", "I have a book!", "I like my teddy!", "It's brown!"],
    speak: {
      script: [
        { who: "Parent", line: "What's your favorite toy?" },
        { who: "{name}", line: "I like my teddy." },
        { who: "Parent", line: "What color is it?" },
        { who: "{name}", line: "It's brown." }
      ],
      activity: "Elle présente un jouet préféré : « I like my teddy. It's brown. » Jeu « What's missing? » : 3 jouets sur la table, elle ferme les yeux, vous en cachez un. La vidéo montre aussi car, robot, dinosaur : bonus."
    },
    skill: "Décrit un jouet : « I like my teddy. It's brown. »"
  },
  {
    id: "w4d4", week: 4, day: "Thursday", title: "My day", emoji: "🌙", ready: true,
    warmup: {
      say: "Good morning, {name}! Wake up! Can you say good morning?", key: "good morning",
      prompt: "Say: Good morning!",
      parent: "Révision des jouets. Prenez une poupée pour jouer sa journée."
    },
    cards: [
      { word: "wake up", emoji: "⏰", say: "Wake up!", key: "wake up" },
      { word: "eat", emoji: "🍽️", say: "Eat. I eat.", key: "eat" },
      { word: "play", emoji: "🧩", say: "Play. I play.", key: "play" },
      { word: "sleep", emoji: "😴", say: "Sleep. Good night!", key: "sleep" }
    ],
    game: { type: "memory" },
    video: { title: "This Is The Way We Go To Bed — Super Simple Songs", youtubeId: "v1YjJmMvnOw", page: "https://supersimple.com/song/this-is-the-way-we-go-to-bed/" },
    moves: [
      { emoji: "⏰", say: "Wake up! Stretch!" },
      { emoji: "🍽️", say: "Eat! Yum yum!" },
      { emoji: "🧩", say: "Play! Let's play!" },
      { emoji: "😴", say: "Sleep! Good night!" }
    ],
    chant: ["Wake up!", "I eat!", "I play!", "Good night!"],
    speak: {
      script: [
        { who: "Parent", line: "Good morning!" },
        { who: "{name}", line: "Good morning!" },
        { who: "Parent", line: "What do you do?" },
        { who: "{name}", line: "I play." },
        { who: "Both", line: "Good night!" }
      ],
      activity: "Jouez la journée d'une poupée : elle se réveille, mange, joue, dort. À utiliser au quotidien : « Wash your hands », « Let's go », « Good night »."
    },
    skill: "Dit « I eat », « I play », « Good night »"
  },
  {
    id: "w4d5", week: 4, day: "Friday", title: "English show day", emoji: "⭐", ready: true,
    warmup: {
      say: "It's show day, {name}! Hello, everybody!", key: "hello",
      prompt: "Say: Hello, everybody!",
      parent: "Grand final ! Invitez la famille ou des peluches comme public. Elle choisit ses jouets préférés à présenter."
    },
    cards: [
      { word: "hello", emoji: "👋", say: "Hello!" },
      { word: "My name is …", emoji: "🙋‍♀️", say: "My name is {name}.", key: "my name is" },
      { word: "I am six", emoji: "6️⃣", say: "I am six.", key: "six" },
      { word: "I like cats", emoji: "🐱", say: "I like cats.", key: "like cats" },
      { word: "goodbye", emoji: "🤗", say: "Goodbye!" }
    ],
    video: { title: "Bye Bye Goodbye — Super Simple Songs", youtubeId: "PraN5ZoSjiY", page: "https://supersimple.com/song/bye-bye-goodbye/" },
    chant: ["Hello! My name is {name}.", "I am six.", "I like cats.", "Goodbye!"],
    speak: {
      script: [
        { who: "Parent", line: "Hello! What's your name?" },
        { who: "{name}", line: "My name is {name}." },
        { who: "Parent", line: "How old are you?" },
        { who: "{name}", line: "I am six." },
        { who: "Parent", line: "What color do you like?" },
        { who: "{name}", line: "I like pink." },
        { who: "Parent", line: "What animal do you like?" },
        { who: "{name}", line: "I like cats." },
        { who: "Parent", line: "Very good! Goodbye!" },
        { who: "{name}", line: "Goodbye!" }
      ],
      activity: "Spectacle : elle se présente devant le public et présente ses jouets. Bilan final : « Contrôle du vendredi » (16 compétences). Activité papier « My English mini-book » : page 1 My name is…, page 2 I like cats, page 3 I like apples, page 4 I like yellow. Adaptez « six », « pink », « cats » à ses vraies réponses. Son diplôme est dans « Mes autocollants » une fois les 20 leçons faites."
    },
    skill: "Se présente (avec aide)"
  }
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

// English versions of the parent-facing texts above (the child's lesson content is English either way).
window.PARENT_EN = {
  w1d1: { parent: "Give a big wave together. A gesture is enough if your child isn't speaking yet.",
    activity: "Hide a teddy, make it reappear: “Hello, Teddy!”. Hide it again: “Goodbye, Teddy!”. Greet each other 3 times, then swap roles.",
    skill: "Says “Hello!” / “Goodbye!”" },
  w1d2: { parent: "Point to yourself: “My name is Dad.” Then point to your child: “What's your name?”. Just their first name is perfect. Repeat the full sentence for them.",
    activity: "The teddy talks: “Hello! My name is Teddy. What is your name?”. Your child answers the teddy, then makes the teddy talk. Bonus: the British Council song “Hello, hello, hello” (link in the parent area).",
    skill: "Says their name (with help)" },
  w1d3: { parent: "Quick review first: “Hello! What's your name?”. Then make faces together: happy, sad, tired.",
    activity: "Make a face (happy, sad, tired) and ask: “Happy or sad?”. Your child answers, then makes a face for you to guess.",
    skill: "Answers “How are you?”" },
  w1d4: { parent: "Review: “How are you?”. Then count on your fingers from 1 to 5 together, slowly.",
    activity: "Count blocks, fingers or jumps. Show 1 to 5 objects and ask “How many?”. The video goes up to 10: that's fine, they hear what comes next.",
    skill: "Recognises numbers 1 to 5" },
  w1d5: { parent: "“Color detective” game: “Find something red!”. Your child runs to find something red. Then they give the orders.",
    activity: "Week review (see “Friday check” in the parent area). Paper activity “My first English card”: your child draws themselves and says “My name is…”, “I am six”, “Today I feel happy”, “My favorite color is…”. You can do the writing.",
    skill: "Recognises red, blue, yellow, green" },
  w2d1: { parent: "Quick review of week 1 (hello, name, colours). If you have toy animals, bring them out: a cat, a dog…",
    activity: "Match the toy animals to the pictures. Hold up an animal: “What is it?”. If they hesitate, offer a choice: “Is it a cat or a dog?”. Pointing first, then repeating, is fine.",
    skill: "Names cat, dog, fish, bird" },
  w2d2: { parent: "Be lions together (claw hands). Review: show a cat and a dog, ask “What is it?”.",
    activity: "Guessing game: act like an animal (lion, duck, rabbit, elephant), your child guesses in English: “It's a lion!”. Then swap. The zoo video shows other animals (kangaroo, monkey, penguin): a bonus, no need to learn them.",
    skill: "Names rabbit, duck, lion, elephant" },
  w2d3: { parent: "Review week 1 colours. Get toys in 4 colours (red, blue, yellow, green) ready for sorting.",
    activity: "Colour sorting: put the toys in 4 piles (red, blue, yellow, green) saying the colour. Then “A red ball”, “A blue car”… The song also has orange and purple: a bonus.",
    skill: "Says “a red ball”, “a blue car”" },
  w2d4: { parent: "Make room to move! Show each action as you say it, your child copies.",
    activity: "Simon Says: Fox gives the orders, your child does the move during the purple bar. Then your child gives you orders: “Jump!”, “Sit down!”.",
    skill: "Understands “sit down” and “stand up”" },
  w2d5: { parent: "Show day! Your child picks 2 or 3 toy animals for the end-of-week show.",
    activity: "The show: your child presents each toy (“It's a dog. It's brown. Woof, woof!”) and acts it out. Week 2 review: see “Friday check” in the parent area. Paper activity “Match the animal”: draw lines from CAT, DOG, FISH, BIRD to the pictures, or point when you say the word.",
    skill: "Presents an animal: “It's a dog. It's brown.”" },
  w3d1: { parent: "Review: one animal and one colour from week 2. If you can, get real fruit ready: real objects make children want to talk.",
    activity: "Pretend fruit basket: your child picks a fruit. Ask “Apple or banana?” and wait a few seconds. The video also has mango, pineapple, kiwi: a bonus.",
    skill: "Names apple, banana, orange, grapes" },
  w3d2: { parent: "Review yesterday's fruit. Get toy cups and plates ready for the café.",
    activity: "Pretend café with toy dishes: your child orders (“Water, please”), you serve (“Here you are”), they say “Thank you!”. Then swap roles. In the “Fox's café” game, Fox orders and your child serves by tapping the right picture.",
    skill: "Says “Water, please” / “Thank you”" },
  w3d3: { parent: "Review: “Water, please”, “Thank you”. Then rub your tummy and say “Yummy!”.",
    activity: "Sort food pictures into two piles: “I like it” and “Not today”. The song is meant to be funny (broccoli ice cream): laugh together, it helps them remember.",
    skill: "Says “I like…” (with help)" },
  w3d4: { parent: "Review: “I like…”. Set up a little café (table, cups, toy fruit).",
    activity: "Take turns being the customer and the server. The server says “Here you are”, the customer “Thank you!”. No need for perfect sentences: “Apple, please” is great.",
    skill: "Uses “please” and “thank you”" },
  w3d5: { parent: "Shop day! Your child picks 3 foods (toys or real) to sell.",
    activity: "Offer 3 choices, your child orders. Week 3 review (“Friday check”). Paper activity “My mini menu”: draw Apple, Banana, Water, Milk; your child circles what they want and says “I'd like…, please”.",
    skill: "Pretends to order food in English" },
  w4d1: { parent: "Review the café (“please”, “thank you”). Get a family photo ready.",
    activity: "Show a family photo, your child points to each person: “This is my mum.” The song says “mother / father”: explain in one sentence that it means the same as “mum / dad”. Memory game: find the pairs.",
    skill: "Names family members" },
  w4d2: { parent: "Review the family. Stand up, ready to move for “Head, shoulders, knees and toes”.",
    activity: "Touch each body part as you name it. Draw a person together and name each part. The song adds shoulders, knees, toes, ears: a bonus.",
    skill: "Shows and names body parts" },
  w4d3: { parent: "Review the body (“touch your nose”). Your child fetches 2 or 3 favourite toys.",
    activity: "Your child presents a favourite toy: “I like my teddy. It's brown.” “What's missing?” game: 3 toys on the table, eyes closed, you hide one. The video also shows car, robot, dinosaur: a bonus.",
    skill: "Describes a toy: “I like my teddy. It's brown.”" },
  w4d4: { parent: "Review the toys. Use a doll to act out its day.",
    activity: "Act out a doll's day: it wakes up, eats, plays, sleeps. Use these every day: “Wash your hands”, “Let's go”, “Good night”.",
    skill: "Says “I eat”, “I play”, “Good night”" },
  w4d5: { parent: "Grand finale! Invite the family or toys as the audience. Your child picks favourite toys to present.",
    activity: "The show: your child introduces themselves to the audience and presents their toys. Final review: “Friday check” (16 skills). Paper activity “My English mini-book”: page 1 My name is…, page 2 I like cats, page 3 I like apples, page 4 I like yellow. Change “six”, “pink”, “cats” to their real answers. The certificate appears in “My stickers” once all 20 lessons are done.",
    skill: "Introduces themselves (with help)" }
};
window.SKILLS_EN = {
  1: ["Says “Hello!” to greet", "Says their name (with help)", "Recognises numbers 1 to 5", "Recognises red, blue, yellow, green"],
  2: ["Names at least 4 animals", "Understands “sit down” and “stand up”", "Answers “What is it?” with a word", "Follows a simple instruction"],
  3: ["Names at least 4 foods", "Says “I like…” (with help)", "Uses “please” and “thank you”", "Pretends to order food in English"],
  4: ["Introduces themselves (with help)", "Answers “How are you?”", "Says one or two simple sentences", "Joins in a short conversation"]
};
