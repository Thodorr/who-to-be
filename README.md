# Who To Be?

Who To Be? is an unofficial Progressive Web App for managing characters for the *How to be a Hero* tabletop ruleset.

The app supports several saved characters. Each character has a profile, attributes, conditions and an inventory.

## Features

- Create, select and delete characters
- Edit character details including name, profession, description
- Manage attributes in the Body, Mind and Social categories
- Spend and reclaim attribute points using the implemented cost thresholds
- Add conditions that modify an attribute category
- Add, remove and reorder inventory items

## Run locally

The application is located in `myApp`.

```bash
cd myApp
npm ci
npm run serve
```

## Build

```bash
cd myApp
npm run build
```

## Storage status

Character data is stored locally through Ionic Storage.

Saving currently does not work reliably on every device. This part of the project is being revised and should be fixed before relying on the app for an ongoing game.

## Technology

- Vue 3
- Ionic Vue 6
- TypeScript
- Vue Router
- Ionic Storage
