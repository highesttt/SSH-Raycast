
export interface SSHServer {
  name: string;
  host: string;
  port: number;
  user?: string;
  privateKeyPath?: string;
  passphrase?: string;
  password?: string;
  extraFlags?: string;
}