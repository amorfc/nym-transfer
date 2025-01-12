const STORAGE_KEYS = {
  USER_ID: "nym_user_id",
} as const;

export const storage = {
  getUserId: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.USER_ID);
  },

  setUserId: (userId: string): void => {
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  },

  removeUserId: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
  },
};
