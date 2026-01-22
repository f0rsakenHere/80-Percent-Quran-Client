// Verse Example from Quran API
export interface VerseExample {
    verse: string;
    translation: string;
    reference: string;
}

// Word Type Definition (matches backend schema)
export interface Word {
    _id: string;
    id: number;
    arabic: string;
    translation: string;
    english?: string; // Explicit English translation if available
    bangla?: string;  // Bengali translation
    transliteration: string;
    frequency: number;
    type: 'Noun' | 'Verb' | 'Particle' | 'Adjective' | 'Pronoun' | 'Preposition' | 'Other';
    createdAt: string;
    updatedAt: string;
    examples?: VerseExample[]; // Optional: fetched separately or attached
}

// Simplified Word (for lists)
export interface WordSummary {
    id: number;
    arabic: string;
    translation: string;
    transliteration: string;
    frequency: number;
}
