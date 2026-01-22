import apiClient from '../api-client';
import { ApiResponse, QuranExamplesResponse } from '@/types';

/**
 * Get verse examples containing a specific Arabic word
 * Public endpoint (proxied through backend)
 * Backend returns Bengali (161) translation by default
 * @param arabicWord - The Arabic word to search for
 * @param size - Number of results to return (default: 2)
 * @param translations - Comma-separated translation IDs (default: "161" for Bengali)
 */
export async function getQuranExamples(
    arabicWord: string,
    size: number = 2,
    translations: string = "161" // Bengali only
) {
    const response = await apiClient.get<ApiResponse<QuranExamplesResponse>>('/quran/examples', {
        params: {
            word: arabicWord,
            size,
            translations
        },
    });
    return response.data;
}

/**
 * Get specific verse details
 * Public endpoint
 */
export async function getVerseDetails(reference: string) {
    const response = await apiClient.get<ApiResponse<{
        verse: string;
        translation: string;
        chapter: number;
        verseNumber: number;
    }>>(`/quran/verse/${reference}`);
    return response.data;
}

/**
 * Check Quran API health
 * Public endpoint
 */
export async function checkQuranApiHealth() {
    const response = await apiClient.get<ApiResponse<{
        environment: string;
        authUrl: string;
        apiBaseUrl: string;
        tokenValid: boolean;
    }>>('/quran/health');
    return response.data;
}
