/**
 * Some end-to-end tests for checking that shapes can be added on the canvas.
 * Interacting with the contents of a canvas is a bit more difficult than with
 * regular DOM elements. These tests rely on the assumption that the position of
 * the shapes drawn on the canvas are known which enables using mouse click events
 * at those known positions.
 *
 * The file `src/redux/slices/canvasSlice.ts` contains a number of action creators
 * for adding shapes on the canvas and the initial top left position for all shapes
 * is (x, y) = (100, 100). Notice that there is a menu component located on the
 * left-hand side of the canvas and the width of the menu needs to be taken into
 * consideration when determining which position on the screen should be clicked.
 */

import { test, expect } from '@playwright/test';

import { cmToPixels } from '../src/utils';

const VIEWPORT_WIDTH = 1600;
const VIEWPORT_HEIGHT = 1000;

// Width of the menu component located on the left-hand side of the canvas.
// The viewport size has been set in `playwright.config.ts` to a fixed value, such
// that the menu width is a known value.
const MENU_WIDTH = 260;


test('initially no shape selected', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Edit' }).click();
  await expect(page.getByText('Select a shape to start editing.')).toBeVisible();
});


test('adding a rectangular house works', async ({ page }) => {
  await page.goto('/');

  // Add a rectangular house on the canvas
  await page.getByRole('tab', { name: 'Add' }).click();
  await expect(page.getByRole('heading', { name: 'House shapes' })).toBeVisible();
  await page.getByText('Rectangle').click();

  const initialTopLeftPosition = { x: 100, y: 100 };
  const xClick = MENU_WIDTH + initialTopLeftPosition.x + 1;
  const yClick = initialTopLeftPosition.y + 1;

  await page.mouse.click(xClick, yClick);

  // If the shape was successfully added on the canvas and clicking the shape worked,
  // a form for editing the shape should be now visible. The form contains a button
  // for deleting the shape.
  await expect(page.getByRole('button', { name: 'Delete object' })).toBeVisible();
});


test('rectangular house has correct dimensions', async ({ page }) => {
  // This test case tests clicking the 4 corners of the house

  await page.goto('/');

  // Add a rectangular house on the canvas
  await page.getByRole('tab', { name: 'Add' }).click();
  await page.getByText('Rectangle').click();

  const houseTopLeftPosition = {
    x: 100 + MENU_WIDTH,
    y: 100,
  };

  const expectedWidthMeters = 12;
  const expectedHeightMeters = 10;
  const expectedWidthPixels = cmToPixels(expectedWidthMeters * 100);
  const expectedHeightPixels = cmToPixels(expectedHeightMeters * 100);

  let xCorner = houseTopLeftPosition.x;
  let yCorner = houseTopLeftPosition.y;

  /********** TOP-LEFT CORNER **********/
  await page.mouse.click(xCorner + 1, yCorner + 1);

  // Clicking the shape should open a form for editing the shape.
  await expect(page.getByRole('button', { name: 'Delete object' })).toBeVisible();

  // Click the bottom-right corner of the canvas (which should be empty) to hide the form
  await page.mouse.click(VIEWPORT_WIDTH - 1, VIEWPORT_HEIGHT - 1);

  // Click a point that is right outside of the shape
  await page.mouse.click(xCorner - 1, yCorner - 1);

  // If no shape on the canvas was clicked, a catalogue of all available shapes should
  // be visible.
  await expect(page.getByRole('heading', { name: 'House shapes' })).toBeVisible();
  /********** TOP-LEFT CORNER **********/

  /********** TOP-RIGHT CORNER **********/
  xCorner = houseTopLeftPosition.x + expectedWidthPixels;
  yCorner = houseTopLeftPosition.y;
  await page.mouse.click(xCorner - 1, yCorner + 1);
  await expect(page.getByRole('button', { name: 'Delete object' })).toBeVisible();

  await page.mouse.click(VIEWPORT_WIDTH - 1, VIEWPORT_HEIGHT - 1);

  await page.mouse.click(xCorner + 1, yCorner - 1);
  await expect(page.getByRole('heading', { name: 'House shapes' })).toBeVisible();
  /********** TOP-RIGHT CORNER **********/

  /********** BOTTOM-LEFT CORNER **********/
  xCorner = houseTopLeftPosition.x;
  yCorner = houseTopLeftPosition.y + expectedHeightPixels;
  await page.mouse.click(xCorner + 1, yCorner - 1);
  await expect(page.getByRole('button', { name: 'Delete object' })).toBeVisible();

  await page.mouse.click(VIEWPORT_WIDTH - 1, VIEWPORT_HEIGHT - 1);

  await page.mouse.click(xCorner - 1, yCorner + 1);
  await expect(page.getByRole('heading', { name: 'House shapes' })).toBeVisible();
  /********** BOTTOM-LEFT CORNER **********/

  /********** BOTTOM-RIGHT CORNER **********/
  xCorner = houseTopLeftPosition.x + expectedWidthPixels;
  yCorner = houseTopLeftPosition.y + expectedHeightPixels;
  await page.mouse.click(xCorner - 1, yCorner - 1);
  await expect(page.getByRole('button', { name: 'Delete object' })).toBeVisible();

  await page.mouse.click(VIEWPORT_WIDTH - 1, VIEWPORT_HEIGHT - 1);

  await page.mouse.click(xCorner + 1, yCorner + 1);
  await expect(page.getByRole('heading', { name: 'House shapes' })).toBeVisible();
  /********** BOTTOM-RIGHT CORNER **********/
});


test('resizing a house works correctly', async ({ page }) => {
  await page.goto('/');

  // Add a rectangular house on the canvas
  await page.getByRole('tab', { name: 'Add' }).click();
  await page.getByText('Rectangle').click();

  const houseTopLeftPosition = {
    x: 100 + MENU_WIDTH,
    y: 100,
  };

  const initialWidthMeters = 12;
  const initialHeightMeters = 10;
  const initialWidthPixels = cmToPixels(initialWidthMeters * 100);
  const initialHeightPixels = cmToPixels(initialHeightMeters * 100);

  const increaseWidthByMeters = 2;
  const increaseWidthByPixels = cmToPixels(increaseWidthByMeters * 100);
  const expectedWidthMeters = initialWidthMeters + increaseWidthByMeters;

  const xCorner = houseTopLeftPosition.x;
  const yCorner = houseTopLeftPosition.y;

  await page.mouse.click(xCorner + 1, yCorner + 1);  // Select the shape

  // Move the mouse to the position of the transformer's anchor at the right edge of the shape.
  // Resize the shape using the anchor.
  await page.mouse.move(xCorner + initialWidthPixels, yCorner + initialHeightPixels / 2);
  await page.mouse.down();
  await page.mouse.move(xCorner + initialWidthPixels + increaseWidthByPixels, yCorner + initialHeightPixels / 2);
  await page.mouse.up();

  await expect(page.getByLabel('Exterior width')).toHaveValue(expectedWidthMeters.toString());
});


test('undo and redo buttons work', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('tab', { name: 'Add' }).click();
  await page.getByText('Rectangle').click();

  const houseTopLeftPosition = {
    x: 100 + MENU_WIDTH,
    y: 100,
  };

  // Click the shape to display the form
  await page.mouse.click(houseTopLeftPosition.x + 1, houseTopLeftPosition.y + 1);

  await expect(page.getByLabel('Exterior width')).toHaveValue('12');
  await page.getByLabel('Exterior width').fill('14');
  await expect(page.getByLabel('Exterior width')).toHaveValue('14');
  await page.getByLabel('Exterior width').fill('16');
  await expect(page.getByLabel('Exterior width')).toHaveValue('16');

  // Undo the change of the width from 14 to 16
  await page.getByTitle('Undo').click();
  await expect(page.getByLabel('Exterior width')).toHaveValue('14');

  // Redo the change
  await page.getByTitle('Redo').click();
  await expect(page.getByLabel('Exterior width')).toHaveValue('16');
});
