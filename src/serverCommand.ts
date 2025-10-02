import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";
import { SSHServer } from "./interfaces/server";

/**
 * Opens a given server in the terminal using SSH.
 * It constructs the SSH command based on user preferences and server details.
 * @param server - The SSH server details.
 * @returns A promise that resolves when the command is executed or rejects on error.
 */
export async function openServerInTerminal(server: SSHServer) {
  const prefs = getPreferenceValues<{
    defaultShell: string;
    sshPath: string;
    sshPassPath: string;
    configPath: string;
    defaultFlags: string;
    useCygpath: boolean;
  }>();
  var privateKeyPath = server.privateKeyPath;

  if (
    prefs.useCygpath &&
    server.privateKeyPath &&
    server.privateKeyPath.length > 0
  ) {
    privateKeyPath = await new Promise((resolve, reject) => {
      exec(`cygpath -a "${server.privateKeyPath}"`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }

  const paraphrase = server.passphrase
    ? ` -o "IdentityFile=${privateKeyPath}" -o "PubkeyAuthentication=yes" -o "PasswordAuthentication=no" -o "KbdInteractiveAuthentication=no" -o "PreferredAuthentications=publickey"`
    : "";
  const privateKey =
    privateKeyPath && privateKeyPath.length > 0 ? ` -i ${privateKeyPath}` : "";
  const extraFlags = server.extraFlags ? ` ${server.extraFlags}` : "";
  const password = server.password ? `sshpass -p '${server.password}' ` : "";
  if (!prefs.defaultFlags) prefs.defaultFlags = "";
  let cmd = `${prefs.defaultShell} -c '${password}${prefs.sshPath} ${prefs.defaultFlags} -F ${prefs.configPath} ${server.user ? `${server.user}@` : ""}${server.host} ${server.port ? `-p ${server.port}` : ""}${privateKey}${paraphrase}${extraFlags}'`;
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
