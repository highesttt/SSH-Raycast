/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Default Flags - Default flags to use when connecting to SSH servers */
  "defaultFlags": string,
  /** SSH Path - Custom ssh binary path */
  "sshPath": string,
  /** sshpdass Path - Custom sshpass binary path */
  "sshPassPath": string,
  /** Config Path - Path to your ssh config file */
  "configPath": string,
  /** Default Shell - Default shell to use when connecting to SSH servers */
  "defaultShell": string,
  /** Use Cygpath for ssh key paths - If you're using WSL, Cygwin or MSYS2, enable this to convert Windows paths to Unix paths for ssh key paths */
  "useCygpath": boolean
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `serverList` command */
  export type ServerList = ExtensionPreferences & {}
  /** Preferences accessible in the `manageServers` command */
  export type ManageServers = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `serverList` command */
  export type ServerList = {}
  /** Arguments passed to the `manageServers` command */
  export type ManageServers = {}
}

