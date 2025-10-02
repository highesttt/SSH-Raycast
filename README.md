# Raycast SSH Extension [WINDOWS] 🖥️

</br>

This Raycast extension allows you to quickly SSH into your servers directly from Raycast.\
It provides a list of your configured SSH servers for quick access.\
The first time you run the extension, it will take some time to scan the root folder and cache the results. Subsequent runs will be faster as it uses cached data.\
You can also add custom SSH servers that are not in your SSH config file.
</br>
> Note: Make sure your server/s are added to the list of known hosts before using the extension to avoid any issues.

## Requirements 📝

- [Node.js](https://nodejs.org/) (>= 24)
- [Raycast](https://www.raycast.com/) (>= 0.26.3.0)
- A node package manager like [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) or [bun](https://bun.sh/)

## Installation 🚀

1. Clone the repository:

   ```bash
   git clone https://github.com/highesttt/SSH-Raycast.git 
   ```

2. Install dependencies:

   ```bash
   cd SSH-Raycast
   bun i
   ```

3. Start the development server:

   ```bash
   bun run dev
   ```

After running the above command, the extension should be available in Raycast, you can CTRL+C to stop the development server.

## Suggestions and Contributions 💡

If you have any suggestions for improvements or new features, feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/highesttt/SSH-Raycast).

## Commit norms 📝

Every commit message should be made using `git-cz` and should follow the `.git-cz.json` config file.

## Icons 🖼️

The icons used in this extension are from [Raycast's icon library](https://www.raycast.com/icons) and [DevIcons](https://devicon.dev/).
