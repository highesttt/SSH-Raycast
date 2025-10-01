import {
  Action,
  ActionPanel,
  getPreferenceValues,
  Icon,
  List,
  Image,
} from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { useState } from "react";
import { openServerInTerminal } from "./serverCommand";
import { getCustomServers } from "./utils/storage";
import { SSHServer } from "./interfaces/server";

/**
 * Main function for the Raycast extension.\
 * \
 * Command to list folders containing .gitignore files.\
 * Allows users to open these folders in a custom editor.
 */
export default function Command() {
  const prefs = getPreferenceValues<Preferences>();
  const [searchText, setSearchText] = useState("");
  const [displayServers, setDisplayServers] = useState<SSHServer[]>([]);

  const servers = useCachedPromise(
    async () => {
      const customServers = await getCustomServers();
      setDisplayServers(customServers);
      return customServers;
    },
    [],
    {
      initialData: [],
      keepPreviousData: true,
      onError: (error) => console.error(error),
    }
  );

  return (
    <List
      onSearchTextChange={(searchText: string) =>
        setSearchText(searchText.toLowerCase())
      }
      throttle
    >
      <List.EmptyView
        title={
          "No results"
        }
        icon={Icon.ComputerChip}
      />
      {displayServers
        .filter((f) => {
          const lowerSearchText = searchText.toLowerCase();

          if (!lowerSearchText.trim()) return true;

          const searchTerms = lowerSearchText.trim().split(/\s+/);

          return searchTerms.every((term) => {
            return f.name.toLowerCase().includes(term) ||
              f.host.toLowerCase().includes(term) ||
              (f.user && f.user.toLowerCase().includes(term));
          });
        })
        .map((server) => (
          <List.Item
            key={server.name}
            id={server.name}
            title={server.name}
            subtitle={server.host + (server.port ? `:${server.port}` : "")}
            accessories={[{ text: server.user || "Unknown" }]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action
                    title="Open in Terminal"
                    icon={Icon.Terminal}
                    onAction={() =>
                      openServerInTerminal(server)
                    }
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))}
    </List>
  );
}
