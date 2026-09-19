export type SupportedLanguage = 'en' | 'es' | 'hi' | 'raj' | 'bn' | 'ta';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  category: 'regional' | 'international';
  regionLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  // 4 Regional Indian Languages
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    category: 'regional',
    regionLabel: 'India / Rajasthan',
  },
  {
    code: 'raj',
    name: 'Rajasthani (Jaipur / Marwar)',
    nativeName: 'राजस्थानी',
    flag: '🐪',
    category: 'regional',
    regionLabel: 'Jaipur & Rajasthan Regional',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🐯',
    category: 'regional',
    regionLabel: 'Eastern India Regional',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🦚',
    category: 'regional',
    regionLabel: 'Southern India Regional',
  },

  // 2 International Languages
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (US / Global)',
    flag: '🌐',
    category: 'international',
    regionLabel: 'Global Lingua Franca',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    category: 'international',
    regionLabel: 'International Spanish',
  },
];

export interface TranslationDictionary {
  appName: string;
  gradeBadge: string;
  scannerTab: string;
  biodexTab: string;
  mapTab: string;
  predictTab: string;
  chatTab: string;
  reportsTab: string;
  pvaShort: string;
  pvaFull: string;
  pvaExplain6thGrade: string;
  fruitsAndVeggies: string;
  allCategories: string;
  plants: string;
  animals: string;
  insects: string;
  reptiles: string;
  leastConcern: string;
  leastConcernSimple: string;
  vulnerable: string;
  vulnerableSimple: string;
  endangered: string;
  endangeredSimple: string;
  criticallyEndangered: string;
  criticallyEndangeredSimple: string;
  scanSpecimenBtn: string;
  takePhotoBtn: string;
  uploadImageBtn: string;
  testSamplesTitle: string;
  grapeSample: string;
  strawberrySample: string;
  tomatoSample: string;
  appleSample: string;
  bananaSample: string;
  sunflowerSample: string;
  lilySample: string;
  monarchSample: string;
  peacockSample: string;
  turtleSample: string;
  simulatePvaBtn: string;
  quickQuestions: string;
  askPlaceholder: string;
  lensOverview: string;
  identifiedSpecies: string;
  confidence: string;
  habitat: string;
  funFact: string;
  lookalikes: string;
  switchSpecimen: string;
  currentCount: string;
  recoveryTarget: string;
  loginRequiredToSave: string;
  signInToSave: string;
  jaipurIndiaHabitats: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'BioDex Lens',
    gradeBadge: '6th Grade Science Edition',
    scannerTab: 'SCANNER',
    biodexTab: 'BIODEX',
    mapTab: 'MAPS',
    predictTab: 'PREDICT (PVA)',
    chatTab: 'AI CHAT',
    reportsTab: 'REPORTS',
    pvaShort: 'PVA',
    pvaFull: 'Population Viability Analysis (PVA)',
    pvaExplain6thGrade:
      'PVA stands for Population Viability Analysis. Think of it as a "Future Survival Forecast" that uses math to predict whether animal, plant, fruit, or crop populations will grow or shrink in the coming years!',
    fruitsAndVeggies: 'Fruits & Veggies',
    allCategories: 'All Species',
    plants: 'Plants & Flora',
    animals: 'Animals & Fauna',
    insects: 'Insects',
    reptiles: 'Reptiles',
    leastConcern: 'Least Concern',
    leastConcernSimple: 'Safe & Thriving (Least Concern)',
    vulnerable: 'Vulnerable',
    vulnerableSimple: 'At Risk / Needs Help (Vulnerable)',
    endangered: 'Endangered',
    endangeredSimple: 'In Danger of Disappearing (Endangered)',
    criticallyEndangered: 'Critically Endangered',
    criticallyEndangeredSimple: 'Immediate Danger / High Alert (Critically Endangered)',
    scanSpecimenBtn: 'Scan New Specimen',
    takePhotoBtn: 'Take Live Photo',
    uploadImageBtn: 'Upload Photo / Image',
    testSamplesTitle: 'Click Any Sample to Test Instantly:',
    grapeSample: 'Purple Grapes',
    strawberrySample: 'Garden Strawberry',
    tomatoSample: 'Red Vine Tomato',
    appleSample: 'Red Apple',
    bananaSample: 'Ripe Banana',
    sunflowerSample: 'Tall Sunflower',
    lilySample: 'Stargazer Lily',
    monarchSample: 'Monarch Butterfly',
    peacockSample: 'Indian Peafowl (Jaipur)',
    turtleSample: "Blanding's Turtle",
    simulatePvaBtn: 'Simulate Future Survival (PVA)',
    quickQuestions: 'Quick Questions for 6th Graders:',
    askPlaceholder: 'Ask anything about plants, fruits, vegetables, animals, or habitats...',
    lensOverview: 'Google Lens Overview',
    identifiedSpecies: 'Identified Living Specimen',
    confidence: 'Match Certainty',
    habitat: 'Natural Home / Habitat',
    funFact: 'Did You Know? (Fun Science Fact)',
    lookalikes: 'Similar Lookalikes',
    switchSpecimen: 'Switch Specimen:',
    currentCount: 'Current Estimated Population',
    recoveryTarget: 'Safe Recovery Target',
    loginRequiredToSave: 'Login Required to Save Species',
    signInToSave: 'Please sign in with Google to save this species observation to your personal BioDex!',
    jaipurIndiaHabitats: 'Jaipur & India Habitats',
  },
  es: {
    appName: 'BioDex Lens',
    gradeBadge: 'Edición Escolar 6° Grado',
    scannerTab: 'ESCÁNER',
    biodexTab: 'BIODEX',
    mapTab: 'MAPAS',
    predictTab: 'PREDICCIÓN (PVA)',
    chatTab: 'CHAT IA',
    reportsTab: 'INFORMES',
    pvaShort: 'PVA',
    pvaFull: 'Análisis de Viabilidad Poblacional (PVA)',
    pvaExplain6thGrade:
      'PVA significa Análisis de Viabilidad Poblacional. ¡Es un "Pronóstico del Futuro" que usa matemáticas para saber si las plantas, animales o cultivos crecerán o desaparecerán en los próximos años!',
    fruitsAndVeggies: 'Frutas y Verduras',
    allCategories: 'Todas las Especies',
    plants: 'Plantas y Flores',
    animals: 'Animales',
    insects: 'Insectos',
    reptiles: 'Reptiles',
    leastConcern: 'Preocupación Menor',
    leastConcernSimple: 'Seguro y Próspero (Preocupación Menor)',
    vulnerable: 'Vulnerable',
    vulnerableSimple: 'En Riesgo / Necesita Ayuda (Vulnerable)',
    endangered: 'En Peligro',
    endangeredSimple: 'En Peligro de Desaparecer (En Peligro)',
    criticallyEndangered: 'Peligro Crítico',
    criticallyEndangeredSimple: 'Peligro Inmediato (Peligro Crítico)',
    scanSpecimenBtn: 'Escanear Nuevo Espécimen',
    takePhotoBtn: 'Tomar Foto en Vivo',
    uploadImageBtn: 'Subir Foto / Imagen',
    testSamplesTitle: 'Haz clic en una muestra para probar:',
    grapeSample: 'Uvas Moradas',
    strawberrySample: 'Fresa de Huerta',
    tomatoSample: 'Tomate Rojo',
    appleSample: 'Manzana Roja',
    bananaSample: 'Plátano / Banana',
    sunflowerSample: 'Girasol Gigante',
    lilySample: 'Lirio Stargazer',
    monarchSample: 'Mariposa Monarca',
    peacockSample: 'Pavo Real de la India (Jaipur)',
    turtleSample: 'Tortuga de Blanding',
    simulatePvaBtn: 'Simular Supervivencia Futura (PVA)',
    quickQuestions: 'Preguntas Rápidas de Ciencias:',
    askPlaceholder: 'Pregunta sobre plantas, frutas, verduras, animales o hábitats...',
    lensOverview: 'Resumen de Google Lens',
    identifiedSpecies: 'Especie Identificada',
    confidence: 'Certeza de Coincidencia',
    habitat: 'Hogar Natural / Hábitat',
    funFact: '¿Sabías qué? (Dato Curioso)',
    lookalikes: 'Especies Parecidas',
    switchSpecimen: 'Cambiar Espécimen:',
    currentCount: 'Población Actual Estimada',
    recoveryTarget: 'Meta de Recuperación Segura',
    loginRequiredToSave: 'Iniciar Sesión para Guardar',
    signInToSave: '¡Por favor inicia sesión con Google para guardar esta especie en tu BioDex personal!',
    jaipurIndiaHabitats: 'Hábitats de Jaipur e India',
  },
  hi: {
    appName: 'बायोडेक्स लेंस (BioDex)',
    gradeBadge: 'कक्षा 6 विज्ञान संस्करण',
    scannerTab: 'स्कैनर',
    biodexTab: 'बायोडेक्स',
    mapTab: 'मानचित्र',
    predictTab: 'पूर्वानुमान (PVA)',
    chatTab: 'एआई चैट',
    reportsTab: 'रिपोर्ट',
    pvaShort: 'PVA',
    pvaFull: 'जनसंख्या व्यवहार्यता विश्लेषण (PVA)',
    pvaExplain6thGrade:
      'PVA का मतलब है जनसंख्या व्यवहार्यता विश्लेषण। यह गणित का एक उपकरण है जो बच्चों और वैज्ञानिकों को यह जानने में मदद करता है कि आने वाले वर्षों में पौधे, फल या जानवर जीवित रहेंगे या गायब हो जाएंगे!',
    fruitsAndVeggies: 'फल और सब्जियां',
    allCategories: 'सभी प्रजातियां',
    plants: 'पेड़-पौधे व फूल',
    animals: 'पशु-पक्षी',
    insects: 'कीट-पतंगे',
    reptiles: 'सरीसृप',
    leastConcern: 'कम चिंताजनक',
    leastConcernSimple: 'सुरक्षित व स्वस्थ (कम चिंता)',
    vulnerable: 'संवेदनशील',
    vulnerableSimple: 'जोखिम में / मदद की जरूरत',
    endangered: 'संकटग्रस्त',
    endangeredSimple: 'विलुप्त होने के कगार पर (संकटग्रस्त)',
    criticallyEndangered: 'गंभीर रूप से संकटग्रस्त',
    criticallyEndangeredSimple: 'अत्यंत गंभीर संकट में',
    scanSpecimenBtn: 'नया नमूना स्कैन करें',
    takePhotoBtn: 'फोटो खींचें',
    uploadImageBtn: 'तस्वीर अपलोड करें',
    testSamplesTitle: 'तुरंत जांचने के लिए नमूने पर क्लिक करें:',
    grapeSample: 'अंगूर (Grapes)',
    strawberrySample: 'स्ट्रॉबेरी (Strawberry)',
    tomatoSample: 'लाल टमाटर (Tomato)',
    appleSample: 'सेब (Apple)',
    bananaSample: 'केला (Banana)',
    sunflowerSample: 'सूरजमुखी',
    lilySample: 'लिली का फूल',
    monarchSample: 'मोनार्क तितली',
    peacockSample: 'भारतीय मोर (जयपुर)',
    turtleSample: 'कछुआ',
    simulatePvaBtn: 'भविष्य का पूर्वानुमान देखें (PVA)',
    quickQuestions: 'कक्षा 6 के लिए त्वरित प्रश्न:',
    askPlaceholder: 'फलों, सब्जियों, पौधों, जानवरों के बारे में कुछ भी पूछें...',
    lensOverview: 'गूगल लेंस अवलोकन',
    identifiedSpecies: 'पहचानी गई प्रजाति',
    confidence: 'सटीकता प्रतिशत',
    habitat: 'प्राकृतिक आवास',
    funFact: 'क्या आप जानते हैं? (मजेदार तथ्य)',
    lookalikes: 'मिलती-जुलती प्रजातियां',
    switchSpecimen: 'नमूना बदलें:',
    currentCount: 'वर्तमान अनुमानित संख्या',
    recoveryTarget: 'सुरक्षित लक्ष्य संख्या',
    loginRequiredToSave: 'प्रजाति सहेजने के लिए लॉगिन आवश्यक है',
    signInToSave: 'कृपया अपने व्यक्तिगत बायोडेक्स में इस प्रजाति को सहेजने के लिए Google से लॉगिन करें!',
    jaipurIndiaHabitats: 'जयपुर और भारत के आवास',
  },
  raj: {
    appName: 'बायोडेक्स लेंस (राजस्थान)',
    gradeBadge: 'कक्षा 6 विज्ञान संस्करण (जयपुर)',
    scannerTab: 'स्कैनर',
    biodexTab: 'बायोडेक्स पोथी',
    mapTab: 'नक्सो (आवास)',
    predictTab: 'भविष्य बांच (PVA)',
    chatTab: 'एआई सलाहकार',
    reportsTab: 'पर्चा / रिपोर्ट',
    pvaShort: 'PVA',
    pvaFull: 'जनसंख्या जीवटता विश्लेषण (PVA)',
    pvaExplain6thGrade:
      'PVA रो मतलब है जनसंख्या जीवटता विश्लेषण। ईं सूं गणित री मदद सूं ओ पतो लागे है कि आंगणे रा पेड़-पौधा, फल अर जीव-जन्तु आवण वाले समे में बढ़सी या कम हो जासी!',
    fruitsAndVeggies: 'फल अर तरकारी',
    allCategories: 'सगळी प्रजातियां',
    plants: 'रूख-डाळी अर फूल',
    animals: 'पशु-पखेरू (जीव)',
    insects: 'कीड़ा-मकौड़ा',
    reptiles: 'रेंगने वाला जीव',
    leastConcern: 'बेफिक्र (घणा है)',
    leastConcernSimple: 'राजी-खुशी अर घणा (सुरक्षित)',
    vulnerable: 'जोखिम में (मदद चावे)',
    vulnerableSimple: 'मुसीबत में / सार-संभाल चावे',
    endangered: 'संकट में',
    endangeredSimple: 'खतम होण रो डर (संकटग्रस्त)',
    criticallyEndangered: 'घणो भारी संकट',
    criticallyEndangeredSimple: 'तुरन्त बचावण री जरूरत',
    scanSpecimenBtn: 'नयो नमूणो स्कैन करो',
    takePhotoBtn: 'कैमरे सूं फोटो खींचो',
    uploadImageBtn: 'फोटो चढ़ाओ (अपलोड)',
    testSamplesTitle: 'सीधो जांचबा खातर क्लिक करो:',
    grapeSample: 'मीठा दाखां (अंगूर)',
    strawberrySample: 'लाल स्ट्रॉबेरी',
    tomatoSample: 'देसी टमाटर',
    appleSample: 'लाल सेव',
    bananaSample: 'पक्क्यो केळो',
    sunflowerSample: 'सूरजमुखी',
    lilySample: 'कुमुद / लिली',
    monarchSample: 'रंग-बिरंगी तितली',
    peacockSample: 'जयपुर रो मोर (राष्ट्रीय पक्षी)',
    turtleSample: 'काछबो (कछुआ)',
    simulatePvaBtn: 'जीव बचायबा रो पूर्वानुमान (PVA)',
    quickQuestions: 'जयपुर रा टाबरां खातर सवाल:',
    askPlaceholder: 'रूख, खेजड़ी, फल, तरकारी या झालावाड़-जयपुर रा जीव बाबत पूछो...',
    lensOverview: 'गूगल लेंस नजर',
    identifiedSpecies: 'पछाणी गी प्रजाति',
    confidence: 'सटीकता री खातरी',
    habitat: 'प्राकृतिक ठौर-ठिकाणो',
    funFact: 'कांई थे जाणो हो? (अचंभो ज्ञान)',
    lookalikes: 'मिलती-जुलती प्रजातियां',
    switchSpecimen: 'नमूणो बदलो:',
    currentCount: 'इबकी अनुमानित संख्या',
    recoveryTarget: 'सुरक्षित लक्ष्य संख्या',
    loginRequiredToSave: 'जीव सहेजण खातर लॉगिन जरूरी है',
    signInToSave: 'आपरे बायोडेक्स में सहेजण खातर Google सूं लॉगिन करणा जरूरी है सा!',
    jaipurIndiaHabitats: 'जयपुर अर राजस्थान रा आवास',
  },
  bn: {
    appName: 'বায়োমেডেক্স লেন্স (BioDex)',
    gradeBadge: 'ষষ্ঠ শ্রেণি বিজ্ঞান সংস্করণ',
    scannerTab: 'স্ক্যানার',
    biodexTab: 'বায়োডেক্স',
    mapTab: 'মানচিত্র',
    predictTab: 'ভবিষ্যদ্বাণী (PVA)',
    chatTab: 'এআই চ্যাট',
    reportsTab: 'প্রতিবেদন',
    pvaShort: 'PVA',
    pvaFull: 'জনসংখ্যা টেকসইযোগ্যতা বিশ্লেষণ (PVA)',
    pvaExplain6thGrade:
      'PVA মানে পপুলেশন ভায়াবিলিটি অ্যানালাইসিস। এটি এমন একটি গণিত পূর্বাভাস যা দিয়ে বোঝা যায় প্রাণী বা উদ্ভিদ ভবিষ্যতে বেঁচে থাকবে নাকি বিলুপ্ত হয়ে যাবে!',
    fruitsAndVeggies: 'ফল ও শাকসবজি',
    allCategories: 'সকল প্রজাতি',
    plants: 'উদ্ভিদ ও ফুল',
    animals: 'প্রাণী ও বন্যপ্রাণী',
    insects: 'কীটপতঙ্গ',
    reptiles: 'সরীসৃপ',
    leastConcern: 'কম ঝুঁকিপূর্ণ',
    leastConcernSimple: 'নিরাপদ ও সমৃদ্ধ (কম উদ্বেগ)',
    vulnerable: 'ঝুঁকিপূর্ণ',
    vulnerableSimple: 'বিপদাপন্ন / সুরক্ষার প্রয়োজন',
    endangered: 'বিপন্ন',
    endangeredSimple: 'বিলুপ্তির মুখে (বিপন্ন প্রজাতি)',
    criticallyEndangered: 'চরম বিপন্ন',
    criticallyEndangeredSimple: 'জরুরি সতর্কতা (চরম বিপন্ন)',
    scanSpecimenBtn: 'নতুন নমুনা স্ক্যান করুন',
    takePhotoBtn: 'সরাসরি ছবি তুলুন',
    uploadImageBtn: 'ছবি আপলোড করুন',
    testSamplesTitle: 'তাত্ক্ষণিক পরীক্ষার জন্য নমুনা ক্লিক করুন:',
    grapeSample: 'কালো আঙুর',
    strawberrySample: 'বাগান স্ট্রবেরি',
    tomatoSample: 'লাল টমেটো',
    appleSample: 'লাল আপেল',
    bananaSample: 'পাকা কলা',
    sunflowerSample: 'সূর্যমুখী',
    lilySample: 'লিলি ফুল',
    monarchSample: 'মোনার্ক প্রজাপতি',
    peacockSample: 'ময়ূর (জয়পুর)',
    turtleSample: 'কচ্ছপ',
    simulatePvaBtn: 'ভবিষ্যত অস্তিত্বের পূর্বাভাস (PVA)',
    quickQuestions: 'ষষ্ঠ শ্রেণির জন্য কুইক প্রশ্ন:',
    askPlaceholder: 'উদ্ভিদ, ফল, শাকসবজি বা বন্যপ্রাণী সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন...',
    lensOverview: 'গুগল লেন্স সারসংক্ষেপ',
    identifiedSpecies: 'শনাক্তকৃত প্রজাতি',
    confidence: 'সঠিকতার হার',
    habitat: 'প্রাকৃতিক বাসস্থান',
    funFact: 'আপনি কি জানেন? (মজার তথ্য)',
    lookalikes: 'অনুরূপ প্রজাতি',
    switchSpecimen: 'নমুনা পরিবর্তন করুন:',
    currentCount: 'বর্তমান আনুমানিক সংখ্যা',
    recoveryTarget: 'নিরাপদ পুনরুদ্ধার লক্ষ্য',
    loginRequiredToSave: 'সংরক্ষণ করতে লগইন প্রয়োজন',
    signInToSave: 'আপনার ব্যক্তিগত বায়োডেক্সে এই প্রজাতি সংরক্ষণ করতে দয়া করে Google দিয়ে লগইন করুন!',
    jaipurIndiaHabitats: 'জয়পুর ও ভারতের আবাসস্থল',
  },
  ta: {
    appName: 'பயோடெக்ஸ் லென்ஸ் (BioDex)',
    gradeBadge: '6-ம் வகுப்பு அறிவியல் பதிப்பு',
    scannerTab: 'ஸ்கேனர்',
    biodexTab: 'பயோடெக்ஸ்',
    mapTab: 'வரைபடம்',
    predictTab: 'கணிப்பு (PVA)',
    chatTab: 'ஏஐ அரட்டை',
    reportsTab: 'அறிக்கைகள்',
    pvaShort: 'PVA',
    pvaFull: 'மக்கள்தொகை நிலைப்புத்தன்மை பகுப்பாய்வு (PVA)',
    pvaExplain6thGrade:
      'PVA என்பது மக்கள்தொகை நிலைப்புத்தன்மை பகுப்பாய்வு ஆகும். தாவரங்கள், விலங்குகள் அல்லது பயிர்கள் எதிர்காலத்தில் பெருகுமா அல்லது அழியுமா என்பதை கணிதக் கணக்கீடுகள் மூலம் சொல்லும் ஒரு முன்னறிவிப்புக் கருவி இது!',
    fruitsAndVeggies: 'பழங்கள் மற்றும் காய்கறிகள்',
    allCategories: 'அனைத்து உயிரினங்கள்',
    plants: 'தாவரங்கள் & பூக்கள்',
    animals: 'விலங்குகள் & பறவைகள்',
    insects: 'பூச்சிகள்',
    reptiles: 'ஊர்வன',
    leastConcern: 'பாதுகாப்பானது',
    leastConcernSimple: 'பாதுகாப்பானது மற்றும் பெருகியுள்ளது',
    vulnerable: 'ஆபத்தில் உள்ளது',
    vulnerableSimple: 'ஆபத்தில் உள்ளது / உதவி தேவை',
    endangered: 'அழிந்துவரும் இனம்',
    endangeredSimple: 'அழியும் தருவாயில் உள்ளது',
    criticallyEndangered: 'கடுமையான ஆபத்தில் உள்ளது',
    criticallyEndangeredSimple: 'உடனடி பாதுகாப்பு தேவை',
    scanSpecimenBtn: 'புதிய மாதிரியை ஸ்கேன் செய்',
    takePhotoBtn: 'நேரடி புகைப்படம் எடு',
    uploadImageBtn: 'படத்தை பதிவேற்று',
    testSamplesTitle: 'உடனடியாக சோதிக்க மாதிரியைத் தொடுங்கள்:',
    grapeSample: 'கருப்பு திராட்சை',
    strawberrySample: 'ஸ்ட்ராபெரி',
    tomatoSample: 'தக்காளி',
    appleSample: 'ஆப்பிள்',
    bananaSample: 'வாழைப்பழம்',
    sunflowerSample: 'சூரியகாந்தி',
    lilySample: 'அல்லி மலர்',
    monarchSample: 'மோனார்க் பட்டாம்பூச்சி',
    peacockSample: 'இந்திய மயில் (ஜெய்ப்பூர்)',
    turtleSample: 'ஆமை',
    simulatePvaBtn: 'எதிர்கால உயிர்வாழ்வை கணி (PVA)',
    quickQuestions: '6-ம் வகுப்பு மாணவர்களுக்கான கேள்விகள்:',
    askPlaceholder: 'தாவரங்கள், பழங்கள், காய்கறிகள் அல்லது விலங்குகள் பற்றி கேளுங்கள்...',
    lensOverview: 'கூகிள் லென்ஸ் பார்வை',
    identifiedSpecies: 'கண்டறியப்பட்ட இனம்',
    confidence: 'துல்லிய சதவீதம்',
    habitat: 'இயற்கை வாழ்விடம்',
    funFact: 'உங்களுக்குத் தெரியுமா? (அறிவியல் உண்மை)',
    lookalikes: 'ஒரே மாதிரியான இனங்கள்',
    switchSpecimen: 'மாதிரியை மாற்று:',
    currentCount: 'தற்போதைய மதிப்பீடு',
    recoveryTarget: 'பாதுகாப்பான இலக்கு',
    loginRequiredToSave: 'சேமிக்க உள்நுழைவு தேவை',
    signInToSave: 'உங்கள் பயோடெக்ஸில் சேமிக்க Google மூலம் உள்நுழையவும்!',
    jaipurIndiaHabitats: 'ஜெய்ப்பூர் & இந்திய வாழ்விடங்கள்',
  },
};

const LANG_KEY = 'biodex_user_language';

export function getSavedLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem(LANG_KEY) as SupportedLanguage;
    if (saved && TRANSLATIONS[saved]) {
      return saved;
    }
  } catch {
    // Ignore storage issues
  }
  return 'en';
}

export function saveLanguage(lang: SupportedLanguage): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // Ignore storage issues
  }
}

export function getTranslation(lang: SupportedLanguage = 'en'): TranslationDictionary {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
