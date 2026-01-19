import apiClient from '../api-client';
import { ApiResponse, QuranExamplesResponse } from '@/types';

/**
 * Get verse examples containing a specific Arabic word
 * Public endpoint (proxied through backend)
 */
export async function getQuranExamples(arabicWord: string, size: number = 2) {
    const response = await apiClient.get<ApiResponse<QuranExamplesResponse>>('/quran/examples', {
        params: { word: arabicWord, size },
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
