/**
 * A dictionary mapping multilingual terms (Hindi, Bengali, Tamil, etc.) 
 * to their English equivalents for consistent product searching.
 */
export const cropTranslator = {
  // Vegetables
  "tamatar": "tomato",
  "thakkali": "tomato",
  "tameta": "tomato",
  "aloo": "potato",
  "batata": "potato",
  "urulaikilangu": "potato",
  "pyaaz": "onion",
  "kanda": "onion",
  "vengayam": "onion",
  "baingan": "brinjal",
  "vangi": "brinjal",
  "kathirikai": "brinjal",
  "adrak": "ginger",
  "ale": "ginger",
  "inji": "ginger",
  "lehsun": "garlic",
  "lasun": "garlic",
  "poondu": "garlic",
  "bhindi": "okra",
  "bhendi": "okra",
  "vendakkai": "okra",
  "gajar": "carrot",
  "carrot": "carrot",
  "mooli": "radish",
  "mula": "radish",
  "gobhi": "cauliflower",
  "fulavar": "cauliflower",
  "pattagobhi": "cabbage",
  "kobi": "cabbage",
  "mirch": "chilli",
  "mirchi": "chilli",
  "milagai": "chilli",
  "dhaniya": "coriander",
  "kothimbir": "coriander",
  "koththamalli": "coriander",
  "palak": "spinach",
  "pasalai": "spinach",

  // Fruits
  "aam": "mango",
  "mamba": "mango",
  "mango": "mango",
  "kela": "banana",
  "kadali": "banana",
  "vazhaipalam": "banana",
  "seb": "apple",
  "safarchand": "apple",
  "santra": "orange",
  "narangi": "orange",
  "angoor": "grapes",
  "draksha": "grapes",
  "anar": "pomegranate",
  "dalimb": "pomegranate",
  "papita": "papaya",
  "peru": "guava",
  "amrud": "guava",
  "koyyapalam": "guava",
  "tarbooj": "watermelon",
  "kalingad": "watermelon",

  // Grains & Pulses
  "chawal": "rice",
  "tandul": "rice",
  "arisi": "rice",
  "dhan": "paddy",
  "gehu": "wheat",
  "godhumai": "wheat",
  "jowar": "sorghum",
  "bajra": "millet",
  "makka": "maize",
  "dal": "pulses",
  "paruppu": "pulses",
  "chana": "chickpea",
  "kadalai": "chickpea",
  "moong": "mung bean",
  "tur": "pigeon pea",
  "udad": "black gram",

  // Others
  "doodh": "milk",
  "pal": "milk",
  "anda": "egg",
  "muttai": "egg",
  "shahad": "honey",
  "then": "honey"
};

/**
 * Translates a given term to English if found in the dictionary.
 * Otherwise returns the original term.
 */
export const translateTerm = (term) => {
  if (!term) return "";
  const cleanTerm = term.toLowerCase().trim();
  
  // Direct match
  if (cropTranslator[cleanTerm]) {
    return cropTranslator[cleanTerm];
  }

  // Check if any word in the phrase matches
  const words = cleanTerm.split(/\s+/);
  for (const word of words) {
    if (cropTranslator[word]) {
      return cropTranslator[word];
    }
  }

  return term;
};
