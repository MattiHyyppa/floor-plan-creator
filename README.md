# Floor plan creator

The purpose of this project was to develop a frontend application for designing and drawing 2D floor plans for a house. The application was developed with TypeScript, React and Konva.js.

![Screenshot of the application](./images/screenshot.png)

## Features

The application includes the following features:

- [x] Drawing an L-shaped or a rectangular house on the canvas.
- [x] Adding other shapes, including interior and exterior doors, walls, windows and kitchen appliances.
- [x] Resizing and rotating the shapes added on the canvas.
- [x] Moving the shapes either by dragging a shape or by using the arrow keys.
- [x] Snapping effect when a shape is being dragged close to another shape to help moving the shape exactly next to the other shape.
- [x] Zooming in and out the canvas using buttons.
- [x] Undo and redo buttons to undo/redo previous canvas operations.
- [x] Exporting a floor plan project into a JSON file.
- [x] Importing an existing floor plan project from a JSON file.

## Quickstart

- Clone the repository from GitHub.

- `cd` to the project directory.

### With Docker

Docker and Docker Compose can be utilized for quickly setting up a development environment for the application.

- Build the application by running the command:
    ```
    docker compose -f docker-compose.dev.yaml build
    ```

- Run the application with the command:
    ```
    docker compose -f docker-compose.dev.yaml up
    ```
    The application will be available on http://localhost:5173.

### Without Docker

Alternatively, you can install the dependencies and run the application without Docker by following the steps below.

- Install [Node.js](https://nodejs.org/en/download). This project was developed with the Node.js version `22.18.0`.

- Install dependencies by running the command:
    ```
    npm install
    ```

- For running end-to-end tests using Playwright, you can install the supported browsers with the command:
    ```
    npx playwright install
    ```

- Run the application with the command:
    ```
    npm run dev
    ```
    The application will be available on http://localhost:5173.

## Running end-to-end tests

This project contains some end-to-end tests which have been implemented using [Playwright](https://playwright.dev/).

>NOTE: If you encounter problems when running the tests, check the [known issues section](#known-issues).

The tests can be run by launching the UI Mode with the command:
```
npm run test:e2e
```
Then, you can run all the tests by clicking the triangle icon in the sidebar. Notice that to be able to run E2E tests, you need to install the supported browsers as instructed in the [quickstart section](#quickstart).

You can also run the E2E tests in headless mode, which is useful in CI, for example. To run the tests in headless mode, use the command:
```
npm run test:e2e-ci
```
This command also requires that you have installed the supported browsers as described in the [quickstart section](#quickstart).

### With Docker

You can also run the E2E tests in headless mode using Docker and Docker Compose. E2E tests can be run using the following command:

```
docker compose -f docker-compose.dev.yaml run --rm frontend-dev npm run test:e2e-ci
```

## Deployment

To build the application for deployment, run the following command:
```
npm run build
```
This command will produce an application bundle which can be served over a static hosting service. The application bundle will be outputted to a `dist` directory.

## Known issues

- Some of the implemented end-to-end tests might be flaky and, therefore, if some of the tests fail, simply running them again could result in all tests being passed. This might result from timing issues and from the way the tests have been implemented because interacting with the shapes within a canvas does not work the same way as interacting with DOM elements (the contents of a canvas is just a bitmap and doesn't provide information about any drawn objects). Therefore, the tests rely on the assumption that the initial position of the shapes drawn on the canvas are known. This way, we can use mouse click events at those known positions and see how the user interface responds. For example, to test the dimensions of a shape added on the canvas, we could click the corner points of the shape one at a time and then see whether the shape was selected or not by checking if a menu for editing the shape become visible or not. There could be more elegant ways of writing the tests but this approach was selected because it was simple enough to get quickly started with experimenting with Playwright for this hobby project.
