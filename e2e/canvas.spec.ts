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

const menuBorderWidth = 1.5;

// Width of the menu component located on the left-hand side of the canvas.
// The viewport size has been set in `playwright.config.ts` to a fixed value, such
// that the menu width is a known value (260 pixels + 1.5 pixels for border-right)
const menuWidth = 260 + menuBorderWidth;

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
  const xClick = menuWidth + initialTopLeftPosition.x;
  const yClick = initialTopLeftPosition.y;

  await page.mouse.click(xClick, yClick);

  // If the shape was successfully added on the canvas and clicking the shape worked,
  // a form for editing the shape should be now visible. The form contains a button
  // for deleting the shape.
  await expect(page.getByRole('button', { name: 'Delete object' })).toBeVisible();
});
