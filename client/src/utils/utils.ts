interface SessionStorageFunc {
  (username: string, roomId: string): void;
}

const PLAYER_TOKEN_KEY = "playerToken";
const USERNAME_KEY = "username";
const ROOMID_KEY = "roomId";

export interface SessionStorageOutput {
  username: string | null;
  roomId: string | null;
}

export const setSessionStorage: SessionStorageFunc = (username, roomId) => {
  sessionStorage.setItem(USERNAME_KEY, username);
  sessionStorage.setItem(ROOMID_KEY, roomId);
  getOrCreatePlayerToken();
};

export const getOrCreatePlayerToken = () => {
  const existingToken = sessionStorage.getItem(PLAYER_TOKEN_KEY);

  if (existingToken) {
    return existingToken;
  }

  const nextToken =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  sessionStorage.setItem(PLAYER_TOKEN_KEY, nextToken);
  return nextToken;
};

export const clearSessionStorage = () => {
  sessionStorage.removeItem(USERNAME_KEY);
  sessionStorage.removeItem(ROOMID_KEY);
  sessionStorage.removeItem(PLAYER_TOKEN_KEY);
};

export const getSessionStorage = () => {
  const username = sessionStorage.getItem(USERNAME_KEY);
  const roomId = sessionStorage.getItem(ROOMID_KEY);

  if (username && roomId) return { username, roomId };
  return null;
};
