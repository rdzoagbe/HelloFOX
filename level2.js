// Level 2 (weeks 5-8): from repeating words to answering and talking.
// Each lesson: hello -> learn (useful sentences) -> story -> Fox asks (she answers first) -> Talk with Fox -> stars.
// Topics follow the beginner (Pre A1) level used for young learners: me, likes, abilities, places, weather,
// clothes, colours, numbers, animals, food and polite requests. Parent texts: French here, English in PARENT_EN below.
(function () {
  "use strict";
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const L2 = (week, d, o) => Object.assign({ id: "w" + week + "d" + (d + 1), week, level: 2, day: days[d], ready: true }, o);
  const yes = (react) => ({ word: "yes", say: "Yes, I do!", react });
  const no = (react) => ({ word: "no", say: "No, I don't.", react });

  const lessons = [
    // ---------------- WEEK 5 — All about me ----------------
    L2(5, 0, {
      title: "Nice to meet you!", emoji: "🤝",
      warmup: { say: "Hello, {name}! I'm Fox. Nice to meet you!", key: "nice to meet you", prompt: "Say: Nice to meet you!",
        parent: "Bienvenue au niveau 2 ! Maintenant l'enfant ne fait plus que répéter : il répond. Serrez-vous la main : « Nice to meet you! »." },
      cards: [
        { word: "Nice to meet you!", art: "friends", say: "Nice to meet you!", key: "nice to meet you" },
        { word: "How old are you?", art: "cake", say: "How old are you?", key: "how old" },
        { word: "I'm six.", art: "I am six", say: "I'm six.", key: "six" },
        { word: "And you?", art: "your", say: "And you?", key: "and you" }
      ],
      story: { title: "Fox's new friend", pages: [
        { pics: ["fox", "rabbit"], text: "Fox meets Rabbit at the park." },
        { pics: ["fox"], text: "Hello! I'm Fox. Nice to meet you!" },
        { pics: ["rabbit", "cake"], text: "Hello, Fox! I'm Rabbit. I'm five!" },
        { pics: ["friends"], text: "Now Fox and Rabbit are friends." }
      ], q: { ask: "Who is Fox's new friend?", options: ["rabbit", "cat", "duck"], answer: "rabbit", say: "Rabbit is Fox's new friend!" } },
      ask: [
        { q: "What's your name?", pic: "name", answer: "My name is {name}.", key: "my name is" },
        { q: "How old is she?", pic: "I am six", answer: "She's six!", key: "six" },
        { q: "Is it a cat or a dog?", pic: "dog", answer: "It's a dog!", key: "dog" },
        { q: "How are you?", pic: "happy", answer: "I'm happy!", key: "happy" }
      ],
      chat: { scene: "Meeting a new friend", art: "friends", lines: [
        { fox: "Hello! I'm Fox. What's your name?", reply: "My name is {name}.", key: "my name is" },
        { fox: "Nice to meet you, {name}!", reply: "Nice to meet you, Fox!", key: "nice to meet you" },
        { fox: "How old are you?", choices: [
          { word: "six", say: "I'm six!", react: "Six! Great!" },
          { word: "seven", say: "I'm seven!", react: "Seven! Great!" },
          { word: "eight", say: "I'm eight!", react: "Eight! Great!" }] },
        { fox: "Goodbye, {name}! See you!", reply: "Goodbye, Fox!", key: "goodbye" }
      ] },
      speak: { activity: "Jouez la rencontre avec deux peluches : « Hello! I'm Teddy. What's your name? » « Nice to meet you! ». Puis l'enfant fait parler les peluches." },
      skill: "Se présente : prénom et âge"
    }),
    L2(5, 1, {
      title: "I can jump!", emoji: "🤸",
      warmup: { say: "Hello, {name}! I can jump! Jump, jump, jump!", key: "jump", prompt: "Jump and say: I can jump!",
        parent: "Montrez chaque action en la disant : « I can jump! ». L'enfant fait l'action et le dit avec vous." },
      cards: [
        { word: "I can jump.", art: "jump", say: "I can jump!", key: "jump" },
        { word: "I can swim.", art: "swim", say: "I can swim!", key: "swim" },
        { word: "I can dance.", art: "dance", say: "I can dance!", key: "dance" },
        { word: "I can sing.", art: "sing", say: "I can sing!", key: "sing" }
      ],
      story: { title: "What can you do?", pages: [
        { pics: ["fish"], text: "A fish can swim." },
        { pics: ["fly"], text: "A bird can fly." },
        { pics: ["frog"], text: "A frog can jump." },
        { pics: ["dance"], text: "And I can dance!" }
      ], q: { ask: "What can a bird do?", options: ["fly", "swim", "jump"], answer: "fly", say: "A bird can fly!" } },
      ask: [
        { q: "Can a fish swim?", pic: "fish", answer: "Yes, it can!", key: "yes" },
        { q: "Can a dog fly?", pic: "dog", answer: "No, it can't!", key: "no" },
        { q: "What can you do?", pic: "jump", answer: "I can jump!", key: "jump" },
        { q: "Can you sing?", pic: "sing", answer: "Yes, I can! La la la!", key: "yes" }
      ],
      chat: { scene: "Fox's talent show", art: "sing", lines: [
        { fox: "I can sing! La la la! Can you sing?", choices: [
          { word: "yes", say: "Yes, I can!", react: "Let's sing together! La la la!" },
          { word: "no", say: "No, I can't.", react: "That's OK! Everybody can do something!" }] },
        { fox: "Show me! What can you do?", choices: [
          { word: "jump", say: "I can jump!", react: "Wow! Great jumping!" },
          { word: "dance", say: "I can dance!", react: "Wow! Great dancing!" },
          { word: "swim", say: "I can swim!", react: "Wow! Like a fish!" }] },
        { fox: "You're a star, {name}!", reply: "Thank you, Fox!", key: "thank you" }
      ] },
      speak: { activity: "Spectacle de talents : chacun montre ce qu'il sait faire et le dit : « I can jump! », « I can dance! ». Les autres applaudissent : « Well done! »." },
      skill: "Dit ce qu'il sait faire : « I can… »"
    }),
    L2(5, 2, {
      title: "Do you like it?", emoji: "😋",
      warmup: { say: "Hello, {name}! I like ice cream! Do you like ice cream?", key: "yes", prompt: "Say: Yes, I do! or No, I don't.",
        parent: "Posez des questions avec « Do you like…? » en montrant des aliments ou des jouets. Il répond « Yes, I do! » ou « No, I don't. » avec le pouce en haut ou en bas." },
      cards: [
        { word: "Do you like apples?", art: "apple", say: "Do you like apples?", key: "do you like" },
        { word: "Yes, I do!", art: "yes", say: "Yes, I do!", key: "yes i do" },
        { word: "No, I don't.", art: "no", say: "No, I don't.", key: "no i dont" },
        { word: "I like ice cream.", art: "I like ice cream", say: "I like ice cream!", key: "ice cream" }
      ],
      story: { title: "Fox's picnic", pages: [
        { pics: ["fox", "bread"], text: "Fox has a picnic." },
        { pics: ["banana", "apple"], text: "Fox likes bananas. Fox likes apples." },
        { pics: ["ice cream"], text: "Fox loves ice cream! Yummy!" },
        { pics: ["frog", "water"], text: "Frog doesn't like ice cream. Frog likes water!" }
      ], q: { ask: "What does Fox love?", options: ["ice cream", "egg", "milk"], answer: "ice cream", say: "Fox loves ice cream!" } },
      ask: [
        { q: "What's this?", pic: "ice cream", answer: "It's ice cream!", key: "ice cream" },
        { q: "Do you like ice cream?", pic: "ice cream", answer: "Yes, I do!", key: "yes" },
        { q: "What colour is the banana?", pic: "banana", answer: "It's yellow!", key: "yellow" },
        { q: "Do you like apples?", pic: "apple", answer: "Yes, I do! I like apples.", key: "yes" }
      ],
      chat: { scene: "Picnic with Fox", art: "ice cream", lines: [
        { fox: "Let's have a picnic! Do you like apples?", choices: [yes("Here you are! An apple for you!"), no("OK! A banana for you!")] },
        { fox: "Do you like ice cream?", choices: [yes("Me too! Yummy!"), no("OK! More for me! Ha ha!")] },
        { fox: "What do you like?", choices: [
          { word: "banana", say: "I like bananas!", react: "Bananas are yummy!" },
          { word: "bread", say: "I like bread!", react: "Bread is yummy!" },
          { word: "milk", say: "I like milk!", react: "Milk is good!" }] },
        { fox: "Thank you for the picnic!", reply: "You're welcome!", key: "welcome" }
      ] },
      speak: { activity: "Pique-nique sur une couverture avec de vrais aliments ou des jouets. Chacun demande « Do you like…? » et répond « Yes, I do! » / « No, I don't. »." },
      skill: "Répond à « Do you like…? »"
    }),
    L2(5, 3, {
      title: "What's this?", emoji: "🔎",
      warmup: { say: "Hello, {name}! Look! What's this? It's a ball!", key: "ball", prompt: "Point and say: It's a ball!",
        parent: "Montrez des objets : « What's this? ». L'enfant répond « It's a… ». Un seul mot suffit, redites la phrase entière pour lui." },
      cards: [
        { word: "What's this?", art: "box", say: "What's this?", key: "what's this" },
        { word: "It's a ball.", art: "ball", say: "It's a ball.", key: "ball" },
        { word: "Is it a cat?", art: "cat", say: "Is it a cat?", key: "is it" },
        { word: "Yes, it is!", art: "yes", say: "Yes, it is!", key: "yes it is" }
      ],
      story: { title: "Fox's mystery box", pages: [
        { pics: ["box"], text: "Fox has a big box. What's in the box?" },
        { pics: ["box", "ball"], text: "Is it a ball? No, it isn't." },
        { pics: ["box", "teddy"], text: "Is it a teddy? No, it isn't." },
        { pics: ["cat"], text: "Meow! It's a cat! Hello, cat!" }
      ], q: { ask: "What's in the box?", options: ["cat", "ball", "teddy"], answer: "cat", say: "It's a cat!" } },
      ask: [
        { q: "What's this?", pic: "ball", answer: "It's a ball!", key: "ball" },
        { q: "What's this?", pic: "book", answer: "It's a book!", key: "book" },
        { q: "Is it a dog?", pic: "cat", answer: "No, it isn't. It's a cat!", key: "no" },
        { q: "Is it a car?", pic: "a blue car", answer: "Yes, it is!", key: "yes" }
      ],
      chat: { scene: "Guess the toy", art: "box", lines: [
        { fox: "I have a toy in my box. Is it a ball or a teddy?", choices: [
          { word: "ball", say: "Is it a ball?", react: "No, it isn't! It's a teddy! Look!" },
          { word: "teddy", say: "Is it a teddy?", react: "Yes, it is! Well done!" }] },
        { fox: "Your turn! What's in your box?", choices: [
          { word: "doll", say: "It's a doll!", react: "A doll! I like it!" },
          { word: "ball", say: "It's a ball!", react: "A ball! Let's play!" },
          { word: "book", say: "It's a book!", react: "A book! Let's read!" }] },
        { fox: "That was fun! Goodbye!", reply: "Goodbye, Fox!", key: "goodbye" }
      ] },
      speak: { activity: "Boîte mystère : cachez un jouet dans un sac. L'enfant touche sans regarder et devine : « Is it a ball? ». Vous répondez « Yes, it is! » ou « No, it isn't! ». Puis inversez." },
      skill: "Répond à « What's this? » : « It's a… »"
    }),
    L2(5, 4, {
      title: "Show day: all about me", emoji: "🌟",
      warmup: { say: "Hello, {name}! It's show day! Tell me about you!", key: "my name is", prompt: "Say your name, your age and what you can do!",
        parent: "Jour du spectacle ! L'enfant se présente devant la famille ou les peluches : prénom, âge, ce qu'il sait faire, ce qu'il aime." },
      cards: [
        { word: "Nice to meet you!", art: "friends", say: "Nice to meet you!", key: "nice to meet you" },
        { word: "I can jump.", art: "jump", say: "I can jump!", key: "jump" },
        { word: "I like ice cream.", art: "I like ice cream", say: "I like ice cream!", key: "ice cream" },
        { word: "What's this?", art: "box", say: "What's this?", key: "what's this" }
      ],
      story: { title: "Rabbit's day", pages: [
        { pics: ["rabbit"], text: "This is Rabbit. Rabbit is five." },
        { pics: ["rabbit", "jump"], text: "Rabbit can jump. Jump, jump, jump!" },
        { pics: ["rabbit", "apple"], text: "Rabbit likes apples. Yummy!" },
        { pics: ["rabbit", "ball", "fox"], text: "Rabbit and Fox play ball." }
      ], q: { ask: "What does Rabbit like?", options: ["apple", "milk", "egg"], answer: "apple", say: "Rabbit likes apples!" } },
      ask: [
        { q: "What can you do?", pic: "jump", answer: "I can jump!", key: "jump" },
        { q: "Do you like ice cream?", pic: "ice cream", answer: "Yes, I do!", key: "yes" },
        { q: "What's this?", pic: "teddy", answer: "It's a teddy!", key: "teddy" },
        { q: "What's your name?", pic: "name", answer: "My name is {name}.", key: "my name is" }
      ],
      chat: { scene: "The show", art: "friends", lines: [
        { fox: "Welcome to the show! What's your name?", reply: "My name is {name}.", key: "my name is" },
        { fox: "What can you do?", choices: [
          { word: "jump", say: "I can jump!", react: "Show us! Jump, jump!" },
          { word: "dance", say: "I can dance!", react: "Show us! Dance, dance!" },
          { word: "sing", say: "I can sing!", react: "Show us! La la la!" }] },
        { fox: "What do you like?", choices: [
          { word: "ice cream", say: "I like ice cream!", react: "Me too!" },
          { word: "banana", say: "I like bananas!", react: "Yummy!" },
          { word: "cat", say: "I like cats!", react: "Meow!" }] },
        { fox: "Bravo, {name}! Thank you!", reply: "Thank you, Fox!", key: "thank you" }
      ] },
      speak: { activity: "Spectacle : l'enfant se présente en 3 phrases : « My name is… I'm six. I can jump! ». Le public applaudit et pose une question : « Do you like ice cream? »." },
      skill: "Dit 2 ou 3 phrases sur lui-même"
    }),

    // ---------------- WEEK 6 — Out and about ----------------
    L2(6, 0, {
      title: "Where is it?", emoji: "📦",
      warmup: { say: "Hello, {name}! Where is my ball? Can you help me?", key: "where", prompt: "Look for a ball and say where it is!",
        parent: "Cachez un jouet dans, sur ou sous un meuble. Demandez « Where is Teddy? ». L'enfant cherche et répond « In the box! », « On the table! », « Under the table! »." },
      cards: [
        { word: "in the box", art: "in", say: "In the box.", key: "in" },
        { word: "on the table", art: "on", say: "On the table.", key: "on" },
        { word: "under the table", art: "under", say: "Under the table.", key: "under" },
        { word: "Where is the ball?", art: "ball", say: "Where is the ball?", key: "where" }
      ],
      story: { title: "Where is my ball?", pages: [
        { pics: ["fox"], text: "Fox can't find his ball. Where is the ball?" },
        { pics: ["box"], text: "Is it in the box? No, it isn't." },
        { pics: ["table"], text: "Is it on the table? No, it isn't." },
        { pics: ["dog"], text: "Dog says: Woof! Look under the table!" },
        { pics: ["under"], text: "Yes! The ball is under the table!" }
      ], q: { ask: "Where is the ball?", options: ["in", "on", "under"], answer: "under", say: "The ball is under the table!" } },
      ask: [
        { q: "Where is the ball?", pic: "in", answer: "It's in the box!", key: "in" },
        { q: "Where is the ball?", pic: "on", answer: "It's on the table!", key: "on" },
        { q: "Where is the ball?", pic: "under", answer: "It's under the table!", key: "under" },
        { q: "What's this?", pic: "box", answer: "It's a box!", key: "box" }
      ],
      chat: { scene: "Hide and seek", art: "box", lines: [
        { fox: "Let's play hide and seek! Where is Teddy?", choices: [
          { word: "in", say: "In the box!", react: "Let's look… Yes! Teddy is in the box!" },
          { word: "under", say: "Under the table!", react: "Let's look… Yes! Teddy is under the table!" }] },
        { fox: "Now I hide! Am I on the table?", choices: [
          { word: "yes", say: "Yes, you are!", react: "You found me! Ha ha!" },
          { word: "no", say: "No, you aren't!", react: "Ha ha! I'm under the table!" }] },
        { fox: "That was fun! Thank you, {name}!", reply: "Thank you, Fox!", key: "thank you" }
      ] },
      speak: { activity: "Cache-cache avec un doudou : « Where is Teddy? ». L'enfant répond « In the box! », « Under the bed! ». Puis c'est lui qui cache et vous qui cherchez." },
      skill: "Comprend in / on / under"
    }),
    L2(6, 1, {
      title: "What's the weather?", emoji: "☀️",
      warmup: { say: "Good morning, {name}! Look outside! It's sunny!", key: "sunny", prompt: "Look outside. Is it sunny?",
        parent: "Regardez par la fenêtre ensemble : « What's the weather? ». À dire chaque matin cette semaine !" },
      cards: [
        { word: "It's sunny.", art: "sunny", say: "It's sunny.", key: "sunny" },
        { word: "It's rainy.", art: "rainy", say: "It's rainy.", key: "rainy" },
        { word: "It's cold.", art: "cold", say: "It's cold.", key: "cold" },
        { word: "It's hot.", art: "hot", say: "It's hot.", key: "hot" }
      ],
      story: { title: "Fox and the rain", pages: [
        { pics: ["sunny", "fox"], text: "It's sunny. Fox goes to the park." },
        { pics: ["rainy"], text: "Oh no! Now it's rainy!" },
        { pics: ["rainy", "frog"], text: "Frog is happy. Frog likes the rain!" },
        { pics: ["sunny", "fox"], text: "Now it's sunny again. Hooray!" }
      ], q: { ask: "Who likes the rain?", options: ["frog", "fox", "cat"], answer: "frog", say: "Frog likes the rain!" } },
      ask: [
        { q: "What's the weather?", pic: "sunny", answer: "It's sunny!", key: "sunny" },
        { q: "What's the weather?", pic: "rainy", answer: "It's rainy!", key: "rainy" },
        { q: "Brrr! Is it hot or cold?", pic: "cold", answer: "It's cold!", key: "cold" },
        { q: "Phew! Is it hot or cold?", pic: "hot", answer: "It's hot!", key: "hot" }
      ],
      chat: { scene: "The weather report", art: "sunny", lines: [
        { fox: "Good morning, {name}! Look outside. Is it sunny or rainy?", choices: [
          { word: "sunny", say: "It's sunny!", react: "Great! Let's go to the park!" },
          { word: "rainy", say: "It's rainy!", react: "Let's play inside then!" }] },
        { fox: "Brrr! I'm cold! Are you cold?", choices: [
          { word: "yes", say: "Yes, I am!", react: "Let's put on a coat!" },
          { word: "no", say: "No, I'm not!", react: "Lucky you!" }] },
        { fox: "Thank you for the weather report!", reply: "You're welcome!", key: "welcome" }
      ] },
      speak: { activity: "Météo du matin : l'enfant présente la météo comme à la télé : « Good morning! It's sunny! ». Mimez : soleil (bras en rond), pluie (doigts qui tombent), froid (frissons)." },
      skill: "Dit le temps qu'il fait"
    }),
    L2(6, 2, {
      title: "My clothes", emoji: "👕",
      warmup: { say: "Hello, {name}! It's cold! I need my coat!", key: "coat", prompt: "Show me your coat!",
        parent: "En s'habillant le matin, nommez les vêtements en anglais : « Your coat! Your shoes! ». L'enfant montre ou met le vêtement." },
      cards: [
        { word: "a hat", art: "hat", say: "A hat.", key: "hat" },
        { word: "a coat", art: "coat", say: "A coat.", key: "coat" },
        { word: "shoes", art: "shoes", say: "Shoes.", key: "shoes" },
        { word: "a T-shirt", art: "T-shirt", say: "A T-shirt.", key: "t shirt" }
      ],
      story: { title: "Fox gets dressed", pages: [
        { pics: ["fox", "cold"], text: "It's cold today." },
        { pics: ["coat"], text: "Fox puts on his red coat." },
        { pics: ["hat"], text: "Fox puts on his hat." },
        { pics: ["shoes"], text: "And his shoes! Ready? Let's go!" }
      ], q: { ask: "What colour is Fox's coat?", options: ["red", "blue", "green"], answer: "red", say: "Fox's coat is red!" } },
      ask: [
        { q: "What's this?", pic: "hat", answer: "It's a hat!", key: "hat" },
        { q: "What colour is the coat?", pic: "coat", answer: "It's red!", key: "red" },
        { q: "What are these?", pic: "shoes", answer: "They're shoes!", key: "shoes" },
        { q: "Is it hot or cold?", pic: "cold", answer: "It's cold! Put on your coat!", key: "cold" }
      ],
      chat: { scene: "Getting dressed", art: "coat", lines: [
        { fox: "It's cold today! What do you need?", choices: [
          { word: "coat", say: "A coat, please!", react: "Here you are! A warm coat!" },
          { word: "T-shirt", say: "A T-shirt, please!", react: "Brrr! Here's a coat too!" }] },
        { fox: "And a hat?", choices: [
          { word: "yes", say: "Yes, please!", react: "Here you are!" },
          { word: "no", say: "No, thank you!", react: "OK!" }] },
        { fox: "You look great, {name}!", reply: "Thank you!", key: "thank you" }
      ] },
      speak: { activity: "Défilé de mode : l'enfant s'habille avec des vêtements trop grands et présente : « A hat! A coat! Shoes! ». Le public dit « You look great! »." },
      skill: "Nomme 4 vêtements"
    }),
    L2(6, 3, {
      title: "Let's go!", emoji: "🏞️",
      warmup: { say: "Hello, {name}! It's sunny! Let's go to the park!", key: "park", prompt: "Say: Let's go to the park!",
        parent: "Dehors, nommez les lieux : « The park! The shop! School! ». En partant : « Let's go! »." },
      cards: [
        { word: "the park", art: "park", say: "The park.", key: "park" },
        { word: "the shop", art: "shop", say: "The shop.", key: "shop" },
        { word: "school", art: "school", say: "School.", key: "school" },
        { word: "home", art: "house", say: "Home.", key: "home" }
      ],
      story: { title: "Fox's busy day", pages: [
        { pics: ["school"], text: "In the morning, Fox goes to school." },
        { pics: ["park"], text: "After school, Fox goes to the park." },
        { pics: ["shop", "apple"], text: "Then Fox goes to the shop. He buys an apple." },
        { pics: ["house"], text: "In the evening, Fox goes home. Goodnight, Fox!" }
      ], q: { ask: "Where does Fox buy an apple?", options: ["shop", "park", "school"], answer: "shop", say: "At the shop!" } },
      ask: [
        { q: "Where is this?", pic: "park", answer: "It's the park!", key: "park" },
        { q: "Where is this?", pic: "shop", answer: "It's the shop!", key: "shop" },
        { q: "Where is this?", pic: "school", answer: "It's school!", key: "school" },
        { q: "Where do you sleep?", pic: "house", answer: "At home!", key: "home" }
      ],
      chat: { scene: "Where shall we go?", art: "park", lines: [
        { fox: "It's sunny! Where shall we go?", choices: [
          { word: "park", say: "Let's go to the park!", react: "Yes! I love the park!" },
          { word: "shop", say: "Let's go to the shop!", react: "OK! Let's buy an ice cream!" }] },
        { fox: "Bus or bike?", choices: [
          { word: "bus", say: "By bus!", react: "Beep beep! Here's the bus!" },
          { word: "bike", say: "By bike!", react: "Ring ring! Let's go!" }] },
        { fox: "That was fun! Now let's go home.", reply: "OK! Let's go home!", key: "home" }
      ] },
      speak: { activity: "Promenade en anglais : en marchant dans le quartier, montrez « The park! The shop! ». À la maison, faites des panneaux dessinés et jouez au bus : « Next stop: the park! »." },
      skill: "Nomme 4 lieux : park, shop, school, home"
    }),
    L2(6, 4, {
      title: "Show day: out and about", emoji: "🌟",
      warmup: { say: "Hello, {name}! It's show day! Let's go out!", key: "let's go", prompt: "Say: Let's go!",
        parent: "Jour du spectacle ! Préparez un petit parcours : un chapeau, une boîte, une table. L'enfant raconte où il va et ce qu'il porte." },
      cards: [
        { word: "under the table", art: "under", say: "Under the table.", key: "under" },
        { word: "It's sunny.", art: "sunny", say: "It's sunny.", key: "sunny" },
        { word: "a hat", art: "hat", say: "A hat.", key: "hat" },
        { word: "the park", art: "park", say: "The park.", key: "park" }
      ],
      story: { title: "A day at the park", pages: [
        { pics: ["sunny", "park"], text: "It's sunny. Fox and Dog go to the park." },
        { pics: ["dog", "ball"], text: "Dog has a ball." },
        { pics: ["rainy", "hat"], text: "Oh! It's rainy! Fox puts on his hat." },
        { pics: ["house"], text: "Fox and Dog go home. What a fun day!" }
      ], q: { ask: "What does Dog have?", options: ["ball", "hat", "book"], answer: "ball", say: "Dog has a ball!" } },
      ask: [
        { q: "Where is the ball?", pic: "in", answer: "It's in the box!", key: "in" },
        { q: "What's the weather?", pic: "rainy", answer: "It's rainy!", key: "rainy" },
        { q: "What are these?", pic: "shoes", answer: "They're shoes!", key: "shoes" },
        { q: "Where is this?", pic: "school", answer: "It's school!", key: "school" }
      ],
      chat: { scene: "The show", art: "park", lines: [
        { fox: "Welcome to the show! What's the weather today?", choices: [
          { word: "sunny", say: "It's sunny!", react: "Lovely!" },
          { word: "rainy", say: "It's rainy!", react: "Splash, splash!" },
          { word: "cold", say: "It's cold!", react: "Brrr! Put on your coat!" }] },
        { fox: "Where do you like to go?", choices: [
          { word: "park", say: "I like the park!", react: "Me too!" },
          { word: "shop", say: "I like the shop!", react: "Ice cream! Yummy!" },
          { word: "school", say: "I like school!", react: "School is fun!" }] },
        { fox: "Bravo, {name}! You're a star!", reply: "Thank you, Fox!", key: "thank you" }
      ] },
      speak: { activity: "Spectacle météo et mode : l'enfant présente la météo, choisit ses vêtements (« It's cold! A coat, please! ») et dit où il va (« Let's go to the park! »)." },
      skill: "Dit où est un objet (in / on / under)"
    }),

    // ---------------- WEEK 7 — Describing things ----------------
    L2(7, 0, {
      title: "Big and small", emoji: "🐘",
      warmup: { say: "Hello, {name}! Look! An elephant! It's big! Very big!", key: "big", prompt: "Show me big! Show me small!",
        parent: "Faites « big » avec les bras grands ouverts et « small » avec deux doigts. L'enfant fait le geste en disant le mot." },
      cards: [
        { word: "It's big!", art: "elephant", say: "It's big!", key: "big" },
        { word: "It's small!", art: "mouse", say: "It's small!", key: "small" },
        { word: "a big ball", art: "big ball", say: "A big ball.", key: "big ball" },
        { word: "a small ball", art: "small ball", say: "A small ball.", key: "small ball" }
      ],
      story: { title: "Big Elephant, small Mouse", pages: [
        { pics: ["elephant"], text: "This is Elephant. Elephant is big." },
        { pics: ["mouse"], text: "This is Mouse. Mouse is small." },
        { pics: ["elephant", "box"], text: "Elephant is sad. He can't find his ball." },
        { pics: ["mouse", "small ball"], text: "Small Mouse finds the ball! Thank you, Mouse!" }
      ], q: { ask: "Who is small?", options: ["mouse", "elephant", "lion"], answer: "mouse", say: "Mouse is small!" } },
      ask: [
        { q: "Is it big or small?", pic: "elephant", answer: "It's big!", key: "big" },
        { q: "Is it big or small?", pic: "mouse", answer: "It's small!", key: "small" },
        { q: "Is the ball big or small?", pic: "big ball", answer: "It's big!", key: "big" },
        { q: "Is the ball big or small?", pic: "small ball", answer: "It's small!", key: "small" }
      ],
      chat: { scene: "At the zoo", art: "elephant", lines: [
        { fox: "Look! An elephant! Is it big or small?", choices: [
          { word: "big", say: "It's big!", react: "Yes! Very, very big!" },
          { word: "small", say: "It's small!", react: "Small? No! It's very big! Ha ha!" }] },
        { fox: "And a mouse? Big or small?", choices: [
          { word: "big", say: "It's big!", react: "Big? No! A mouse is small! Ha ha!" },
          { word: "small", say: "It's small!", react: "Yes! Very small!" }] },
        { fox: "Are you big or small, {name}?", choices: [
          { word: "big", say: "I'm big!", react: "Yes! Big and strong!" },
          { word: "small", say: "I'm small!", react: "Small and super!" }] }
      ] },
      speak: { activity: "Trier les jouets : « Big or small? ». L'enfant met les gros jouets d'un côté, les petits de l'autre, en disant « It's big! » ou « It's small! »." },
      skill: "Dit « big » et « small »"
    }),
    L2(7, 1, {
      title: "How many?", emoji: "🔢",
      warmup: { say: "Hello, {name}! Let's count to ten! One, two, three, four, five, six, seven, eight, nine, ten!", key: "ten", prompt: "Count to ten with your fingers!",
        parent: "Comptez jusqu'à 10 avec les doigts. Puis comptez des objets de la maison : « How many spoons? »." },
      cards: [
        { word: "six", art: "six", say: "Six.", key: "six" },
        { word: "seven", art: "seven", say: "Seven.", key: "seven" },
        { word: "eight", art: "eight", say: "Eight.", key: "eight" },
        { word: "How many?", art: "apple", n: 3, say: "How many apples? Three!", key: "how many" }
      ],
      story: { title: "Fox counts", pages: [
        { pics: [{ word: "apple", n: 6 }], text: "Fox has six apples." },
        { pics: [{ word: "ball", n: 7 }], text: "Seven balls!" },
        { pics: [{ word: "duck", n: 8 }], text: "Eight ducks! Quack, quack!" },
        { pics: [{ word: "fish", n: 9 }], text: "Nine fish! Wow!" }
      ], q: { ask: "How many ducks?", options: ["six", "seven", "eight"], answer: "eight", say: "Eight ducks!" } },
      ask: [
        { q: "How many cats?", pic: { word: "cat", n: 3 }, answer: "Three cats!", key: "three" },
        { q: "How many apples?", pic: { word: "apple", n: 5 }, answer: "Five apples!", key: "five" },
        { q: "How many balls?", pic: { word: "ball", n: 6 }, answer: "Six balls!", key: "six" },
        { q: "How many birds?", pic: { word: "bird", n: 4 }, answer: "Four birds!", key: "four" }
      ],
      chat: { scene: "Fox's fruit shop", art: "shop", lines: [
        { fox: "Welcome to my shop! How many apples do you want?", choices: [
          { word: "two", say: "Two apples, please!", react: "One, two! Here you are!" },
          { word: "five", say: "Five apples, please!", react: "One, two, three, four, five! Here you are!" }] },
        { fox: "How old are you?", choices: [
          { word: "six", say: "I'm six!", react: "Six! Great!" },
          { word: "seven", say: "I'm seven!", react: "Seven! Great!" },
          { word: "eight", say: "I'm eight!", react: "Eight! Great!" }] },
        { fox: "Thank you! Come again!", reply: "Thank you! Goodbye!", key: "goodbye" }
      ] },
      speak: { activity: "Comptez tout dans la maison : marches, chaussures, cuillères. « How many shoes? » L'enfant compte en anglais. Puis il pose la question à son tour." },
      skill: "Compte jusqu'à 10 et répond à « How many? »"
    }),
    L2(7, 2, {
      title: "More colours", emoji: "🎨",
      warmup: { say: "Hello, {name}! Let's paint! Pink, purple, black and white!", key: "pink", prompt: "Find something pink!",
        parent: "Révisez red, blue, yellow, green, puis ajoutez pink, purple, black, white. Jeu : « Find something pink! »." },
      cards: [
        { word: "pink", art: "pink", say: "Pink.", key: "pink" },
        { word: "purple", art: "purple", say: "Purple.", key: "purple" },
        { word: "black", art: "black", say: "Black.", key: "black" },
        { word: "white", art: "white", say: "White.", key: "white" }
      ],
      story: { title: "Fox paints", pages: [
        { pics: ["fox", "red"], text: "Fox has red paint." },
        { pics: ["white"], text: "And white paint." },
        { pics: ["red", "white"], text: "Red and white make… pink!" },
        { pics: ["pink", "fox"], text: "Fox paints a pink flower. Pretty!" }
      ], q: { ask: "Red and white make…?", options: ["pink", "purple", "black"], answer: "pink", say: "Red and white make pink!" } },
      ask: [
        { q: "What colour is it?", pic: "pink", answer: "It's pink!", key: "pink" },
        { q: "What colour is the cat?", pic: "a black cat", answer: "It's black!", key: "black" },
        { q: "What colour are the grapes?", pic: "grapes", answer: "They're purple!", key: "purple" },
        { q: "What colour is the egg?", pic: "egg", answer: "It's white!", key: "white" }
      ],
      chat: { scene: "Painting with Fox", art: "pink", lines: [
        { fox: "Let's paint! What colour do you like?", choices: [
          { word: "pink", say: "I like pink!", react: "Pink is pretty!" },
          { word: "purple", say: "I like purple!", react: "Purple is beautiful!" },
          { word: "blue", say: "I like blue!", react: "Blue like the sky!" }] },
        { fox: "I'm painting a cat. What colour?", choices: [
          { word: "black", say: "A black cat!", react: "Meow! A black cat!" },
          { word: "white", say: "A white cat!", react: "Meow! A white cat!" }] },
        { fox: "Look at our picture! Do you like it?", choices: [yes("Me too!"), no("Let's paint again!")] }
      ] },
      speak: { activity: "Peinture : mélangez rouge et blanc pour faire du rose. Pendant que l'enfant peint, demandez « What colour is it? »." },
      skill: "Nomme 8 couleurs"
    }),
    L2(7, 3, {
      title: "What can it do?", emoji: "🐦",
      warmup: { say: "Hello, {name}! A bird can fly! A fish can swim! What can you do?", key: "can", prompt: "Fly like a bird! Swim like a fish!",
        parent: "Mimez les animaux : voler comme un oiseau, nager comme un poisson, sauter comme une grenouille. L'enfant dit la phrase en mimant." },
      cards: [
        { word: "A bird can fly.", art: "fly", say: "A bird can fly.", key: "fly" },
        { word: "A fish can swim.", art: "fish", say: "A fish can swim.", key: "swim" },
        { word: "A frog can jump.", art: "frog", say: "A frog can jump.", key: "jump" },
        { word: "A dog can run.", art: "dog", say: "A dog can run.", key: "run" }
      ],
      story: { title: "The big race", pages: [
        { pics: ["dog", "frog", "duck"], text: "Dog, Frog and Duck have a race." },
        { pics: ["dog"], text: "Dog can run. Run, Dog, run!" },
        { pics: ["frog"], text: "Frog can jump. Jump, Frog, jump!" },
        { pics: ["duck"], text: "Duck can swim and fly! Duck wins!" }
      ], q: { ask: "Who wins the race?", options: ["duck", "dog", "frog"], answer: "duck", say: "Duck wins!" } },
      ask: [
        { q: "Can a fish fly?", pic: "fish", answer: "No, it can't! It can swim.", key: "no" },
        { q: "Can a bird fly?", pic: "fly", answer: "Yes, it can!", key: "yes" },
        { q: "What can a frog do?", pic: "frog", answer: "It can jump!", key: "jump" },
        { q: "Can a dog run?", pic: "dog", answer: "Yes, it can!", key: "yes" }
      ],
      chat: { scene: "Guess the animal", art: "fly", lines: [
        { fox: "I'm an animal. I can fly! What am I?", choices: [
          { word: "bird", say: "A bird!", react: "Yes! Tweet tweet!" },
          { word: "fish", say: "A fish!", react: "No! A fish can swim. I'm a bird! Tweet!" }] },
        { fox: "I'm an animal. I can swim! What am I?", choices: [
          { word: "fish", say: "A fish!", react: "Yes! Blub, blub!" },
          { word: "dog", say: "A dog!", react: "Dogs can swim too! But I'm a fish! Blub!" }] },
        { fox: "Your turn! What can you do?", choices: [
          { word: "jump", say: "I can jump!", react: "Jump, jump! Like a frog!" },
          { word: "run", say: "I can run!", react: "Run, run! Like a dog!" },
          { word: "dance", say: "I can dance!", react: "Dance, dance! Wonderful!" }] }
      ] },
      speak: { activity: "Devinette : vous mimez un animal et dites « I can fly! What am I? ». L'enfant devine « A bird! ». Puis inversez." },
      skill: "Dit ce qu'un animal sait faire"
    }),
    L2(7, 4, {
      title: "Show day: the zoo", emoji: "🌟",
      warmup: { say: "Hello, {name}! It's show day! Let's go to the zoo!", key: "zoo", prompt: "Be an animal! Roar like a lion!",
        parent: "Jour du spectacle ! Sortez les animaux en peluche : l'enfant est le guide du zoo et décrit chaque animal (big/small, couleur, ce qu'il sait faire)." },
      cards: [
        { word: "It's big!", art: "elephant", say: "It's big!", key: "big" },
        { word: "How many?", art: "bird", n: 3, say: "How many birds? Three!", key: "how many" },
        { word: "It's pink.", art: "pink", say: "It's pink.", key: "pink" },
        { word: "A bird can fly.", art: "fly", say: "A bird can fly.", key: "fly" }
      ],
      story: { title: "At the zoo", pages: [
        { pics: ["lion"], text: "At the zoo there is a big lion." },
        { pics: [{ word: "bird", n: 3 }], text: "Three blue birds can fly." },
        { pics: ["elephant"], text: "The grey elephant is very big." },
        { pics: ["mouse"], text: "And a small mouse says: Hello!" }
      ], q: { ask: "How many birds?", options: ["three", "two", "five"], answer: "three", say: "Three birds!" } },
      ask: [
        { q: "Is the lion big or small?", pic: "lion", answer: "It's big!", key: "big" },
        { q: "How many ducks?", pic: { word: "duck", n: 2 }, answer: "Two ducks!", key: "two" },
        { q: "What colour is it?", pic: "purple", answer: "It's purple!", key: "purple" },
        { q: "What can a fish do?", pic: "fish", answer: "It can swim!", key: "swim" }
      ],
      chat: { scene: "The zoo guide", art: "lion", lines: [
        { fox: "Welcome to the zoo! What animal do you like?", choices: [
          { word: "lion", say: "I like lions!", react: "Roar! Lions are big!" },
          { word: "elephant", say: "I like elephants!", react: "Elephants are very big!" },
          { word: "rabbit", say: "I like rabbits!", react: "Rabbits can jump!" }] },
        { fox: "Look! Can a lion fly?", choices: [
          { word: "yes", say: "Yes, it can!", react: "Ha ha! No! A lion can't fly! It can run!" },
          { word: "no", say: "No, it can't!", react: "That's right! A lion can run!" }] },
        { fox: "What a great day! Thank you, {name}!", reply: "Thank you, Fox!", key: "thank you" }
      ] },
      speak: { activity: "Le zoo de la maison : l'enfant présente 3 animaux en peluche : « This is a lion. It's big. It can run! ». Le public pose une question : « How many cats? »." },
      skill: "Décrit un animal en 2 phrases"
    }),

    // ---------------- WEEK 8 — Real conversations ----------------
    L2(8, 0, {
      title: "Can I have…, please?", emoji: "🛒",
      warmup: { say: "Hello, {name}! I'm hungry! Can I have a banana, please?", key: "can i have", prompt: "Say: Can I have…, please?",
        parent: "À table, l'enfant demande en anglais : « Can I have water, please? ». Répondez « Here you are! », il dit « Thank you! », vous dites « You're welcome! »." },
      cards: [
        { word: "Can I have a banana, please?", art: "banana", say: "Can I have a banana, please?", key: "can i have" },
        { word: "Here you are.", art: "here you are", say: "Here you are.", key: "here you are" },
        { word: "Thank you!", art: "thank you", say: "Thank you!", key: "thank you" },
        { word: "You're welcome.", art: "happy", say: "You're welcome.", key: "welcome" }
      ],
      story: { title: "At Fox's shop", pages: [
        { pics: ["shop", "fox"], text: "Fox has a shop." },
        { pics: ["rabbit", "banana"], text: "Rabbit says: Can I have a banana, please?" },
        { pics: ["fox", "banana"], text: "Fox says: Here you are!" },
        { pics: ["rabbit", "thank you"], text: "Rabbit says: Thank you! Fox says: You're welcome!" }
      ], q: { ask: "What does Rabbit want?", options: ["banana", "apple", "bread"], answer: "banana", say: "Rabbit wants a banana!" } },
      ask: [
        { q: "You want an apple. What do you say?", pic: "apple", answer: "Can I have an apple, please?", key: "can i have" },
        { q: "Fox gives you milk. What do you say?", pic: "milk", answer: "Thank you!", key: "thank you" },
        { q: "You want some bread. What do you say?", pic: "bread", answer: "Can I have some bread, please?", key: "bread" },
        { q: "You say thank you. What does Fox say?", pic: "thank you", answer: "You're welcome!", key: "welcome" }
      ],
      chat: { scene: "Fox's shop", art: "shop", lines: [
        { fox: "Hello! Welcome to my shop! What would you like?", choices: [
          { word: "banana", say: "Can I have a banana, please?", react: "Here you are!" },
          { word: "apple", say: "Can I have an apple, please?", react: "Here you are!" },
          { word: "ice cream", say: "Can I have an ice cream, please?", react: "Here you are! Yummy!" }] },
        { fox: "Here you are!", reply: "Thank you!", key: "thank you" },
        { fox: "You're welcome! Anything else?", choices: [
          { word: "yes", say: "Yes, please! Milk, please!", react: "Here you are! Milk!" },
          { word: "no", say: "No, thank you!", react: "OK!" }] },
        { fox: "Goodbye! Come again!", reply: "Goodbye, Fox!", key: "goodbye" }
      ] },
      speak: { activity: "Marchande : installez une boutique avec de vrais fruits. L'enfant achète : « Can I have an apple, please? » « Here you are! » « Thank you! » « You're welcome! ». Puis il tient la boutique." },
      skill: "Demande poliment : « Can I have…, please? »"
    }),
    L2(8, 1, {
      title: "How do you feel?", emoji: "😊",
      warmup: { say: "Hello, {name}! How are you today? I'm happy!", key: "happy", prompt: "Show me happy! Show me tired!",
        parent: "Demandez « How are you? » plusieurs fois dans la journée. Ajoutez « I'm hungry » avant le repas et « I'm thirsty » quand l'enfant a soif." },
      cards: [
        { word: "I'm hungry.", art: "eat", say: "I'm hungry.", key: "hungry" },
        { word: "I'm thirsty.", art: "water", say: "I'm thirsty.", key: "thirsty" },
        { word: "I'm cold.", art: "cold", say: "I'm cold.", key: "cold" },
        { word: "I'm happy!", art: "happy", say: "I'm happy!", key: "happy" }
      ],
      story: { title: "Fox's long day", pages: [
        { pics: ["fox", "run"], text: "Fox runs and runs." },
        { pics: ["water"], text: "I'm thirsty, says Fox. He drinks water." },
        { pics: ["eat"], text: "I'm hungry, says Fox. He eats." },
        { pics: ["sleep"], text: "I'm tired! Goodnight, Fox!" }
      ], q: { ask: "Fox is thirsty. What does he drink?", options: ["water", "milk", "banana"], answer: "water", say: "Fox drinks water!" } },
      ask: [
        { q: "How does she feel?", pic: "happy", answer: "She's happy!", key: "happy" },
        { q: "How does she feel?", pic: "sad", answer: "She's sad.", key: "sad" },
        { q: "You want water. What do you say?", pic: "water", answer: "I'm thirsty!", key: "thirsty" },
        { q: "You want food. What do you say?", pic: "eat", answer: "I'm hungry!", key: "hungry" }
      ],
      chat: { scene: "How are you today?", art: "happy", lines: [
        { fox: "Hello, {name}! How are you today?", choices: [
          { word: "happy", say: "I'm happy!", react: "Hooray! I'm happy too!" },
          { word: "tired", say: "I'm tired.", react: "Let's sit down and rest." },
          { word: "sad", say: "I'm sad.", react: "Oh no! Here's a big hug from Fox!" }] },
        { fox: "Are you hungry?", choices: [
          { word: "yes", say: "Yes, I am!", react: "Here's an apple!" },
          { word: "no", say: "No, I'm not.", react: "OK!" }] },
        { fox: "Are you thirsty?", choices: [
          { word: "yes", say: "Yes, I am!", react: "Here's some water!" },
          { word: "no", say: "No, I'm not.", react: "OK! Let's play!" }] }
      ] },
      speak: { activity: "La météo des émotions : chaque soir, chacun dit comment il se sent : « I'm happy! », « I'm tired. ». Dessinez les visages sur des cartes." },
      skill: "Dit comment il se sent (hungry, thirsty, tired…)"
    }),
    L2(8, 2, {
      title: "Let's play!", emoji: "⚽",
      warmup: { say: "Hello, {name}! Let's play! Catch the ball!", key: "let's play", prompt: "Say: Let's play!",
        parent: "Jouez à la balle et dites à chaque lancer « My turn! » puis « Your turn! ». Ces petites phrases servent à l'école avec les copains." },
      cards: [
        { word: "Let's play!", art: "play", say: "Let's play!", key: "let's play" },
        { word: "Can I play too?", art: "friends", say: "Can I play too?", key: "play too" },
        { word: "My turn!", art: "my", say: "My turn!", key: "my turn" },
        { word: "Your turn!", art: "your", say: "Your turn!", key: "your turn" }
      ],
      story: { title: "A ball for everyone", pages: [
        { pics: ["dog", "ball"], text: "Dog has a ball." },
        { pics: ["cat"], text: "Cat says: Can I play too?" },
        { pics: ["dog", "cat"], text: "Yes! Let's play! says Dog." },
        { pics: ["dog", "ball", "cat"], text: "My turn! Your turn! They are happy." }
      ], q: { ask: "What do Dog and Cat play with?", options: ["ball", "doll", "book"], answer: "ball", say: "They play with a ball!" } },
      ask: [
        { q: "You want to play. What do you say?", pic: "play", answer: "Let's play!", key: "let's play" },
        { q: "Your friends play ball. What do you say?", pic: "friends", answer: "Can I play too?", key: "play too" },
        { q: "You have the ball. What do you say?", pic: "my", answer: "My turn!", key: "my turn" },
        { q: "You give the ball. What do you say?", pic: "your", answer: "Your turn!", key: "your turn" }
      ],
      chat: { scene: "Playtime", art: "ball", lines: [
        { fox: "Hello, {name}! Let's play! Ball or dolls?", choices: [
          { word: "ball", say: "Let's play ball!", react: "Great! Catch!" },
          { word: "doll", say: "Let's play with dolls!", react: "Great! Hello, dolly!" }] },
        { fox: "Now it's your turn!", reply: "My turn! Thank you!", key: "my turn" },
        { fox: "Can my friend Rabbit play too?", reply: "Yes! Let's play together!", key: "yes" },
        { fox: "That was fun! Thank you for playing!", reply: "Thank you, Fox!", key: "thank you" }
      ] },
      speak: { activity: "Jeu de société simple (dés, cartes) : à chaque tour, dites « My turn! » / « Your turn! ». Invitez un autre membre de la famille : il demande « Can I play too? »." },
      skill: "Utilise « Let's play! », « My turn! », « Your turn! »"
    }),
    L2(8, 3, {
      title: "My day", emoji: "🌙",
      warmup: { say: "Good morning, {name}! I wake up. I eat breakfast. And you?", key: "wake up", prompt: "Show me: wake up, eat, sleep!",
        parent: "Racontez la journée avec des gestes : se réveiller, manger, aller à l'école, se coucher. Utilisez ces phrases aux vrais moments de la journée." },
      cards: [
        { word: "I wake up.", art: "wake up", say: "I wake up.", key: "wake up" },
        { word: "I eat breakfast.", art: "eat", say: "I eat breakfast.", key: "breakfast" },
        { word: "I go to school.", art: "school", say: "I go to school.", key: "school" },
        { word: "I go to bed.", art: "sleep", say: "I go to bed.", key: "bed" }
      ],
      story: { title: "Fox's day", pages: [
        { pics: ["wake up"], text: "Fox wakes up. Good morning!" },
        { pics: ["eat"], text: "Fox eats breakfast. Yummy!" },
        { pics: ["school"], text: "Fox goes to school." },
        { pics: ["sleep"], text: "At night, Fox goes to bed. Goodnight!" }
      ], q: { ask: "What does Fox do at night?", options: ["sleep", "school", "eat"], answer: "sleep", say: "Fox goes to bed!" } },
      ask: [
        { q: "What do you do in the morning?", pic: "wake up", answer: "I wake up!", key: "wake up" },
        { q: "What do you eat in the morning?", pic: "eat", answer: "I eat breakfast!", key: "breakfast" },
        { q: "Where do you go?", pic: "school", answer: "I go to school!", key: "school" },
        { q: "What do you do at night?", pic: "sleep", answer: "I go to bed!", key: "bed" }
      ],
      chat: { scene: "Good morning!", art: "wake up", lines: [
        { fox: "Good morning, {name}! Do you go to school today?", choices: [yes("Have a great day at school!"), no("Great! Let's play today!")] },
        { fox: "What do you eat for breakfast?", choices: [
          { word: "bread", say: "I eat bread!", react: "Yummy!" },
          { word: "egg", say: "I eat eggs!", react: "Yummy!" },
          { word: "banana", say: "I eat bananas!", react: "Yummy!" }] },
        { fox: "And at night?", reply: "I go to bed!", key: "bed" },
        { fox: "Goodnight, {name}! Sleep well!", reply: "Goodnight, Fox!", key: "goodnight" }
      ] },
      speak: { activity: "Le livre de ma journée : 4 dessins (réveil, petit-déjeuner, école, lit). L'enfant montre chaque dessin et dit la phrase. Le soir, finissez par « Goodnight! »." },
      skill: "Raconte sa journée en 3 ou 4 phrases"
    }),
    L2(8, 4, {
      title: "Big show day!", emoji: "🏆",
      warmup: { say: "Hello, {name}! It's the big show! You can talk in English now! Let's go!", key: "hello", prompt: "Say hello to everybody!",
        parent: "Grande finale du niveau 2 ! Invitez la famille. L'enfant a une vraie petite conversation avec Fox, puis avec vous. Filmez si vous voulez un souvenir (sans le publier)." },
      cards: [
        { word: "Nice to meet you!", art: "friends", say: "Nice to meet you!", key: "nice to meet you" },
        { word: "Can I have…, please?", art: "please", say: "Can I have some cake, please?", key: "can i have" },
        { word: "Let's play!", art: "play", say: "Let's play!", key: "let's play" },
        { word: "Goodbye! See you!", art: "goodbye", say: "Goodbye! See you!", key: "goodbye" }
      ],
      story: { title: "Fox's party", pages: [
        { pics: ["fox", "friends"], text: "Fox has a party. All his friends come." },
        { pics: ["rabbit", "cake"], text: "Rabbit says: Can I have some cake, please?" },
        { pics: ["dog", "ball"], text: "Dog says: Let's play ball!" },
        { pics: ["fox"], text: "Fox is very happy. Thank you, friends!" }
      ], q: { ask: "What does Rabbit want?", options: ["cake", "milk", "egg"], answer: "cake", say: "Rabbit wants some cake!" } },
      ask: [
        { q: "What's your name?", pic: "name", answer: "My name is {name}.", key: "my name is" },
        { q: "What can you do?", pic: "dance", answer: "I can dance!", key: "dance" },
        { q: "What's the weather?", pic: "sunny", answer: "It's sunny!", key: "sunny" },
        { q: "Where is the ball?", pic: "under", answer: "It's under the table!", key: "under" }
      ],
      chat: { scene: "The big party", art: "cake", lines: [
        { fox: "Hello, {name}! Welcome to my party! How are you?", choices: [
          { word: "happy", say: "I'm happy!", react: "Me too! It's a party!" },
          { word: "good", say: "I'm fine, thank you!", react: "Great!" }] },
        { fox: "Do you like cake?", choices: [yes("Here you are! A big piece!"), no("OK! Here's an apple!")] },
        { fox: "Let's dance! Can you dance?", choices: [
          { word: "yes", say: "Yes, I can!", react: "Let's dance together!" },
          { word: "no", say: "No, I can't.", react: "Let's try! It's fun!" }] },
        { fox: "Thank you for coming, {name}! You can talk in English now!", reply: "Thank you, Fox! Goodbye!", key: "goodbye" }
      ] },
      speak: { activity: "Grande fête : l'enfant accueille les invités en anglais (« Hello! Nice to meet you! »), sert à manger (« Here you are! ») et propose un jeu (« Let's play! »)." },
      skill: "Tient une petite conversation de 4 échanges"
    })
  ];
  window.LESSONS.push(...lessons);

  Object.assign(window.WEEK_THEMES, {
    5: "All about me: I can…, I like…",
    6: "Out and about: places, weather, clothes",
    7: "Describing things: big, small, how many",
    8: "Real conversations"
  });
  Object.assign(window.SKILLS, {
    5: ["Se présente : prénom et âge", "Dit « I can… »", "Répond « Yes, I do » / « No, I don't »", "Répond à « What's this? »"],
    6: ["Comprend in / on / under", "Dit le temps qu'il fait", "Nomme 4 vêtements", "Nomme 4 lieux"],
    7: ["Dit « big » et « small »", "Compte jusqu'à 10", "Nomme 8 couleurs", "Dit ce qu'un animal sait faire"],
    8: ["Demande poliment avec « Can I have…, please? »", "Dit comment il se sent", "Utilise « My turn » / « Your turn »", "Tient une conversation de 4 échanges"]
  });
  Object.assign(window.SKILLS_EN, {
    5: ["Introduces themselves: name and age", "Says “I can…”", "Answers “Yes, I do” / “No, I don't”", "Answers “What's this?”"],
    6: ["Understands in / on / under", "Says what the weather is like", "Names 4 clothes", "Names 4 places"],
    7: ["Says “big” and “small”", "Counts to 10", "Names 8 colours", "Says what an animal can do"],
    8: ["Asks politely: “Can I have…, please?”", "Says how they feel", "Uses “My turn” / “Your turn”", "Holds a 4-turn conversation"]
  });
  window.STICKERS.push(
    { e: "🐼", w: "panda" }, { e: "🐧", w: "penguin" }, { e: "🦒", w: "giraffe" }, { e: "🐢", w: "turtle" },
    { e: "🐝", w: "bee" }, { e: "🍓", w: "strawberry" }, { e: "🍉", w: "watermelon" }, { e: "🍪", w: "cookie" },
    { e: "🎂", w: "cake" }, { e: "🚲", w: "bike" }, { e: "🚌", w: "bus" }, { e: "✈️", w: "plane" },
    { e: "🚀", w: "rocket" }, { e: "🌙", w: "moon" }, { e: "☀️", w: "sun" }, { e: "☂️", w: "umbrella" },
    { e: "🎸", w: "guitar" }, { e: "🎁", w: "present" }, { e: "🏠", w: "house" }, { e: "🐙", w: "octopus" }
  );

  Object.assign(window.PARENT_EN, {
    w5d1: { parent: "Welcome to Level 2! Now your child doesn't just repeat: they answer. Shake hands: “Nice to meet you!”.",
      activity: "Act out a first meeting with two cuddly toys: “Hello! I'm Teddy. What's your name?” “Nice to meet you!”. Then your child makes the toys talk.",
      skill: "Introduces themselves: name and age" },
    w5d2: { parent: "Show each action as you say it: “I can jump!”. Your child does the action and says it with you.",
      activity: "Talent show: everyone shows what they can do and says it: “I can jump!”, “I can dance!”. The others clap: “Well done!”.",
      skill: "Says what they can do: “I can…”" },
    w5d3: { parent: "Ask “Do you like…?” while showing food or toys. Your child answers “Yes, I do!” or “No, I don't.” with a thumb up or down.",
      activity: "Picnic on a blanket with real food or toys. Everyone asks “Do you like…?” and answers “Yes, I do!” / “No, I don't.”.",
      skill: "Answers “Do you like…?”" },
    w5d4: { parent: "Point at things: “What's this?”. Your child answers “It's a…”. One word is enough: say the full sentence back.",
      activity: "Mystery bag: hide a toy in a bag. Your child feels it without looking and guesses: “Is it a ball?”. You answer “Yes, it is!” or “No, it isn't!”. Then swap.",
      skill: "Answers “What's this?”: “It's a…”" },
    w5d5: { parent: "Show day! Your child introduces themselves to the family or the toys: name, age, what they can do, what they like.",
      activity: "Show: your child introduces themselves in 3 sentences: “My name is… I'm six. I can jump!”. The audience claps and asks a question: “Do you like ice cream?”.",
      skill: "Says 2 or 3 sentences about themselves" },
    w6d1: { parent: "Hide a toy in, on or under a piece of furniture. Ask “Where is Teddy?”. Your child looks and answers “In the box!”, “On the table!”, “Under the table!”.",
      activity: "Hide and seek with a cuddly toy: “Where is Teddy?”. Your child answers “In the box!”, “Under the bed!”. Then they hide it and you look.",
      skill: "Understands in / on / under" },
    w6d2: { parent: "Look out of the window together: “What's the weather?”. Say it every morning this week!",
      activity: "Morning weather report: your child presents the weather like on TV: “Good morning! It's sunny!”. Mime: sun (round arms), rain (falling fingers), cold (shivers).",
      skill: "Says what the weather is like" },
    w6d3: { parent: "When getting dressed, name the clothes in English: “Your coat! Your shoes!”. Your child points to or puts on the item.",
      activity: "Fashion show: your child dresses up in clothes that are too big and presents: “A hat! A coat! Shoes!”. The audience says “You look great!”.",
      skill: "Names 4 clothes" },
    w6d4: { parent: "Outside, name the places: “The park! The shop! School!”. When you leave: “Let's go!”.",
      activity: "English walk: point out “The park! The shop!” in your neighbourhood. At home, draw signs and play bus: “Next stop: the park!”.",
      skill: "Names 4 places: park, shop, school, home" },
    w6d5: { parent: "Show day! Set up a little course: a hat, a box, a table. Your child says where they go and what they wear.",
      activity: "Weather and fashion show: your child gives the weather, picks clothes (“It's cold! A coat, please!”) and says where they go (“Let's go to the park!”).",
      skill: "Says where something is (in / on / under)" },
    w7d1: { parent: "Show “big” with arms wide open and “small” with two fingers. Your child makes the gesture while saying the word.",
      activity: "Sort the toys: “Big or small?”. Your child puts big toys on one side and small ones on the other, saying “It's big!” or “It's small!”.",
      skill: "Says “big” and “small”" },
    w7d2: { parent: "Count to 10 on your fingers. Then count things at home: “How many spoons?”.",
      activity: "Count everything at home: stairs, shoes, spoons. “How many shoes?” Your child counts in English, then asks you.",
      skill: "Counts to 10 and answers “How many?”" },
    w7d3: { parent: "Review red, blue, yellow, green, then add pink, purple, black, white. Game: “Find something pink!”.",
      activity: "Painting: mix red and white to make pink. While your child paints, ask “What colour is it?”.",
      skill: "Names 8 colours" },
    w7d4: { parent: "Mime the animals: fly like a bird, swim like a fish, jump like a frog. Your child says the sentence while miming.",
      activity: "Riddle: mime an animal and say “I can fly! What am I?”. Your child guesses “A bird!”. Then swap.",
      skill: "Says what an animal can do" },
    w7d5: { parent: "Show day! Bring out the toy animals: your child is the zoo guide and describes each animal (big/small, colour, what it can do).",
      activity: "Home zoo: your child presents 3 toy animals: “This is a lion. It's big. It can run!”. The audience asks a question: “How many cats?”.",
      skill: "Describes an animal in 2 sentences" },
    w8d1: { parent: "At the table, your child asks in English: “Can I have water, please?”. Answer “Here you are!”, they say “Thank you!”, you say “You're welcome!”.",
      activity: "Shop game: set up a shop with real fruit. Your child buys: “Can I have an apple, please?” “Here you are!” “Thank you!” “You're welcome!”. Then they run the shop.",
      skill: "Asks politely: “Can I have…, please?”" },
    w8d2: { parent: "Ask “How are you?” a few times a day. Add “I'm hungry” before meals and “I'm thirsty” when they want a drink.",
      activity: "Feelings check: every evening, everyone says how they feel: “I'm happy!”, “I'm tired.”. Draw the faces on cards.",
      skill: "Says how they feel (hungry, thirsty, tired…)" },
    w8d3: { parent: "Play catch and say “My turn!” then “Your turn!” with each throw. These little phrases help at school with friends.",
      activity: "Simple board game (dice, cards): on every turn, say “My turn!” / “Your turn!”. Invite another family member: they ask “Can I play too?”.",
      skill: "Uses “Let's play!”, “My turn!”, “Your turn!”" },
    w8d4: { parent: "Tell the day with gestures: wake up, eat, go to school, go to bed. Use these sentences at the real moments of the day.",
      activity: "My day book: 4 drawings (alarm clock, breakfast, school, bed). Your child points to each drawing and says the sentence. In the evening, finish with “Goodnight!”.",
      skill: "Tells their day in 3 or 4 sentences" },
    w8d5: { parent: "Level 2 grand finale! Invite the family. Your child has a real little conversation with Fox, then with you. Film it if you want a keepsake (without posting it).",
      activity: "Big party: your child welcomes the guests in English (“Hello! Nice to meet you!”), serves food (“Here you are!”) and suggests a game (“Let's play!”).",
      skill: "Holds a short conversation of 4 turns" }
  });
})();
