const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const langCodes = {
  'assamese': 'as',
  'bengali': 'bn',
  'bodo': 'en', // fallback, bodo not widely supported by google translate api
  'dogri': 'hi', // fallback to hi
  'en': 'en',
  'gujarati': 'gu',
  'hi': 'hi',
  'kannada': 'kn',
  'kashmiri': 'ur', // fallback
  'konkani': 'mr', // fallback to marathi
  'maithili': 'hi', // fallback to hi
  'malayalam': 'ml',
  'manipuri': 'en',
  'marathi': 'mr',
  'nepali': 'ne',
  'odia': 'or',
  'punjabi': 'pa',
  'sanskrit': 'sa',
  'santali': 'en',
  'sindhi': 'sd',
  'tamil': 'ta',
  'telugu': 'te',
  'urdu': 'ur'
};

async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;
  
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    return data[0].map(item => item[0]).join('');
  } catch (err) {
    console.error(`Failed to translate to ${targetLang}:`, err);
    return text;
  }
}

async function run() {
  for (const file of files) {
    const langName = file.replace('.json', '');
    const code = langCodes[langName] || 'en';
    
    console.log(`Translating for ${langName} (${code})...`);
    
    const filePath = path.join(localesDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Only translate if missing or if it's English but file is not English
    if (!content.accountSettings || (content.accountSettings === 'Account Settings' && code !== 'en')) {
      const translatedTitle = await translateText('Account Settings', code);
      const translatedDesc = await translateText('Manage your profile and custom settings', code);
      
      content.accountSettings = translatedTitle;
      content.manageCustomInfo = translatedDesc;
      
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
      console.log(`  -> Saved ${langName}: ${translatedTitle}`);
    } else {
      console.log(`  -> Already translated`);
    }
    
    // Sleep to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('All done!');
}

run();
