
import apiClient from '../api-client';
import { ApiResponse } from '@/types';
import { Story } from '@/types/story';

/**
 * Get all stories
 * Public endpoint
 */
export async function getStories() {
    const response = await apiClient.get<ApiResponse<Story[]>>('/stories');
    return response.data;
}

/**
 * Get a specific story by ID
 * Public endpoint
 */
export async function getStoryById(id: string) {
    const response = await apiClient.get<ApiResponse<Story>>(`/stories/${id}`);
    return response.data;
}

/**
 * Get a random story
 * Public endpoint
 */
export async function getRandomStory() {
    const response = await apiClient.get<ApiResponse<Story>>('/stories/random');
    return response.data;
}
