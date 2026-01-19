import apiClient from '../api-client';
import { ApiResponse, WordsListResponse, WordsToLearnResponse } from '@/types';
import { Word } from '@/types';

/**
 * Get all words with optional filters
 * Public endpoint (no auth required)
 */
export async function getWords(params?: {
    page?: number;
    limit?: number;
    type?: string;
    minFreq?: number;
    maxFreq?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
}) {
    const response = await apiClient.get<ApiResponse<WordsListResponse>>('/words', { params });
    return response.data;
}

/**
 * Get single word by ID
 * Public endpoint
 */
export async function getWordById(id: number) {
    const response = await apiClient.get<ApiResponse<Word>>(`/words/${id}`);
    return response.data;
}

/**
 * Search words
 * Public endpoint
 */
export async function searchWords(query: string, limit: number = 20) {
    const response = await apiClient.get<ApiResponse<{ words: Word[]; count: number; query: string }>>(`/words/search/${query}`, {
        params: { limit },
    });
    return response.data;
}

/**
 * Get next words to learn (not in learned list)
 * Protected endpoint - requires auth
 */
export async function getWordsToLearn(limit: number = 10) {
    const response = await apiClient.get<ApiResponse<WordsToLearnResponse>>('/words/learn', {
        params: { limit },
    });
    return response.data;
}
