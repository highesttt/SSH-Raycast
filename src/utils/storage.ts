import { LocalStorage } from "@raycast/api";
import { STORAGE_KEY } from "../consts";
import { SSHServer } from "../interfaces/server";

/**
 * Retrieves the servers from local storage.
 * @returns A promise that resolves to an array of Server objects.
 */
export async function getCustomServers(): Promise<SSHServer[]> {
  try {
    const raw = await LocalStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw as string) : [];
  } catch {
    return [];
  }
}

/**
 * Saves the servers to local storage.
 * @param servers - The array of servers to save.
 */
export async function setCustomServers(servers: SSHServer[]) {
  await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
}