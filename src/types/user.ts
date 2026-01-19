// User Type Definition (matches backend schema)
export interface User {
    _id: string;
    firebaseUid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    learnedWords: number[];
    totalFrequencyKnown: number;
    createdAt: string;
    updatedAt: string;
    lastActive: string;
}

// User Statistics
export interface UserStats {
    totalWordsLearned: number;
    totalFrequencyKnown: number;
    memberSince: string;
    lastActive: string;
    totalAvailableWords: number;
    quranCoveragePercentage: number;
    progressPercentage: number;
    recentlyLearned: Array<{
        id: number;
        arabic: string;
        translation: string;
        transliteration: string;
        frequency: number;
    }>;
}
