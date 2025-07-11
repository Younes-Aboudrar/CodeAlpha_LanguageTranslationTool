/**
 * Professional Language Translator
 * Uses Microsoft Azure Translator API to translate text between languages
 */

// API Configuration
const API_KEY = "";     // Insert your API Key here
const API_ENDPOINT = "https://api.cognitive.microsofttranslator.com/";
const API_LOCATION = "";    // Insert your API Location here

// Elements
const sourceTextElem = document.getElementById('source-text');
const targetTextElem = document.getElementById('target-text');
const sourceLanguageSelect = document.getElementById('source-language');
const targetLanguageSelect = document.getElementById('target-language');
const translateBtn = document.getElementById('translate-btn');
const exchangeBtn = document.getElementById('exchange-btn');
const clearSourceBtn = document.getElementById('clear-source');
const copyTargetBtn = document.getElementById('copy-target');
const speakSourceBtn = document.getElementById('speak-source');
const speakTargetBtn = document.getElementById('speak-target');
const charCounter = document.getElementById('char-counter');
const loadingElem = document.getElementById('loading');
const themeToggle = document.querySelector('.theme-toggle');

// Available languages for translation
const languages = [
    { code: "af", name: "Afrikaans" },
    { code: "sq", name: "Albanian" },
    { code: "am", name: "Amharic" },
    { code: "ar", name: "Arabic" },
    { code: "hy", name: "Armenian" },
    { code: "as", name: "Assamese" },
    { code: "az", name: "Azerbaijani" },
    { code: "bn", name: "Bangla" },
    { code: "ba", name: "Bashkir" },
    { code: "eu", name: "Basque" },
    { code: "be", name: "Belarusian" },
    { code: "bs", name: "Bosnian" },
    { code: "bg", name: "Bulgarian" },
    { code: "ca", name: "Catalan" },
    { code: "lzh", name: "Chinese (Literary)" },
    { code: "zh-Hans", name: "Chinese Simplified" },
    { code: "zh-Hant", name: "Chinese Traditional" },
    { code: "hr", name: "Croatian" },
    { code: "cs", name: "Czech" },
    { code: "da", name: "Danish" },
    { code: "prs", name: "Dari" },
    { code: "dv", name: "Divehi" },
    { code: "nl", name: "Dutch" },
    { code: "en", name: "English" },
    { code: "et", name: "Estonian" },
    { code: "fa", name: "Persian" },
    { code: "fi", name: "Finnish" },
    { code: "fr", name: "French" },
    { code: "fr-CA", name: "French (Canada)" },
    { code: "gl", name: "Galician" },
    { code: "ka", name: "Georgian" },
    { code: "de", name: "German" },
    { code: "el", name: "Greek" },
    { code: "gu", name: "Gujarati" },
    { code: "ht", name: "Haitian Creole" },
    { code: "ha", name: "Hausa" },
    { code: "he", name: "Hebrew" },
    { code: "hi", name: "Hindi" },
    { code: "hu", name: "Hungarian" },
    { code: "is", name: "Icelandic" },
    { code: "id", name: "Indonesian" },
    { code: "iu", name: "Inuktitut" },
    { code: "ga", name: "Irish" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "kn", name: "Kannada" },
    { code: "kk", name: "Kazakh" },
    { code: "km", name: "Khmer" },
    { code: "ko", name: "Korean" },
    { code: "ku", name: "Kurdish (Central)" },
    { code: "ky", name: "Kyrgyz" },
    { code: "lo", name: "Lao" },
    { code: "lv", name: "Latvian" },
    { code: "lt", name: "Lithuanian" },
    { code: "mk", name: "Macedonian" },
    { code: "mg", name: "Malagasy" },
    { code: "ms", name: "Malay" },
    { code: "ml", name: "Malayalam" },
    { code: "mt", name: "Maltese" },
    { code: "mi", name: "Maori" },
    { code: "mr", name: "Marathi" },
    { code: "mn-Mong", name: "Mongolian (Traditional)" },
    { code: "mn-Cyrl", name: "Mongolian" },
    { code: "my", name: "Myanmar" },
    { code: "ne", name: "Nepali" },
    { code: "nb", name: "Norwegian" },
    { code: "or", name: "Odia" },
    { code: "ps", name: "Pashto" },
    { code: "pl", name: "Polish" },
    { code: "pt-BR", name: "Portuguese (Brazil)" },
    { code: "pt-PT", name: "Portuguese (Portugal)" },
    { code: "pa", name: "Punjabi" },
    { code: "otq", name: "Querétaro Otomi" },
    { code: "ro", name: "Romanian" },
    { code: "ru", name: "Russian" },
    { code: "sm", name: "Samoan" },
    { code: "sr-Cyrl", name: "Serbian (Cyrillic)" },
    { code: "sr-Latn", name: "Serbian (Latin)" },
    { code: "sk", name: "Slovak" },
    { code: "sl", name: "Slovenian" },
    { code: "so", name: "Somali" },
    { code: "es", name: "Spanish" },
    { code: "sw", name: "Swahili" },
    { code: "sv", name: "Swedish" },
    { code: "ty", name: "Tahitian" },
    { code: "ta", name: "Tamil" },
    { code: "tt", name: "Tatar" },
    { code: "te", name: "Telugu" },
    { code: "th", name: "Thai" },
    { code: "bo", name: "Tibetan" },
    { code: "ti", name: "Tigrinya" },
    { code: "tr", name: "Turkish" },
    { code: "tk", name: "Turkmen" },
    { code: "uk", name: "Ukrainian" },
    { code: "ur", name: "Urdu" },
    { code: "ug", name: "Uyghur" },
    { code: "uz", name: "Uzbek (Latin)" },
    { code: "vi", name: "Vietnamese" },
    { code: "cy", name: "Welsh" },
    { code: "yua", name: "Yucatec Maya" },
    { code: "zu", name: "Zulu" }
];

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    populateLanguageDropdowns();
    attachEventListeners();
    loadSavedTheme();
    loadVoices();
    
    // Set the initial target language based on user's browser language
    const userLang = navigator.language.split('-')[0];
    if (userLang && userLang !== 'auto') {
        const langExists = languages.find(lang => lang.code === userLang);
        if (langExists) {
            targetLanguageSelect.value = userLang;
        }
    }
}

// Store available voices globally for better performance
let availableTtsVoices = [];

/**
 * Load available speech synthesis voices
 */
function loadVoices() {
    // Some browsers need this event to load voices
    if (!window.speechSynthesis) return;
    
    // Function to cache voices
    const cacheVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
            // Only update the cache if we actually got voices
            availableTtsVoices = voices;
            
            console.log('Speech synthesis voices loaded:', availableTtsVoices.length);
            
            // Log available languages for debugging
            const availableLanguages = [...new Set(availableTtsVoices.map(voice => voice.lang.split('-')[0]))];
            console.log('Available TTS languages:', availableLanguages.sort().join(', '));
            
            // Update button states once voices are loaded
            if (sourceLanguageSelect && targetLanguageSelect) {
                updateSpeakButtonState(sourceLanguageSelect.value, speakSourceBtn);
                updateSpeakButtonState(targetLanguageSelect.value, speakTargetBtn);
            }
        }
    };
    
    // Chrome and Edge need this event
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = cacheVoices;
    }
    
    // Try to get voices immediately (works in Firefox and Safari)
    cacheVoices();
    
    // Multiple retries with increasing delays to ensure voices are loaded
    // This helps on various browsers where voice loading timing can differ
    const retryDelays = [500, 1000, 2000];
    
    retryDelays.forEach(delay => {
        setTimeout(() => {
            if (availableTtsVoices.length === 0) {
                console.log(`Retrying voice loading after ${delay}ms...`);
                cacheVoices();
            }
        }, delay);
    });
}

/**
 * Populate language dropdowns with available languages
 */
function populateLanguageDropdowns() {
    // Sort languages alphabetically
    languages.sort((a, b) => a.name.localeCompare(b.name));
    
    // Populate source language dropdown (keeping "Detect Language" as first option)
    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.code;
        option.textContent = language.name;
        sourceLanguageSelect.appendChild(option);
    });
    
    // Populate target language dropdown
    targetLanguageSelect.innerHTML = ''; // Clear default option
    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.code;
        option.textContent = language.name;
        targetLanguageSelect.appendChild(option);
    });
    
    // Set English as default target language
    targetLanguageSelect.value = 'en';
}

/**
 * Attach event listeners to elements
 */
function attachEventListeners() {
    // Translation button click
    translateBtn.addEventListener('click', handleTranslation);
    
    // Exchange languages
    exchangeBtn.addEventListener('click', exchangeLanguages);
    
    // Clear source text
    clearSourceBtn.addEventListener('click', () => {
        sourceTextElem.value = '';
        updateCharCounter();
        targetTextElem.textContent = '';
    });
    
    // Copy target text
    copyTargetBtn.addEventListener('click', copyToClipboard);
    
    // Text-to-speech for source and target text
    speakSourceBtn.addEventListener('click', () => textToSpeech(sourceTextElem.value, sourceLanguageSelect.value));
    speakTargetBtn.addEventListener('click', () => textToSpeech(targetTextElem.textContent, targetLanguageSelect.value));
    
    // Update character counter as user types
    sourceTextElem.addEventListener('input', updateCharCounter);
    
    // Update button states when languages are changed
    sourceLanguageSelect.addEventListener('change', () => {
        updateSpeakButtonState(sourceLanguageSelect.value, speakSourceBtn);
    });
    
    targetLanguageSelect.addEventListener('change', () => {
        updateSpeakButtonState(targetLanguageSelect.value, speakTargetBtn);
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Allow translation on Enter key (with Ctrl or Shift for new line)
    sourceTextElem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
            e.preventDefault();
            handleTranslation();
        }
    });
    
    // Initial button state update
    updateSpeakButtonState(sourceLanguageSelect.value, speakSourceBtn);
    updateSpeakButtonState(targetLanguageSelect.value, speakTargetBtn);
}

/**
 * Update the character counter display
 */
function updateCharCounter() {
    const count = sourceTextElem.value.length;
    charCounter.textContent = count;
    
    // Visual indication if approaching limit
    if (count > 4500) {
        charCounter.style.color = '#ea4335';
    } else {
        charCounter.style.color = '';
    }
}

/**
 * Exchange source and target languages
 */
function exchangeLanguages() {
    // Don't exchange if source is set to auto-detect
    if (sourceLanguageSelect.value === 'auto') {
        showNotification('Cannot exchange when source language is set to "Detect Language"', true);
        return;
    }
    
    // Exchange languages
    const tempLang = sourceLanguageSelect.value;
    sourceLanguageSelect.value = targetLanguageSelect.value;
    targetLanguageSelect.value = tempLang;
    
    // Update button states after exchange
    updateSpeakButtonState(sourceLanguageSelect.value, speakSourceBtn);
    updateSpeakButtonState(targetLanguageSelect.value, speakTargetBtn);
    
    // Exchange texts if target has content
    if (targetTextElem.textContent.trim() !== '') {
        const tempText = sourceTextElem.value;
        sourceTextElem.value = targetTextElem.textContent;
        targetTextElem.textContent = tempText;
        updateCharCounter();
    }
}

/**
 * Handle the translation process
 */
async function handleTranslation() {
    const sourceText = sourceTextElem.value.trim();
    const sourceLanguage = sourceLanguageSelect.value;
    const targetLanguage = targetLanguageSelect.value;
    
    if (!sourceText) {
        showNotification('Please enter text to translate', true);
        return;
    }
    
    if (sourceText.length > 5000) {
        showNotification('Text exceeds 5000 character limit', true);
        return;
    }
    
    try {
        showLoading(true);
        const translatedText = await translateText(sourceText, sourceLanguage, targetLanguage);
        targetTextElem.textContent = translatedText;
        showLoading(false);
    } catch (error) {
        console.error('Translation error:', error);
        showNotification('Translation failed. Please try again later.', true);
        showLoading(false);
    }
}

/**
 * Translate text using Microsoft Azure Translator API
 * @param {string} text - Text to translate
 * @param {string} from - Source language code
 * @param {string} to - Target language code
 * @returns {Promise<string>} Translated text
 */
async function translateText(text, from, to) {
    const url = `${API_ENDPOINT}/translate?api-version=3.0&to=${to}${from !== 'auto' ? `&from=${from}` : ''}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': API_KEY,
                'Ocp-Apim-Subscription-Region': API_LOCATION
            },
            body: JSON.stringify([{ text }])
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        
        const data = await response.json();
        
        // If language was auto-detected, update the source language dropdown
        if (from === 'auto' && data[0].detectedLanguage) {
            const detectedCode = data[0].detectedLanguage.language;
            updateDetectedLanguage(detectedCode);
        }
        
        return data[0].translations[0].text;
    } catch (error) {
        console.error('API error:', error);
        throw error;
    }
}

/**
 * Update the source language dropdown with the detected language
 * @param {string} langCode - Detected language code
 */
function updateDetectedLanguage(langCode) {
    const detectedLanguage = languages.find(lang => lang.code === langCode);
    
    if (detectedLanguage) {
        // Create temporary option for the detected language
        const detectedOption = document.createElement('option');
        detectedOption.value = 'auto';
        detectedOption.textContent = `Detect Language (Detected: ${detectedLanguage.name})`;
        
        // Replace the first option but keep 'auto' selected
        sourceLanguageSelect.options[0] = detectedOption;
        sourceLanguageSelect.value = 'auto'; // Ensure "auto" remains selected
        
        // Update speak button state based on detected language
        // For "auto" detection, use the detected language code for TTS capability check
        updateSpeakButtonState(langCode, speakSourceBtn);
    }
}

/**
 * Copy translated text to clipboard
 */
function copyToClipboard() {
    const text = targetTextElem.textContent;
    if (!text.trim()) return;
    
    navigator.clipboard.writeText(text)
        .then(() => showNotification('Copied to clipboard!'))
        .catch(() => showNotification('Failed to copy text', true));
}

/**
 * Convert text to speech using browser's built-in speech synthesis
 * @param {string} text - Text to speak
 * @param {string} langCode - Language code
 */
function textToSpeech(text, langCode) {
    if (!text.trim()) return;
    
    // Stop any currently playing speech
    if (!window.speechSynthesis) {
        showNotification('Text-to-speech is not supported in your browser', true);
        return;
    }
    
    window.speechSynthesis.cancel();
    
    // Get language name for better user feedback
    const langName = languages.find(lang => lang.code === langCode)?.name || langCode;
    
    // Map Microsoft language codes to BCP 47 language tags for Speech Synthesis
    const speechLang = mapToSpeechLang(langCode);
    
    // Use cached voices or get them again if needed
    const voices = availableTtsVoices.length > 0 ? availableTtsVoices : window.speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLang;
    
    // Try to find a native voice for this language
    // First look for an exact match (e.g., fr-FR)
    let nativeVoice = voices.find(voice => voice.lang.toLowerCase() === speechLang.toLowerCase());
    
    // If no exact match, try to find a voice with the same base language (e.g., fr)
    if (!nativeVoice) {
        const baseLanguage = speechLang.toLowerCase().split('-')[0];
        nativeVoice = voices.find(voice => 
            voice.lang.toLowerCase().startsWith(baseLanguage)
        );
    }
    
    // If we found a native voice, use it without notification
    if (nativeVoice) {
        utterance.voice = nativeVoice;
        utterance.lang = nativeVoice.lang;
        
        // Track if speech actually starts
        let speechStarted = false;
        
        utterance.onstart = () => {
            speechStarted = true;
        };
        
        // Add improved error handling
        utterance.onerror = (event) => {
            console.error('TTS Error with native voice:', event);
            // If speech never started, try fallback
            if (!speechStarted) {
                // Retry with fallback logic
                tryFallbackVoice(text, langCode, langName);
            } else {
                showNotification('Text-to-speech playback was interrupted', true);
            }
        };
        
        // Use the native voice
        window.speechSynthesis.speak(utterance);
        
        // Double-check if speech synthesis is working
        setTimeout(() => {
            if (!speechStarted && window.speechSynthesis.pending) {
                // If after a delay speech hasn't started but is still pending, try fallback
                window.speechSynthesis.cancel();
                tryFallbackVoice(text, langCode, langName);
            }
        }, 500);
        
        return;
    }
    
    // If no native voice is available, try to use a fallback voice
    // First try to find a suitable fallback voice (prioritize local voices)
    let fallbackVoice = voices.find(v => v.localService) || voices[0];
    
    // Only use fallback if we have a valid fallback voice
    if (fallbackVoice) {
        // Show a yellow warning notification that we're using a fallback voice
        showNotification(`Native voice not available for ${langName}. Using fallback voice.`, 'warning');
        
        // Create a new utterance with the fallback settings
        const fallbackUtterance = new SpeechSynthesisUtterance(text);
        fallbackUtterance.voice = fallbackVoice;
        fallbackUtterance.lang = fallbackVoice.lang;
        
        // Add more robust error and success tracking
        let speechStarted = false;
        
        fallbackUtterance.onstart = () => {
            speechStarted = true;
            console.log('Fallback speech started successfully');
        };
        
        fallbackUtterance.onerror = (event) => {
            console.error('TTS Error with fallback voice:', event);
            if (!speechStarted) {
                // If speech never started, show the no-voice-available message instead
                showNotification(`Text-to-speech is not available for ${langName}.`, true);
            } else {
                showNotification('Text-to-speech playback was interrupted', true);
            }
        };
        
        // Use the fallback voice
        window.speechSynthesis.speak(fallbackUtterance);
        
        // Double-check if speech synthesis is working
        setTimeout(() => {
            if (!speechStarted && window.speechSynthesis.pending) {
                // If after a delay speech hasn't started but is still pending, cancel and show error
                window.speechSynthesis.cancel();
                showNotification(`Text-to-speech is not available for ${langName}.`, true);
            }
        }, 500);
        
        return;
    }
    
    // If no native voice was found, try fallback
    tryFallbackVoice(text, langCode, langName);
}

/**
 * Try to use a fallback voice when native voice fails
 * @param {string} text - Text to speak
 * @param {string} langCode - Language code
 * @param {string} langName - Display name of the language
 */
function tryFallbackVoice(text, langCode, langName) {
    // Get available voices
    const voices = availableTtsVoices.length > 0 ? availableTtsVoices : window.speechSynthesis.getVoices();
    
    // Try to find best fallback voice
    // Priority order: 
    // 1. Try to find a local/reliable voice (any language)
    // 2. Just use any available voice as last resort
    const fallbackVoice = voices.find(v => v.localService) || 
                          (voices.length > 0 ? voices[0] : null);
    
    if (fallbackVoice) {
        // Show a yellow warning notification that we're using a fallback voice
        const fallbackLang = fallbackVoice.lang.split('-')[0].toUpperCase();
        showNotification(`Native voice not available for ${langName}. Using ${fallbackLang} voice.`, 'warning');
        
        // Create a new utterance with the fallback settings
        const fallbackUtterance = new SpeechSynthesisUtterance(text);
        fallbackUtterance.voice = fallbackVoice;
        fallbackUtterance.lang = fallbackVoice.lang;
        
        // Track if speech actually starts
        let speechStarted = false;
        
        fallbackUtterance.onstart = () => {
            speechStarted = true;
        };
        
        fallbackUtterance.onerror = (event) => {
            console.error('TTS Error with fallback voice:', event);
            if (!speechStarted) {
                // If fallback also fails, show not available message
                showNotification(`Text-to-speech is not available for ${langName}.`, true);
            } else {
                showNotification('Text-to-speech playback was interrupted', true);
            }
        };
        
        // Use the fallback voice
        window.speechSynthesis.speak(fallbackUtterance);
        
        // Final check if speech synthesis is working
        setTimeout(() => {
            if (!speechStarted && window.speechSynthesis.pending) {
                window.speechSynthesis.cancel();
                showNotification(`Text-to-speech is not available for ${langName}.`, true);
                
                // Make sure button state reflects the current situation
                const buttonToUpdate = langCode === sourceLanguageSelect.value ? speakSourceBtn : speakTargetBtn;
                updateSpeakButtonState(langCode, buttonToUpdate);
            }
        }, 500);
    } else {
        // No fallback available
        showNotification(`Text-to-speech is not available for ${langName}.`, true);
        
        // Make sure button state reflects the current situation
        const buttonToUpdate = langCode === sourceLanguageSelect.value ? speakSourceBtn : speakTargetBtn;
        updateSpeakButtonState(langCode, buttonToUpdate);
    }
}

/**
 * Map Microsoft Translator language codes to BCP 47 language tags
 * @param {string} langCode - Microsoft language code
 * @returns {string} BCP 47 language tag
 */
function mapToSpeechLang(langCode) {
    // If auto is selected, use the browser's language
    if (langCode === 'auto') {
        return navigator.language || 'en-US';
    }
    
    // Handle special cases and common mappings for better TTS compatibility
    const specialCases = {
        // Chinese variants
        'zh-Hans': 'zh-CN',
        'zh-Hant': 'zh-TW',
        // Serbian variants
        'sr-Cyrl': 'sr',
        'sr-Latn': 'sr-Latn',
        // Arabic
        'ar': 'ar-SA',
        // Spanish
        'es': 'es-ES',
        // French
        'fr': 'fr-FR',
        'fr-CA': 'fr-CA',
        // Portuguese
        'pt-BR': 'pt-BR',
        'pt-PT': 'pt-PT',
        // English variants
        'en': 'en-US',
        // German
        'de': 'de-DE',
        // Japanese
        'ja': 'ja-JP',
        // Russian
        'ru': 'ru-RU',
        // Italian
        'it': 'it-IT',
        // Korean
        'ko': 'ko-KR',
        // Hindi
        'hi': 'hi-IN',
        // Turkish
        'tr': 'tr-TR'
    };
    
    return specialCases[langCode] || langCode;
}

/**
 * Show or hide loading spinner
 * @param {boolean} show - Whether to show or hide
 */
function showLoading(show) {
    loadingElem.classList.toggle('hidden', !show);
}

/**
 * Display notification message
 * @param {string} message - Message to display
 * @param {boolean|string} type - Type of notification: true/false for error/success or 'warning' for warning
 */
function showNotification(message, type = false) {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        document.body.removeChild(existingNotification);
    }
    
    // Create new notification
    const notification = document.createElement('div');
    
    // Set notification class based on type
    let notificationClass = '';
    if (type === true) {
        notificationClass = 'error';
    } else if (type === 'warning') {
        notificationClass = 'warning';
    }
    
    notification.className = `notification ${notificationClass}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto-hide after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    // Update theme toggle icon
    themeToggle.innerHTML = isDarkTheme ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    
    // Save theme preference
    localStorage.setItem('darkTheme', isDarkTheme);
}

/**
 * Load saved theme preference from localStorage
 */
function loadSavedTheme() {
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

/**
 * Check if text-to-speech is available for a given language and update button state
 * @param {string} langCode - Language code to check
 * @param {HTMLButtonElement} buttonElement - The speak button to enable/disable
 */
function updateSpeakButtonState(langCode, buttonElement) {
    // If browser doesn't support speech synthesis, disable button
    if (!window.speechSynthesis) {
        buttonElement.disabled = true;
        buttonElement.title = "Text-to-speech not supported in your browser";
        buttonElement.classList.add("disabled");
        return;
    }
    
    // Map to proper speech language code
    const speechLang = mapToSpeechLang(langCode);
    
    // Get language name for tooltip
    const langName = languages.find(lang => lang.code === langCode)?.name || langCode;
    
    // Use cached voices or get them again if needed
    const voices = availableTtsVoices.length > 0 ? availableTtsVoices : window.speechSynthesis.getVoices();
    
    // No voices available at all
    if (voices.length === 0) {
        buttonElement.disabled = true;
        buttonElement.title = "No text-to-speech voices available";
        buttonElement.classList.add("disabled");
        return;
    }
    
    // Try to find a native voice for this language
    // Check exact match first
    let hasNativeVoice = voices.some(voice => voice.lang.toLowerCase() === speechLang.toLowerCase());
    
    // If no exact match, check base language match
    if (!hasNativeVoice) {
        const baseLanguage = speechLang.toLowerCase().split('-')[0];
        hasNativeVoice = voices.some(voice => 
            voice.lang.toLowerCase().startsWith(baseLanguage)
        );
    }
    
    // If no native voice is available, any voice can be used as fallback
    // Always enable the button if there are any voices available
    if (hasNativeVoice) {
        // Native voice available
        buttonElement.disabled = false;
        buttonElement.title = "Listen";
        buttonElement.classList.remove("disabled");
    } else if (voices.length > 0) {
        // No native voice, but we can use any available voice as fallback
        buttonElement.disabled = false;
        buttonElement.classList.remove("disabled");
        buttonElement.title = `Listen (will use available voice for ${langName})`;
    } else {
        // No voices available at all
        buttonElement.disabled = true;
        buttonElement.title = `No text-to-speech available for ${langName}`;
        buttonElement.classList.add("disabled");
    }
}
