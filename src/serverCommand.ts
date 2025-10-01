import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";
import { SSHServer } from "./interfaces/server";

/**
 * Opens a folder in the user's preferred editor.
 * If a custom editor is defined for the folder's language, it uses that command.
 * Otherwise, it uses the default editor command from preferences.
 * @param folder - The folder path to open.
 * @param language - Optional programming language to determine custom editor.
 */
export async function openServerInTerminal(server: SSHServer) {
  const prefs = getPreferenceValues<{ defaultShell: string, sshPath: string, configPath: string, defaultFlags: string }>();
  const paraphrase = server.passphrase ? ` -o "IdentityFile=${server.privateKeyPath}" -o "PubkeyAuthentication=yes" -o "PasswordAuthentication=no" -o "KbdInteractiveAuthentication=no" -o "PreferredAuthentications=publickey"` : "";
  const password = server.password ? ` -o "PubkeyAuthentication=no" -o "PasswordAuthentication=yes" -o "KbdInteractiveAuthentication=no" -o "PreferredAuthentications=password"` : "";
  const privateKey = server.privateKeyPath ? ` -i ${server.privateKeyPath}` : "";
  const extraFlags = server.extraFlags ? ` ${server.extraFlags}` : "";
  let cmd = `${prefs.defaultShell} -c '${prefs.sshPath} ${prefs.defaultFlags} -F ${prefs.configPath} ${server.user ? `${server.user}@` : ""}${server.host} ${server.port ? `-p ${server.port}` : ""}${privateKey}${paraphrase}${password}${extraFlags}'`;
  try {
    const execAsync = promisify(exec);

    console.log("Executing shell command:", cmd);
    await execAsync(cmd);

    await showToast({
      style: Toast.Style.Success,
      title: "Opening Server",
      message: `Opened ${server.name}`,
    });
  } catch (error) {
    console.error("Error opening server in terminal:", error);

    await showToast({
      style: Toast.Style.Failure,
      title: "Error Opening Server",
      message:
        error instanceof Error ? error.message : `Failed to execute: ${cmd}`,
    });
  }
}
