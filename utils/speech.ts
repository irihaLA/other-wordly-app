
// A mapping from the app's language names to BCP 47 language codes
// This is not exhaustive and might need additions.
const languageToCode: { [key: string]: string } = {
  'danish': 'da-DK',
  'swedish': 'sv-SE',
  'spanish': 'es-ES',
  'portuguese': 'pt-BR',
  'welsh': 'cy-GB',
  'russian': 'ru-RU',
  'tagalog': 'fil-PH',
  'arabic': 'ar-SA',
  'german': 'de-DE',
  'japanese': 'ja-JP',
  'icelandic': 'is-IS',
  'finnish': 'fi-FI',
  'french': 'fr-FR',
  'scots': 'en-GB', // No specific Scots voice, use UK English as fallback
};

export const speakWord = (word: string, language: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    alert("Sorry, your browser doesn't support text-to-speech.");
    return;
  }

  // Cancel any previous speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(word);
  const langCode = languageToCode[language.toLowerCase()];

  if (langCode) {
    utterance.lang = langCode;
  } else {
    console.warn(`No language code found for: ${language}. Using browser default.`);
  }
  
  // Try to find a voice for the specific language
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang === langCode);
  if (voice) {
      utterance.voice = voice;
  }

  utterance.rate = 0.85; // Speak a little slower
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
};

// Pre-load voices
if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}
