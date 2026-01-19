import apiClient from '../api-client';
import { ApiResponse, MarkLearnedResponse, WordsListResponse } from '@/types';
import { UserStats } from '@/types';

/**
 * Mark word as learned
 * Protected endpoint
 */
export async function markWordLearned(wordId: number) {
    const response = await apiClient.post<ApiResponse<MarkLearnedResponse>>('/progress', {
        wordId,
    });
    return response.data;
}

/**
 * Get user statistics
 * Protected endpoint
 */
export async function getUserStats() {
    const response = await apiClient.get<ApiResponse<UserStats>>('/progress/stats');
    return response.data;
}

/**
 * Get all learned words
 * Protected endpoint
 */
export async function getLearnedWords(page: number = 1, limit: number = 50) {
    const response = await apiClient.get<ApiResponse<WordsListResponse>>('/progress/learned', {
        params: { page, limit },
    });
    return response.data;
}

/**
 * Remove word from learned list (unlearn)
 * Protected endpoint
 */
export async function unlearnWord(wordId: number) {
    const response = await apiClient.delete<ApiResponse<{
        wordId: number;
        totalWordsLearned: number;
        totalFrequencyKnown: number;
    }>>(`/progress/${wordId}`);
    return response.data;
}

/**
 * Batch add words as learned
 * Protected endpoint
 */
export async function batchMarkLearned(wordIds: number[]) {
    const response = await apiClient.post<ApiResponse<{
        addedCount: number;
        totalWordsLearned: number;
        totalFrequencyKnown: number;
    }>>('/progress/batch', {
        wordIds,
    });
    return response.data;
}
