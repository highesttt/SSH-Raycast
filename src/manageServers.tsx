import {
  Action,
  ActionPanel,
  Form,
  Icon,
  List,
  showToast,
  Toast,
} from "@raycast/api";
import { useEffect, useState } from "react";
import { getCustomServers, setCustomServers } from "./utils/storage";
import { SSHServer } from "./interfaces/server";

/**
 * Server List component for managing user-defined SSH server connections.
 * Allows users to add, remove, and filter SSH servers based on their configurations.
 */
export default function ManageServers() {
  const [servers, setServers] = useState<SSHServer[]>([]);
  useEffect(() => {
    getCustomServers().then(setServers);
  }, []);
  const [searchText, setSearchText] = useState("");
  const [showForm, setShowForm] = useState(false);

  /**
   * Handles the removal of a custom editor from the list.
   * @param index - The index of the editor to remove.
   */
  function handleRemoveServer(index: number) {
    const updated = servers.filter((_, i) => i !== index);
    setServers(updated);
    setCustomServers(updated);
    showToast({
      style: Toast.Style.Success,
      title: "SSH Server Removed",
    });
  }

  /**
   * Handles the addition of a new SSH server.
   * @param values - The form values containing server details.
   */
  function handleAddServer(values: { name: string; host: string; port: number; user?: string; password?: string; passphrase?: string; sshKey?: string, extraFlags?: string }) {
    const name = values.name.trim();
    const host = values.host.trim();
    const port = values.port;
    const user = values.user?.trim();
    const password = values.password?.trim();
    const passphrase = values.passphrase?.trim();
    const sshKey = values.sshKey;
    const extraFlags = values.extraFlags?.trim();

    if (!name || !host || !port) {
      showToast({
        style: Toast.Style.Failure,
        title: "Missing Fields",
        message: "All fields are required.",
      });
      return;
    }
    const filtered = servers.filter((e) => e.name !== name);
    const newServer: SSHServer = {
      name: name,
      host: host,
      port: port,
      user: user,
      password: password,
      passphrase: passphrase,
      privateKeyPath: sshKey,
      extraFlags: extraFlags,

    };
    const updated = [...filtered, newServer];
    setServers(updated);
    setCustomServers(updated)
      .then(() => {
        showToast({
          style: Toast.Style.Success,
          title: "SSH Server Added",
          message: `${host}:${port}`,
        });
        setShowForm(false);
      })
      .catch((e) => {
        showToast({
          style: Toast.Style.Failure,
          title: "Error Adding Editor",
          message: String(e),
        });
      });
  }

  const filteredServers = servers.filter(
    (e) =>
      e.name.toLowerCase().includes(searchText) ||
      e.host.toLowerCase().includes(searchText) ||
      e.port.toString().includes(searchText) ||
      e.user?.toLowerCase().includes(searchText)
  );

  if (showForm) {
    return (
      <Form
        navigationTitle="Add SSH Server"
        actions={
          <ActionPanel>
            <Action.SubmitForm
              title="Add SSH Server"
              onSubmit={handleAddServer}
            />
            <Action title="Cancel" onAction={() => setShowForm(false)} />
          </ActionPanel>
        }
      >
        <Form.TextField
          id="name"
          title="Server Name"
          placeholder="e.g. My Server"
        />
        <Form.Separator />
        <Form.TextField
          id="host"
          title="Host"
          placeholder="e.g. 192.168.1.1"
        />
        <Form.TextField
          id="port"
          title="Port"
          placeholder="e.g. 22"
        />
        <Form.Separator />
        <Form.TextField
          id="user"
          title="User (optional)"
          placeholder="Enter your username"
        />
        <Form.TextField
          id="password"
          title="Password (optional)"
          placeholder="Enter your password"
        />
        <Form.Separator />
        <Form.TextField
          id="passphrase"
          title="Passphrase (optional)"
          placeholder="Enter your SSH key passphrase"
        />
        <Form.FilePicker
          id="sshKey"
          title="SSH Key (optional)"
          allowMultipleSelection={false}
        />
        <Form.Separator />
        <Form.TextField
          id="extraFlags"
          title="Extra Flags (optional)"
          placeholder="e.g. -o StrictHostKeyChecking=no"
        />
      </Form>
    );
  }

  return (
    <List
      searchBarPlaceholder="Filter by language or command..."
      onSearchTextChange={setSearchText}
      throttle
      actions={
        <ActionPanel>
          <Action
            title="Add Custom Editor"
            icon={Icon.Plus}
            onAction={() => setShowForm(true)}
          />
        </ActionPanel>
      }
    >
      <List.EmptyView
        title={searchText ? "No Custom Editors Found" : "No Custom Editors"}
        description={
          searchText
            ? `No results for "${searchText}"`
            : "Add a custom editor for a language."
        }
        icon={Icon.Gear}
      />
      {filteredServers.map((server, idx) => {
        return (
          <List.Item
            key={server.name}
            title={server.name}
            subtitle={`${server.host}:${server.port}`}
            icon={Icon.ComputerChip}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action
                    title="Remove Custom Server"
                    icon={Icon.Trash}
                    onAction={() => handleRemoveServer(idx)}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
