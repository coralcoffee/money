# Web UI Readme

## Installation

- Install  NVM:

    [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

- Install  Node:

    ```powershell
    nvm install $(Get-Content .nvmrc)
    nvm use $(Get-Content .nvmrc)
    ```

- Install Typescript:

    ```bash
    npm install typescript -g
    ```

- Install Prettier Extension for VSCode.

   Search extensions for "Prettier - Code formatter"

- Install the node packages.

    ```bash
    npm install
    ```

- Run Development Server

    To run the UI development server at port 8080.  

    ```bash
    npm start
    ```

## Debugging with VSCode and Chrome

If you want to attach the VSCode debugger to chrome, you need to make sure to launch chrome with the argument `--remote-debugging-port=9222`.  Wherever you normally launch Chrome from, right-click on that shortcut and go to Properties -> Shortcut tab.  The Target should look like this: