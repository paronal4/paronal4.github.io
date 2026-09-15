// Symptom scoring weights
export const symptomWeights = {
  fever: 2,
  cough: 1,
  headache: 1,
  bodyPain: 1,
  fatigue: 1,
  nausea: 2,
  diarrhea: 2,
  rash: 1,
  breathingDifficulty: 3,
  chestPain: 3,
  soreThroat: 1,
  runnyNose: 1,
  abdominalPain: 2,
  dizziness: 2,
  lossOfAppetite: 1,
};

export const durationMultiplier = [1, 1.2, 1.5, 2]; // <1day, 1-3, 3-7, >1week
export const severityMultiplier = [1, 1.5, 2.5]; // mild, moderate, severe

export function calculateRiskScore(symptoms, durationIndex, severityIndex) {
  let baseScore = symptoms.reduce((sum, s) => sum + (symptomWeights[s] || 1), 0);
  const duration = durationMultiplier[durationIndex] || 1;
  const severity = severityMultiplier[severityIndex] || 1;
  const totalScore = baseScore * duration * severity;
  
  if (totalScore <= 4) return { level: 'mild', score: totalScore };
  if (totalScore <= 10) return { level: 'moderate', score: totalScore };
  return { level: 'severe', score: totalScore };
}

// Symptom-condition associations (educational only)
export const conditionHints = {
  en: {
    'fever+cough+bodyPain': ['Flu (Influenza)', 'Common cold'],
    'fever+headache+bodyPain': ['Malaria', 'Flu'],
    'fever+rash': ['Measles', 'Allergic reaction'],
    'cough+breathingDifficulty': ['Pneumonia', 'Asthma'],
    'diarrhea+nausea+abdominalPain': ['Food poisoning', 'Gastroenteritis'],
    'headache+dizziness+fatigue': ['Dehydration', 'Anemia'],
    'fever+diarrhea': ['Typhoid', 'Malaria'],
    'soreThroat+cough+runnyNose': ['Common cold', 'Tonsillitis'],
    'chestPain+breathingDifficulty': ['Seek immediate medical attention'],
    'fever+headache+nausea': ['Malaria', 'Meningitis — seek care quickly'],
  },
  am: {
    'fever+cough+bodyPain': ['ጉንፋን (ኢንፍሉዌንዛ)', 'ተራ ጉንፋን'],
    'fever+headache+bodyPain': ['ወባ', 'ጉንፋን'],
    'fever+rash': ['ኩፍኝ', 'አለርጂ ምላሽ'],
    'cough+breathingDifficulty': ['ሳንባ ምች', 'አስም'],
    'diarrhea+nausea+abdominalPain': ['የምግብ መመረዝ', 'የሆድ ቫይረስ'],
    'headache+dizziness+fatigue': ['ድርቀት', 'ደም ማነስ'],
    'fever+diarrhea': ['ታይፎይድ', 'ወባ'],
    'soreThroat+cough+runnyNose': ['ተራ ጉንፋን', 'ቶንሲላይቲስ'],
    'chestPain+breathingDifficulty': ['ወዲያውኑ ሕክምና ይፈልጉ'],
    'fever+headache+nausea': ['ወባ', 'ሜኒንጃይቲስ — በፍጥነት ሕክምና ይፈልጉ'],
  },
  om: {
    'fever+cough+bodyPain': ['Qufaa (Influenza)', 'Qufaa baratamaa'],
    'fever+headache+bodyPain': ['Busaa', 'Qufaa'],
    'fever+rash': ['Gifira', 'Deebii alarjii'],
    'cough+breathingDifficulty': ['Namooniyaa', 'Asmii'],
    'diarrhea+nausea+abdominalPain': ['Summii nyaataa', 'Dhukkuba garaa'],
    'headache+dizziness+fatigue': ['Goginsuu', 'Hanqina dhiigaa'],
    'fever+diarrhea': ['Taayifoyidii', 'Busaa'],
    'soreThroat+cough+runnyNose': ['Qufaa baratamaa', 'Dhukkuba toonsilii'],
    'chestPain+breathingDifficulty': ['Hatattamaan yaala barbaadaa'],
    'fever+headache+nausea': ['Busaa', 'Meeninjaaytisii — dafnee yaala barbaadaa'],
  },
};

export function getConditionHints(symptoms, lang) {
  const hints = conditionHints[lang] || conditionHints.en;
  const matched = [];
  const symptomSet = new Set(symptoms);
  
  for (const [combo, conditions] of Object.entries(hints)) {
    const required = combo.split('+');
    if (required.every(s => symptomSet.has(s))) {
      matched.push(...conditions);
    }
  }
  
  return [...new Set(matched)].slice(0, 4);
}

// Next steps based on risk level
export const nextSteps = {
  en: {
    mild: [
      "Rest and get plenty of sleep",
      "Drink clean water frequently",
      "Eat light, nutritious meals",
      "Monitor symptoms for 2-3 days",
      "If symptoms worsen, visit a health center",
    ],
    moderate: [
      "Visit a health center or clinic within 1-2 days",
      "Keep track of your symptoms and their changes",
      "Stay hydrated — drink oral rehydration salts if available",
      "Avoid strenuous activity",
      "Bring a family member with you to the clinic",
    ],
    severe: [
      "Go to the nearest hospital or health center immediately",
      "Do not delay — severe symptoms can worsen quickly",
      "If possible, have someone accompany you",
      "Bring any medications you are currently taking",
      "Stay calm and move carefully",
    ],
  },
  am: {
    mild: [
      "ያረፉ እና በቂ እንቅልፍ ያግኙ",
      "ንጹህ ውሃ በተደጋጋሚ ይጠጡ",
      "ቀላል፣ ገንቢ ምግብ ይብሉ",
      "ለ2-3 ቀናት ምልክቶችን ይከታተሉ",
      "ምልክቶች ከተባባሱ የጤና ማዕከል ይሂዱ",
    ],
    moderate: [
      "በ1-2 ቀናት ውስጥ የጤና ማዕከል ወይም ክሊኒክ ይጎብኙ",
      "ምልክቶችዎን እና ለውጦቻቸውን ይከታተሉ",
      "ውሃ ይጠጡ — ካለ ORS ይጠቀሙ",
      "ከባድ እንቅስቃሴ ያስወግዱ",
      "ወደ ክሊኒክ ሲሄዱ የቤተሰብ አባል ይዘው ይሂዱ",
    ],
    severe: [
      "ወዲያውኑ ወደ ቅርብ ሆስፒታል ወይም የጤና ማዕከል ይሂዱ",
      "አይዘግዩ — ከባድ ምልክቶች በፍጥነት ሊባባሱ ይችላሉ",
      "ከተቻለ አንድ ሰው ከእርስዎ ጋር ይዘው ይሂዱ",
      "አሁን የሚወስዷቸውን ማንኛውንም መድሃኒቶች ይዘው ይሂዱ",
      "ይረጋጉ እና በጥንቃቄ ይንቀሳቀሱ",
    ],
  },
  om: {
    mild: [
      "Boqodhaa hirribas ga'aa argadhaa",
      "Bishaan qulqulluu yeroo hedduu dhugaa",
      "Nyaata salphaa fi fayya qabeessa nyaadhaa",
      "Guyyaa 2-3f mallattoo hordofaa",
      "Mallattoon yoo hammaate gara buufata fayyaa deemaa",
    ],
    moderate: [
      "Guyyaa 1-2 keessatti buufata fayyaa ykn kilinikaa deemaa",
      "Mallattoo keessanii fi jijjiirama isaanii hordofaa",
      "Bishaan dhugaa — ORS yoo argame fayyadamaa",
      "Sochii cimaa irraa of eegaa",
      "Gara kilinikaa yeroo deemtan miseensa maatii waliin deemaa",
    ],
    severe: [
      "Hatattamaan gara hospitaala ykn buufata fayyaa dhiyootti deemaa",
      "Hin turiin — mallattoon cimaan dafnee hammaachuu danda'a",
      "Yoo danda'ame namni tokko isin waliin haa dhufu",
      "Qorichoota amma fudhataa jirtan fidaa",
      "Tasgabbaa'aa of eeggannoon socho'aa",
    ],
  },
};

// Education topics
export const educationTopics = {
  en: [
    {
      id: 'malaria',
      category: 'disease',
      title: 'Malaria',
      summary: 'A mosquito-borne disease common in Ethiopia. Learn about prevention and early signs.',
      content: `**What is Malaria?**\nMalaria is a disease caused by parasites spread through mosquito bites. It is one of the most common diseases in Ethiopia.\n\n**Symptoms:**\n- High fever and chills\n- Headache and body aches\n- Nausea and vomiting\n- Fatigue and weakness\n\n**Prevention:**\n- Sleep under insecticide-treated bed nets\n- Remove standing water near your home\n- Use mosquito repellent if available\n- Seek treatment early if you have fever\n\n**When to seek care:**\nIf you have fever that lasts more than 2 days, especially with headache and body aches, visit a health center for a malaria test.`,
    },
    {
      id: 'typhoid',
      category: 'disease',
      title: 'Typhoid Fever',
      summary: 'A bacterial infection spread through contaminated water and food.',
      content: `**What is Typhoid?**\nTyphoid is a bacterial infection common in areas with limited clean water access.\n\n**Symptoms:**\n- Prolonged fever (often rising over days)\n- Headache and body pain\n- Stomach pain and diarrhea or constipation\n- Loss of appetite\n\n**Prevention:**\n- Drink clean, boiled, or treated water\n- Wash hands before eating and after using the toilet\n- Eat well-cooked food\n- Get vaccinated if available\n\n**When to seek care:**\nIf you have fever lasting more than 3 days with stomach symptoms, see a doctor.`,
    },
    {
      id: 'diarrhea',
      category: 'disease',
      title: 'Diarrheal Diseases',
      summary: 'Common water-borne diseases that can be dangerous, especially for children.',
      content: `**About Diarrheal Diseases:**\nDiarrhea is very common in Ethiopia and can be caused by contaminated water, food, or poor hygiene.\n\n**Danger Signs:**\n- Diarrhea lasting more than 3 days\n- Blood in stool\n- Signs of dehydration (dry mouth, no tears, sunken eyes)\n- High fever with diarrhea\n\n**Treatment at Home:**\n- Give Oral Rehydration Salts (ORS) — mix with clean water\n- Continue breastfeeding for infants\n- Drink plenty of clean fluids\n- Eat light foods when possible\n\n**Prevention:**\n- Always wash hands with soap\n- Drink clean water\n- Keep food covered and cook thoroughly`,
    },
    {
      id: 'handwashing',
      category: 'prevention',
      title: 'Hand Washing',
      summary: 'One of the most effective ways to prevent disease spread.',
      content: `**Why Hand Washing Matters:**\nRegular hand washing with soap can prevent many diseases including diarrhea, pneumonia, and eye infections.\n\n**When to Wash Hands:**\n- Before eating or preparing food\n- After using the toilet\n- After handling animals\n- After coughing or sneezing\n- Before and after caring for a sick person\n\n**How to Wash Properly:**\n1. Wet hands with clean water\n2. Apply soap\n3. Rub all surfaces for 20 seconds\n4. Rinse with clean water\n5. Dry with a clean cloth or air dry\n\n**If no soap available:**\nUse ash and water as an alternative.`,
    },
    {
      id: 'burns',
      category: 'first_aid',
      title: 'Burns and Scalds',
      summary: 'Learn how to treat minor burns and when to seek medical help.',
      content: `**First Aid for Burns:**\n\n**For minor burns:**\n1. Cool the burn under clean running water for 10-20 minutes\n2. Do NOT use ice, butter, or toothpaste\n3. Cover with a clean, loose bandage\n4. Take pain relief if available\n\n**Seek immediate help if:**\n- The burn is larger than your palm\n- The burn is on the face, hands, feet, or joints\n- The skin looks white or charred\n- The person is a young child or elderly\n\n**Prevention:**\n- Keep hot liquids away from children\n- Turn pot handles away from edges\n- Be careful with open fires`,
    },
    {
      id: 'balanced_diet',
      category: 'nutrition',
      title: 'Balanced Diet Basics',
      summary: 'Understanding what makes a healthy meal from locally available foods.',
      content: `**Eating Well with Local Foods:**\n\n**A balanced meal should include:**\n- **Energy foods:** Injera, bread, potatoes, sweet potatoes\n- **Body-building foods:** Beans, lentils, eggs, meat, milk\n- **Protective foods:** Vegetables, fruits (papaya, banana, mango)\n\n**Important Tips:**\n- Eat a variety of foods each day\n- Include dark green vegetables when possible\n- Children need to eat 3-5 times a day\n- Pregnant women need extra food and iron-rich foods\n\n**Local Foods Rich in Iron:**\n- Dark green leaves (kale, spinach)\n- Lentils and beans\n- Meat and liver\n- Teff (naturally high in iron)`,
    },
  ],
  am: [
    {
      id: 'malaria',
      category: 'disease',
      title: 'ወባ',
      summary: 'በኢትዮጵያ የተለመደ በትንኝ የሚተላለፍ በሽታ። ስለ መከላከያ እና ቀደምት ምልክቶች ይማሩ።',
      content: `**ወባ ምንድን ነው?**\nወባ በትንኝ ንክሻ በሚተላለፉ ጥገኛ ተሕዋስያን የሚመጣ በሽታ ነው። በኢትዮጵያ ካሉት በጣም ተለመዱ በሽታዎች አንዱ ነው።\n\n**ምልክቶች:**\n- ከፍተኛ ትኩሳት እና ብርድ ብርድ ማለት\n- ራስ ምታት እና የሰውነት ህመም\n- ማቅለሽለሽ እና ማስመለስ\n- ድካም እና ድክመት\n\n**መከላከያ:**\n- በፀረ-ተባይ በተነከረ አጎበር ውስጥ ይተኙ\n- ከቤትዎ አቅራቢያ ያለውን ቆመ ውሃ ያስወግዱ\n- ካለ የትንኝ መከላከያ ቅባት ይጠቀሙ\n- ትኩሳት ካለዎት ቶሎ ሕክምና ይፈልጉ\n\n**መቼ ሕክምና መፈለግ አለብዎት:**\nከ2 ቀን በላይ ትኩሳት ካለዎት በተለይ ከራስ ምታት እና ከሰውነት ህመም ጋር ከሆነ ለወባ ምርመራ የጤና ማዕከል ይሂዱ።`,
    },
    {
      id: 'typhoid',
      category: 'disease',
      title: 'ታይፎይድ ትኩሳት',
      summary: 'በተበከለ ውሃ እና ምግብ የሚተላለፍ ባክቴሪያዊ ኢንፌክሽን።',
      content: `**ታይፎይድ ምንድን ነው?**\nታይፎይድ ንጹህ ውሃ ተደራሽነት በሌላቸው አካባቢዎች ተለምዶ ባክቴሪያዊ ኢንፌክሽን ነው።\n\n**ምልክቶች:**\n- ለረጅም ጊዜ ትኩሳት\n- ራስ ምታት እና የሰውነት ህመም\n- የሆድ ህመም እና ተቅማጥ ወይም ሽታ\n- የምግብ ፍላጎት ማጣት\n\n**መከላከያ:**\n- ንጹህ፣ የፈላ ወይም የተጣራ ውሃ ይጠጡ\n- ከመብላት በፊት እና ሽንት ቤት ከሄዱ በኋላ እጅዎን ይታጠቡ\n- በደንብ የበሰለ ምግብ ይብሉ\n\n**መቼ ሕክምና መፈለግ:**\nከ3 ቀን በላይ ትኩሳት ካለዎት ከሆድ ምልክቶች ጋር ሐኪም ያማክሩ።`,
    },
    {
      id: 'handwashing',
      category: 'prevention',
      title: 'እጅ መታጠብ',
      summary: 'የበሽታ ስርጭትን ለመከላከል ከሚቻሉ በጣም ውጤታማ መንገዶች አንዱ።',
      content: `**እጅ መታጠብ ለምን አስፈላጊ ነው:**\nበሳሙና መደበኛ እጅ መታጠብ ተቅማጥ፣ ሳንባ ምች እና የዓይን ኢንፌክሽን ጨምሮ ብዙ በሽታዎችን ይከላከላል።\n\n**መቼ እጅ መታጠብ አለብዎት:**\n- ምግብ ከመብላት ወይም ከማዘጋጀት በፊት\n- ሽንት ቤት ከሄዱ በኋላ\n- እንስሳትን ከያዙ በኋላ\n- ከሳሉ ወይም ከማስነጠሱ በኋላ\n\n**እንዴት በትክክል መታጠብ:**\n1. እጆችን በንጹህ ውሃ ያርሱ\n2. ሳሙና ይጠቀሙ\n3. ለ20 ሰከንድ ሁሉንም ክፍሎች ያሻሹ\n4. በንጹህ ውሃ ያጠቡ\n5. በንጹህ ጨርቅ ያድርቁ\n\n**ሳሙና ከሌለ:**\nአመድ እና ውሃ እንደ አማራጭ ይጠቀሙ።`,
    },
    {
      id: 'balanced_diet',
      category: 'nutrition',
      title: 'ሚዛናዊ ምግብ መሰረታዊ ነገሮች',
      summary: 'ከአካባቢው ምግቦች ጤናማ ምግብ ምን እንደሚያካትት መረዳት።',
      content: `**በአካባቢ ምግቦች ጥሩ መብላት:**\n\n**ሚዛናዊ ምግብ ማካተት ያለብዎት:**\n- **ኃይል ሰጪ ምግቦች:** እንጀራ፣ ዳቦ፣ ድንች\n- **ሰውነት ገንቢ ምግቦች:** ባቄላ፣ ምስር፣ እንቁላል፣ ስጋ፣ ወተት\n- **የሰውነት ጠባቂ ምግቦች:** አትክልት፣ ፍራፍሬ (ፓፓያ፣ ሙዝ፣ ማንጎ)\n\n**አስፈላጊ ምክሮች:**\n- በየቀኑ የተለያዩ ምግቦችን ይብሉ\n- ጥቁር አረንጓዴ አትክልቶችን ያካትቱ\n- ልጆች በቀን 3-5 ጊዜ መብላት ያስፈልጋቸዋል\n- ነፍሰ ጡር ሴቶች ተጨማሪ ምግብ እና ብረት ያላቸው ምግቦች ያስፈልጋቸዋል\n\n**ብረት የበዛባቸው የአካባቢ ምግቦች:**\n- ጥቁር አረንጓዴ ቅጠላ ቅጠሎች\n- ምስር እና ባቄላ\n- ስጋ\n- ጤፍ (በተፈጥሮ ከፍተኛ ብረት ያለው)`,
    },
  ],
  om: [
    {
      id: 'malaria',
      category: 'disease',
      title: 'Busaa',
      summary: 'Dhukkuba bookeen daddarbamu kan Itoophiyaatti baay\'ee beekamu. Waa\'ee ittisaa fi mallattoo jalqabaa baradhaa.',
      content: `**Busaan Maali?**\nBusaan dhukkuba paraasayitii bookeen ciniinsamuun daddarbuudha. Itoophiyaatti dhukkuboota baay'ee beekamoo keessaa tokko.\n\n**Mallattoo:**\n- Ho'a cimaa fi qorraa\n- Mataa bowwuu fi dhukkubbii qaamaa\n- Oldeebisuu fi lolaa\n- Dadhabuu fi laafina\n\n**Ittisa:**\n- Saaphana qorichaan dibame jala ciisaa\n- Bishaan dhaabbate mana keessan biraa balleessaa\n- Dibata ittisa bookee yoo argame fayyadamaa\n- Ho'a yoo qabaattan dafnee yaala barbaadaa\n\n**Yeroo yaala barbaaddan:**\nHo'a guyyaa 2 ol turuu yoo qabaattan keessumaa mataa bowwuu fi dhukkubbii qaamaa waliin yoo ta'e gara buufata fayyaatti qorannoo busaaf deemaa.`,
    },
    {
      id: 'typhoid',
      category: 'disease',
      title: 'Ho\'a Taayifoyidii',
      summary: 'Dhukkuba baakteeriyaa bishaan fi nyaata faalameen daddarbamu.',
      content: `**Taayifoyidiin Maali?**\nTaayifoyidiin dhukkuba baakteeriyaa naannoo bishaan qulqulluu hin qabne keessatti baay'atu.\n\n**Mallattoo:**\n- Ho'a yeroo dheeraa\n- Mataa bowwuu fi dhukkubbii qaamaa\n- Dhukkubbii garaa fi garaa kaasaa\n- Fedhii nyaataa dhabuu\n\n**Ittisa:**\n- Bishaan qulqulluu, danfifame ykn qulqulleeffame dhugaa\n- Nyaata dura fi mana fincaanii booda harka dhiqadhaa\n- Nyaata gaariitti bilcheeffame nyaadhaa\n\n**Yeroo yaala barbaaddan:**\nHo'a guyyaa 3 ol turuu mallattoo garaatiin yoo qabaattan ogeessa fayyaa mariisisaa.`,
    },
    {
      id: 'handwashing',
      category: 'prevention',
      title: 'Harka Dhiqachuu',
      summary: 'Dhukkuba tatamsaa\'ina ittisuu keessatti karaalee bu\'a qabeessa ta\'an keessaa tokko.',
      content: `**Harka Dhiqachuun Maaliif Barbaachisaa:**\nSaamunaan harka dhiqachuun dhukkuboota heddu kan akka garaa kaasaa, namooniyaa fi dhukkuba ijaa ni ittisa.\n\n**Yeroo Harka Dhiqachuu Qabdan:**\n- Nyaata nyaachuu ykn qopheessuu dura\n- Mana fincaanii booda\n- Bineensota qabachuu booda\n- Qufa'uu ykn haxxiffachuu booda\n\n**Akkaataa Sirriitti Dhiqachuu:**\n1. Harka bishaan qulqulluun jiisaa\n2. Saamunaa fayyadamaa\n3. Sekoondii 20f dirra hunda sukkuumaa\n4. Bishaan qulqulluun lolaa'aa\n5. Huccuu qulqulluun gogsiaa\n\n**Saamunaan yoo hin jiraanne:**\nDaakuu fi bishaan akka filannoo fayyadamaa.`,
    },
    {
      id: 'balanced_diet',
      category: 'nutrition',
      title: 'Bu\'uuraalee Nyaata Madaalamaa',
      summary: 'Nyaata naannoo irraa argamuun nyaata fayyaa qabeessa maal akka ta\'e hubachuu.',
      content: `**Nyaata Naannoo Irraan Gaariitti Nyaachuu:**\n\n**Nyaanni madaalamaan qabaachuu qaba:**\n- **Nyaata humna kennu:** Injeeraa, buddeena, dinnicha\n- **Nyaata qaama ijaaru:** Baaqelaa, misira, hanqaaquu, foon, aannan\n- **Nyaata qaama eegu:** Kuduraa, fuduraa (paappayyaa, muuzii, maangoo)\n\n**Gorsaawwan Barbaachisoo:**\n- Guyyaa guyyaatti nyaata garaa garaa nyaadhaa\n- Kuduraa magariisa gurraacha yoo danda'ame dabalaa\n- Daa'imman guyyaatti si'a 3-5 nyaachuu qabu\n- Dubartoonni ulfaa nyaata dabalataa fi nyaata sibiilaa of keessaa qabu barbaadu\n\n**Nyaata Naannoo Sibiilaa Baay'ee Qabu:**\n- Baala magariisa gurraacha\n- Misira fi baaqelaa\n- Foon\n- Xaafii (uumamaan sibiilaa olaanaa kan qabu)`,
    },
  ],
};

// Community guide content
export const communityGuideContent = {
  en: {
    pregnancy: {
      title: 'Pregnancy Basics',
      content: `**Important Things to Know During Pregnancy:**\n\n**Regular Check-ups:**\n- Visit a health center at least 4 times during pregnancy\n- First visit should be in the first 3 months\n\n**Nutrition:**\n- Eat more food than usual — you're feeding two\n- Include iron-rich foods (meat, lentils, dark greens, teff)\n- Take iron and folic acid supplements if given\n\n**Danger Signs — Go to Health Center Immediately:**\n- Heavy bleeding\n- Severe headache with blurred vision\n- High fever\n- Swelling of face and hands\n- Baby stops moving\n\n**Delivery:**\n- Plan to deliver at a health facility\n- Prepare a birth plan with your family\n- Keep emergency transport ready`,
    },
    hydration: {
      title: 'Hydration & Water Safety',
      content: `**Staying Hydrated:**\n\n**How Much Water:**\n- Adults: at least 6-8 cups per day\n- More in hot weather or when working hard\n- Children need water regularly throughout the day\n\n**Signs of Dehydration:**\n- Dark yellow urine\n- Dry mouth and lips\n- Dizziness or headache\n- Tiredness\n- In children: no tears when crying, sunken eyes\n\n**Making Water Safe:**\n- Boil water for at least 1 minute\n- Let it cool in a clean, covered container\n- If you can't boil, use water treatment drops\n- Store water in clean containers with lids\n\n**Oral Rehydration Salts (ORS):**\n- Mix one packet with 1 liter of clean water\n- Give small sips frequently\n- Very important for children with diarrhea`,
    },
    firstAid: {
      title: 'Basic First Aid',
      content: `**Essential First Aid Knowledge:**\n\n**For Cuts and Wounds:**\n1. Wash hands first\n2. Clean the wound with clean water\n3. Apply pressure with clean cloth to stop bleeding\n4. Cover with clean bandage\n5. See a doctor if wound is deep or dirty\n\n**For Choking:**\n1. Encourage coughing\n2. Give 5 firm back blows between shoulder blades\n3. If still choking, call for help immediately\n\n**For Snake Bites:**\n1. Keep the person calm and still\n2. Remove jewelry near the bite\n3. Do NOT cut the wound or try to suck venom\n4. Get to a hospital as fast as possible\n\n**For Fainting:**\n1. Lay the person down\n2. Raise their legs\n3. Loosen tight clothing\n4. If they don't wake up in 1 minute, get help`,
    },
    nutrition: {
      title: 'Nutrition Guide',
      content: `**Nutrition for the Whole Family:**\n\n**For Babies (0-6 months):**\n- Only breastmilk — no water, no other food\n- Breastfeed on demand, at least 8 times a day\n\n**For Babies (6-24 months):**\n- Continue breastfeeding\n- Start soft foods at 6 months\n- Gradually increase variety and amount\n\n**For Children:**\n- 3 meals + 2 snacks per day\n- Include protein (eggs, beans) every day\n- Give fruits and vegetables\n\n**For Pregnant Women:**\n- Eat one extra meal per day\n- Focus on iron-rich foods\n- Avoid raw meat and unpasteurized milk\n\n**General Tips:**\n- Wash all fruits and vegetables\n- Cook meat thoroughly\n- Don't skip meals\n- Variety is key — eat different foods each day`,
    },
  },
  am: {
    pregnancy: {
      title: 'የእርግዝና መሰረታዊ ነገሮች',
      content: `**በእርግዝና ወቅት ማወቅ ያለብዎት ነገሮች:**\n\n**መደበኛ ምርመራ:**\n- በእርግዝና ወቅት ቢያንስ 4 ጊዜ የጤና ማዕከል ይጎብኙ\n- የመጀመሪያ ጉብኝት በመጀመሪያዎቹ 3 ወራት ውስጥ መሆን አለበት\n\n**ስነ-ምግብ:**\n- ከተለመደው የበለጠ ይብሉ — ሁለት ሰው እየመገቡ ነው\n- ብረት ያላቸው ምግቦች ያካትቱ (ስጋ፣ ምስር፣ ጥቁር አረንጓዴ፣ ጤፍ)\n\n**የአደጋ ምልክቶች — ወዲያውኑ የጤና ማዕከል ይሂዱ:**\n- ከባድ ደም መፍሰስ\n- ከበድ ያለ ራስ ምታት\n- ከፍተኛ ትኩሳት\n- የፊት እና የእጅ ማበጥ\n- ሕፃኑ መንቀሳቀስ ማቆም`,
    },
    hydration: {
      title: 'ውሃ ጥቅም እና ደህንነት',
      content: `**ውሃ መጠጣት:**\n\n**ምን ያህል ውሃ:**\n- ጎልማሶች: በቀን ቢያንስ 6-8 ብርጭቆ\n- ሞቃታማ የአየር ሁኔታ ወይም ከባድ ሥራ ሲሠሩ ተጨማሪ\n\n**የድርቀት ምልክቶች:**\n- ጥቁር ቢጫ ሽንት\n- ደረቅ አፍ እና ከንፈር\n- ማዞር ወይም ራስ ምታት\n- ድካም\n\n**ውሃ ደህንና ማድረግ:**\n- ውሃ ቢያንስ ለ1 ደቂቃ ያፍሉ\n- በንጹህ ክዳን ባለው ዕቃ ውስጥ ያቀዝቁ\n\n**ORS:**\n- አንድ ፓኬት ከ1 ሊትር ንጹህ ውሃ ጋር ይቀላቅሉ\n- በተደጋጋሚ ትንሽ ትንሽ ይስጡ\n- ተቅማጥ ላለባቸው ልጆች በጣም አስፈላጊ`,
    },
    firstAid: {
      title: 'መሰረታዊ የመጀመሪያ ደረጃ ሕክምና',
      content: `**አስፈላጊ የመጀመሪያ ደረጃ ሕክምና ዕውቀት:**\n\n**ለቁስል:**\n1. መጀመሪያ እጅ ይታጠቡ\n2. ቁስሉን በንጹህ ውሃ ያጠቡ\n3. ደም ለማቆም በንጹህ ጨርቅ ግፊት ይስጡ\n4. በንጹህ ጨርቅ ይሸፍኑ\n5. ቁስሉ ጥልቅ ከሆነ ሐኪም ያማክሩ\n\n**ለእባብ ንክሻ:**\n1. ሰውየው ተረጋግቶ ቢቆም\n2. ቁስሉን አይቁረጡ መርዝ ለመምጠጥ አይሞክሩ\n3. በተቻለ ፍጥነት ሆስፒታል ይሂዱ`,
    },
    nutrition: {
      title: 'የስነ-ምግብ መመሪያ',
      content: `**ለመላው ቤተሰብ ስነ-ምግብ:**\n\n**ለሕፃናት (0-6 ወር):**\n- የእናት ጡት ወተት ብቻ — ውሃም ሌላ ምግብም አይስጡ\n- በፍላጎት ያጥቡ፣ በቀን ቢያንስ 8 ጊዜ\n\n**ለሕፃናት (6-24 ወር):**\n- ጡት ማጥባት ይቀጥሉ\n- በ6 ወር ለስላሳ ምግቦች ይጀምሩ\n\n**ለልጆች:**\n- በቀን 3 ምግብ + 2 መክሰስ\n- በየቀኑ ፕሮቲን ያካትቱ (እንቁላል፣ ባቄላ)\n\n**ለነፍሰ ጡር ሴቶች:**\n- በቀን አንድ ተጨማሪ ምግብ ይብሉ\n- ብረት ያላቸው ምግቦች ላይ ያተኩሩ`,
    },
  },
  om: {
    pregnancy: {
      title: 'Bu\'uuraalee Ulfaa',
      content: `**Yeroo Ulfaa Wantoota Beekuu Qabdan:**\n\n**Iilaalachaa Idilee:**\n- Yeroo ulfaa keessatti yoo xiqqaate si'a 4 buufata fayyaa daawwadhaa\n- Daawwannaan jalqabaa ji'oota 3 jalqabaa keessa ta'uu qaba\n\n**Nyaata:**\n- Kan durii caalaa nyaadhaa — nama lama nyaachisaa jirtu\n- Nyaata sibiilaa qabu dabalaa (foon, misira, magariisa gurraacha, xaafii)\n\n**Mallattoo Balaa — Hatattamaan Buufata Fayyaa Deemaa:**\n- Dhiiguu cimaa\n- Mataa bowwuu cimaa\n- Ho'a olaanaa\n- Fuula fi harka dhituu\n- Daa'imni socho'uu dhaabuu`,
    },
    hydration: {
      title: 'Bishaan Dhugaatii fi Nageenyummaa',
      content: `**Bishaan Ga'aa Dhuguu:**\n\n**Bishaan Hangamii:**\n- Ga'eessota: guyyaatti yoo xiqqaate sinii 6-8\n- Qilleensi ho'aa yeroo ta'u ykn hojii cimaa yeroo hojjettan dabalataa\n\n**Mallattoo Goginsuu:**\n- Fincaan keelloo gurraacha\n- Afaan fi hidhii gogaa\n- Mataa naannessuu ykn mataa bowwuu\n\n**Bishaan Nageenya Godhuu:**\n- Bishaan yoo xiqqaate daqiiqaa 1f danfisaa\n- Meeshaa qulqulluu cufamaa keessa qabbaneessaa\n\n**ORS:**\n- Paakeetii tokko bishaan qulqulluu liitira 1 waliin walitti makaa\n- Yeroo hedduu xiqqoo xiqqoo kennaa\n- Daa'imman garaa kaasaa qabaniif baay'ee barbaachisaa`,
    },
    firstAid: {
      title: 'Gargaarsa Jalqabaa Bu\'uuraa',
      content: `**Beekumsa Gargaarsa Jalqabaa Barbaachisaa:**\n\n**Madaa fi Miidhaadhaf:**\n1. Dursa harka dhiqadhaa\n2. Madaa bishaan qulqulluun dhiqaa\n3. Dhiiguu dhaabuuf huccuu qulqulluun dhiibaa\n4. Huccuu qulqulluun haguugaa\n5. Madaan gadi fagoo yoo ta'e ogeessa fayyaa ilaalaa\n\n**Bofni Yoo Ciniine:**\n1. Namni sun tasgabbaa'ee akka dhaabbatu godhi\n2. Madaa hin muriin summii xuuxuuf hin yaaliinaa\n3. Danda'amu dafnee gara hospitaalaa deemaa`,
    },
    nutrition: {
      title: 'Qajeelcha Nyaataa',
      content: `**Nyaata Maatii Guutuuf:**\n\n**Daa'imman (Ji'a 0-6):**\n- Harma haadha qofa — bishaanis nyaata biroos hin kenniniinaa\n- Fedhiin hoosisaa, guyyaatti yoo xiqqaate si'a 8\n\n**Daa'imman (Ji'a 6-24):**\n- Hoosisuu itti fufaa\n- Ji'a 6tti nyaata lallaafaa jalqabaa\n\n**Ijoollee:**\n- Guyyaatti nyaata 3 + nyaata salphaa 2\n- Guyyaa guyyaatti pirootiinii dabalaa (hanqaaquu, baaqelaa)\n\n**Dubartoota Ulfaa:**\n- Guyyaatti nyaata dabalataa tokko nyaadhaa\n- Nyaata sibiilaa qabu irratti xiyyeeffadhaa`,
    },
  },
};
