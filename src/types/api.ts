import { Word } from './word';

// Generic API Response
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

// Pagination
export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalWords?: number;
    totalLearned?: number;
    wordsPerPage: number;
}

// Words List Response
export interface WordsListResponse {
    words: Word[];
    pagination: Pagination;
}

// Words to Learn Response
export interface WordsToLearnResponse {
    words: Word[];
    count: number;
    totalLearned: number;
}

// Mark Word Learned Response
export interface MarkLearnedResponse {
    wordId: number;
    word: string;
    translation: string;
    frequency: number;
    totalWordsLearned: number;
    totalFrequencyKnown: number;
}

// Quran Verse Example
export interface QuranVerse {
    verse: string;
    translation: string;
    reference: string;
}

// Quran Search Result from Backend (matches Quran Foundation API structure)
// Quran Search Result from Backend (matches Quran Foundation API structure)
export interface QuranSearchResult {
    verse_key: string;
    text?: string;
    text_uthmani?: string;
    translations: Array<{
        id?: number;
        text: string;
        resource_id?: number;
    }>;
}

// Quran Examples Response
export interface QuranExamplesResponse {
    results?: QuranSearchResult[];
    search?: {
        results: QuranSearchResult[];
    };
}
