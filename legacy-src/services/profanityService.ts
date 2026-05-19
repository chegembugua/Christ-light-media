import { Filter } from 'bad-words';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ProfanityConfig {
  customWords: string[];
  action: 'block' | 'asterisk';
}

class ProfanityService {
  private filter: Filter;
  private customWords: string[] = [];
  public currentAction: 'block' | 'asterisk' = 'block';
  private configDocRef = doc(db, 'config', 'profanity');

  constructor() {
    this.filter = new Filter();
    this.init();
  }

  private async init() {
    // Try to load initial config
    try {
      const snap = await getDoc(this.configDocRef);
      if (snap.exists()) {
        const data = snap.data() as ProfanityConfig;
        this.updateConfig(data);
      } else {
        // Initialize with defaults if doesn't exist
        await setDoc(this.configDocRef, {
          customWords: [],
          action: 'block'
        });
      }
    } catch (e) {
      console.warn("Failed to load profanity config on init, using defaults.");
    }

    // Subscribe to changes
    onSnapshot(this.configDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as ProfanityConfig;
        this.updateConfig(data);
      }
    });
  }

  private updateConfig(data: ProfanityConfig) {
    if (data.customWords && Array.isArray(data.customWords)) {
       // Remove old custom words and add new ones
       this.filter.removeWords(...this.customWords);
       this.customWords = data.customWords;
       this.filter.addWords(...this.customWords);
    }
    if (data.action) {
       this.currentAction = data.action;
    }
  }

  containsProfanity(text: string): boolean {
    if (!text) return false;
    return this.filter.isProfane(text);
  }

  filterText(text: string): { cleanedText: string; hasProfanity: boolean; blockedWords: string[] } {
    if (!text) return { cleanedText: '', hasProfanity: false, blockedWords: [] };
    const hasProfanity = this.filter.isProfane(text);
    const cleanedText = this.filter.clean(text);
    
    // Naive way to find blocked words: compare original and cleaned by words.
    // bad-words just replaces with *.
    const blockedWords: string[] = [];
    if (hasProfanity) {
       const originalWords = text.split(/\s+/);
       const cleanedWords = cleanedText.split(/\s+/);
       for (let i = 0; i < originalWords.length; i++) {
          if (cleanedWords[i] && cleanedWords[i].includes('*')) {
              blockedWords.push(originalWords[i]);
          }
       }
    }

    return {
      cleanedText,
      hasProfanity,
      blockedWords
    };
  }

  async addCustomWord(word: string) {
    const newWords = [...this.customWords, word.toLowerCase()];
    await setDoc(this.configDocRef, { customWords: newWords, action: this.currentAction }, { merge: true });
  }

  async removeCustomWord(word: string) {
    const newWords = this.customWords.filter(w => w !== word.toLowerCase());
    await setDoc(this.configDocRef, { customWords: newWords, action: this.currentAction }, { merge: true });
  }

  async setAction(action: 'block' | 'asterisk') {
    await setDoc(this.configDocRef, { action }, { merge: true });
  }

  getCustomWords() {
    return this.customWords;
  }
}

export const profanityService = new ProfanityService();
