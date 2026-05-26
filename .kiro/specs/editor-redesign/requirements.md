# Requirements Document

## Introduction

The Altask visual editor (`editor.html` + `assets/js/editor.js` + `assets/css/editor.css`) currently provides a working drag-and-drop page builder with a two-column palette, a canvas, an inspector, undo/redo, device preview, localStorage persistence, and HTML export. The existing inspector exposes per-component named fields (e.g., "Title", "Subtitle", "Accent color"), which limits what users can adjust visually.

This feature redesigns the editor chrome and inspector to match a polished, light-themed reference layout while preserving the existing data model, persistence, and export pipeline. Visually, the editor gains a far-left brand icon rail, a refined top bar with project title / device toggle / zoom / Publish, a component library with Layouts/Elements tabs and thumbnail cards grouped by category, and a generic CSS-property inspector with collapsible sections (Spacing, Size, Position, Typography, Colors). Functionally, the inspector becomes a generic CSS editor that writes directly to the selected element's style, including a visual margin/padding box with per-side editing and a "linked" mode.

## Glossary

- **Editor**: The Altask visual page builder application running on `editor.html`.
- **Canvas**: The central scrollable workspace that renders the page being built as a white "sheet" inside the editor.
- **Page**: The user's in-progress document, modeled as an ordered list of Blocks persisted to localStorage.
- **Block**: A single component instance on the Page (e.g., a Hero, Navbar, Image), identified by a stable id, a component type, and a `props` object.
- **Component_Library**: The left panel that lists draggable components, organized by category and split into Layouts and Elements tabs.
- **Layout_Component**: A pre-composed full-width section (e.g., Hero, Footer, Cards Section) shown under the Layouts tab.
- **Element_Component**: An atomic primitive (e.g., Button, Text, Image, Input, Divider) shown under the Elements tab.
- **Component_Card**: A rectangular thumbnail tile in the Component_Library representing one Layout_Component or Element_Component.
- **Brand_Rail**: The narrow vertical icon strip on the far left of the editor containing the Altask brand mark and primary navigation icons.
- **Top_Bar**: The horizontal bar across the top of the editor containing project title, device toggle, zoom, undo/redo, preview, and Publish.
- **Inspector**: The right panel that exposes editable CSS properties for the currently selected Block.
- **Spacing_Editor**: The visual margin/padding box control inside the Inspector that shows four-sided values for `margin` and `padding` on the selected Block.
- **Selection**: The currently selected Block, indicated by a blue outline on the Canvas and reflected in the Inspector.
- **Device_Mode**: One of `desktop` (1440 px), `tablet` (768 px), or `mobile` (375 px); sets the rendered width of the Canvas sheet.
- **Zoom_Level**: The Canvas display scale, expressed as a percentage between 25% and 200% (inclusive).
- **History**: The undo/redo stack of full Page snapshots.
- **Persisted_State**: The serialized Page (Blocks, name, selected id) stored under `altask:editor-state-v1` in `localStorage`.
- **Publish**: The user-initiated action that opens the existing preview overlay populated with the exported HTML for the Page.
- **Style_Property**: A CSS declaration (e.g., `margin-top: 12px`, `font-family: Urbanist`) applied to a Block via the Inspector and stored on the Block's `props`.

## Requirements

### Requirement 1: Application Chrome Layout

**User Story:** As a designer using the editor, I want the editor's chrome to match the reference layout, so that the workspace looks polished and is easy to navigate.

#### Acceptance Criteria

1. THE Editor SHALL display a four-region layout consisting of a Brand_Rail on the far left, a Top_Bar across the top, a Component_Library panel left of the Canvas, the Canvas in the center, and an Inspector panel on the right.
2. THE Editor SHALL render the chrome on a light theme using the existing site CSS custom properties (`--bg`, `--bg-soft`, `--fg`, `--fg-muted`, `--border`, `--p-50`..`--p-700`) defined in `assets/css/base.css`.
3. THE Brand_Rail SHALL have a fixed width between 56 px and 72 px (inclusive).
4. THE Component_Library panel SHALL have a default width between 240 px and 280 px (inclusive).
5. THE Inspector panel SHALL have a default width between 260 px and 300 px (inclusive).
6. THE Top_Bar SHALL have a fixed height between 56 px and 72 px (inclusive).
7. WHEN the viewport width is less than 1024 px, THE Editor SHALL collapse the Component_Library and Inspector panels into toggleable drawers accessible from the Brand_Rail.
8. THE Editor SHALL preserve the existing application root markup file (`editor.html`) as the entry point and load `assets/css/editor.css` and `assets/js/editor.js`.

### Requirement 2: Brand Rail

**User Story:** As a designer, I want a vertical icon rail with the Altask mark and primary navigation, so that I can switch between editor modes without leaving the canvas.

#### Acceptance Criteria

1. THE Brand_Rail SHALL display the Altask brand mark at the top, anchored to the top edge of the rail.
2. THE Brand_Rail SHALL contain icon buttons in this order, top to bottom: Add component, Pages/Layers, Media/Assets, Search, Settings.
3. THE Brand_Rail SHALL display a Help icon and an account avatar pinned to the bottom of the rail.
4. WHEN the user clicks the Add component button on the Brand_Rail, THE Editor SHALL show the Component_Library panel and focus the Component_Library search input.
5. WHEN the user hovers an icon button on the Brand_Rail, THE Editor SHALL display a tooltip with the button's label within 300 ms.
6. WHEN the user clicks the Altask brand mark on the Brand_Rail, THE Editor SHALL navigate to `index.html`.
7. THE Brand_Rail SHALL indicate the active panel by applying a visually distinct active state to the corresponding icon button.

### Requirement 3: Top Bar

**User Story:** As a designer, I want a top bar that shows my project title, lets me change device and zoom, and exposes undo, redo, preview, and publish, so that I can manage the document and viewport from one place.

#### Acceptance Criteria

1. THE Top_Bar SHALL display an editable project title input on its left side, prefilled with the current project name.
2. THE Top_Bar SHALL display a non-editable subtitle line below the project title showing the publish URL placeholder (defaulting to `https://{project-slug}.altask.app` derived from the project title).
3. THE Top_Bar SHALL display a device toggle group with three buttons in this order: Desktop, Tablet, Mobile.
4. THE Top_Bar SHALL display a viewport readout in the format `{WIDTH} PX / {ZOOM}%`, where WIDTH is the current Device_Mode width and ZOOM is the current Zoom_Level.
5. THE Top_Bar SHALL display undo and redo icon buttons that invoke the existing History undo and redo operations.
6. THE Top_Bar SHALL display a share/copy-link icon button, a play/preview icon button, a Publish button, and a user avatar in that order on its right side.
7. WHEN the user clicks the Publish button, THE Editor SHALL open the existing preview overlay populated with the exported HTML for the Page.
8. WHEN the user clicks the play/preview icon button, THE Editor SHALL open the existing preview overlay populated with the exported HTML for the Page.
9. WHEN the user changes the project title input, THE Editor SHALL update the Page name in state, persist the change to Persisted_State, and update the publish URL placeholder.
10. IF the History has no undoable entry, THEN THE Editor SHALL render the undo button in a disabled state.
11. IF the History has no redoable entry, THEN THE Editor SHALL render the redo button in a disabled state.

### Requirement 4: Component Library Panel

**User Story:** As a designer, I want the component library split into Layouts and Elements tabs with searchable, categorized thumbnail cards, so that I can find and drag the right component quickly.

#### Acceptance Criteria

1. THE Component_Library SHALL display two tabs at the top labeled `Layouts` and `Elements`, with `Layouts` selected by default.
2. THE Component_Library SHALL display a single search input directly below the tab strip.
3. WHILE the `Layouts` tab is active, THE Component_Library SHALL render only Layout_Components grouped by category headings.
4. WHILE the `Elements` tab is active, THE Component_Library SHALL render only Element_Components grouped by category headings.
5. THE Component_Library SHALL render each component as a Component_Card containing a small uppercase caption above a rectangular thumbnail preview.
6. THE Component_Library SHALL render Component_Cards in a two-column grid within each category section.
7. THE Component_Library SHALL render category sections as collapsible groups with a chevron control on the section header.
8. WHEN the user enters text in the Component_Library search input, THE Editor SHALL filter visible Component_Cards (within the active tab) to those whose label or category matches the search text case-insensitively, within 100 ms of the input event.
9. WHEN the search input is non-empty and produces zero matches, THE Component_Library SHALL display an empty-state message reading `No components match "{query}"`.
10. WHEN the user clicks a tab, THE Component_Library SHALL switch the active tab and clear the search input.
11. THE Component_Library SHALL preserve the existing drag behavior so that dragging a Component_Card onto the Canvas inserts a new Block of the corresponding component type at the indicated position.
12. WHEN the user clicks a Component_Card, THE Editor SHALL append a new Block of that component type at the end of the Page and select the new Block.
13. THE Component_Library SHALL include all currently registered component types (`hero`, `heading`, `text`, `image`, `features`, `columns`, `quote`, `button`, `cta`, `footer`, `navbar`, `form`, `gallery`, `spacer`, `divider`) under either the Layouts or Elements tab.

### Requirement 5: Canvas Rendering

**User Story:** As a designer, I want the canvas to render my page as a white sheet on a light gray workspace and scroll smoothly, so that the canvas feels like a real document.

#### Acceptance Criteria

1. THE Canvas SHALL render the Page inside a centered white sheet with a soft drop shadow on a light gray (`--bg-soft`) workspace background.
2. THE Canvas SHALL set the rendered sheet width to 1440 px in `desktop` Device_Mode, 768 px in `tablet` Device_Mode, and 375 px in `mobile` Device_Mode.
3. WHEN the rendered sheet height exceeds the available Canvas viewport height, THE Canvas SHALL allow vertical scrolling within the workspace area.
4. WHEN the rendered sheet width at the current Zoom_Level exceeds the available Canvas viewport width, THE Canvas SHALL allow horizontal scrolling within the workspace area.
5. WHILE no Block is selected and the Page is empty, THE Canvas SHALL display the existing empty-state message inviting the user to drag a component.

### Requirement 6: Selection Indication and Handles

**User Story:** As a designer, I want a clear blue selection outline with handles on the selected element, so that I can see exactly what I'm editing.

#### Acceptance Criteria

1. WHEN the user clicks a Block on the Canvas, THE Editor SHALL set Selection to that Block and re-render the Inspector for the selected Block.
2. WHILE a Block is selected, THE Canvas SHALL render a 2 px solid blue outline (`--p-500`) around the selected Block and four corner handles.
3. WHEN the user clicks empty Canvas space outside any Block, THE Editor SHALL clear Selection and render the Inspector empty state.
4. WHEN the user presses `Escape` while a Block is selected and no input or contenteditable element is focused, THE Editor SHALL clear Selection.
5. WHEN Selection changes, THE Inspector SHALL update within one render frame to reflect the newly selected Block's properties.

### Requirement 7: Drag-and-Drop Insertion

**User Story:** As a designer, I want to drag components from the library onto the canvas with a clear insertion indicator, so that I always know where the new block will land.

#### Acceptance Criteria

1. WHEN the user drags a Component_Card over the Canvas, THE Editor SHALL display a 2.5 px blue drop indicator line at the nearest insertion point between Blocks.
2. WHEN the user drops a Component_Card onto the Canvas, THE Editor SHALL insert a new Block of that component type at the indicated insertion index, push a History entry, select the new Block, and persist Persisted_State.
3. WHEN the user drags an existing Block on the Canvas, THE Editor SHALL allow re-ordering by displaying the same drop indicator.
4. WHEN the user drops a re-ordered Block at a new position, THE Editor SHALL move the Block in the Page array, push a History entry, keep the Block selected, and persist Persisted_State.
5. IF the user releases the dragged item outside the Canvas drop zone, THEN THE Editor SHALL discard the drag without modifying the Page.

### Requirement 8: Inspector Layout

**User Story:** As a designer, I want the inspector grouped into collapsible CSS-style sections, so that the controls feel like a real design tool.

#### Acceptance Criteria

1. THE Inspector SHALL display the following sections in this order: Alignment, Spacing, Size, Position, Typography, Colors.
2. THE Inspector SHALL render a section header with a chevron control for each section that toggles the section's expanded state.
3. THE Inspector SHALL persist each section's expanded/collapsed state across renders within the same browser session.
4. WHILE no Block is selected, THE Inspector SHALL render an empty state with explanatory text and no section content.
5. THE Inspector SHALL render an alignment toolbar at the top of the panel containing icon buttons for horizontal alignment (left, center, right, justify) and vertical alignment / distribute actions.
6. WHEN the user changes any control inside the Inspector, THE Editor SHALL update the corresponding Style_Property on the selected Block, push a single History entry per edit session (focus to blur), persist Persisted_State, and re-render the Block on the Canvas without losing focus on the active Inspector control.

### Requirement 9: Spacing Editor (Margin and Padding)

**User Story:** As a designer, I want a visual margin and padding box editor with per-side input and a linked mode, so that I can adjust spacing the way I do in browser dev tools or Figma.

#### Acceptance Criteria

1. THE Spacing_Editor SHALL render two nested rectangles labeled `MARGIN` (outer) and `PADDING` (inner).
2. THE Spacing_Editor SHALL display four editable numeric fields on each rectangle, one per side (top, right, bottom, left), with a unit suffix selector defaulting to `px` and including `px`, `%`, `em`, `rem`, `auto`.
3. WHEN the user changes a side value in the Spacing_Editor, THE Editor SHALL update the corresponding `margin-{side}` or `padding-{side}` Style_Property on the selected Block.
4. THE Spacing_Editor SHALL display a chain/link toggle button on each rectangle that controls the linked mode for that rectangle.
5. WHILE linked mode is on for a rectangle, WHEN the user changes any side value on that rectangle, THE Spacing_Editor SHALL set the other three sides on the same rectangle to the same value.
6. WHEN the user enters the literal `auto` value into any margin side field, THE Editor SHALL set that `margin-{side}` to `auto`.
7. IF the user enters a non-numeric value other than `auto` into a side field, THEN THE Spacing_Editor SHALL revert the field to its prior value and SHALL NOT update the Style_Property.
8. THE Spacing_Editor SHALL accept negative numeric values for margin sides and reject negative values for padding sides by reverting them to `0`.

### Requirement 10: Size and Overflow Controls

**User Story:** As a designer, I want explicit width, height, and overflow controls in the inspector, so that I can size elements precisely.

#### Acceptance Criteria

1. THE Inspector SHALL render a Size section containing two numeric input fields labeled `Width` and `Height`, each paired with a unit dropdown that includes `px`, `%`, `vw`/`vh` (for width/height respectively), and `auto`.
2. WHEN the user changes the Width input, THE Editor SHALL update the `width` Style_Property on the selected Block.
3. WHEN the user changes the Height input, THE Editor SHALL update the `height` Style_Property on the selected Block.
4. THE Inspector SHALL render an Overflow row in the Size section with four icon buttons representing `visible`, `hidden`, `scroll`, and `auto`.
5. WHEN the user clicks an Overflow icon, THE Editor SHALL set the `overflow` Style_Property on the selected Block to the corresponding value and visually mark that icon as active.
6. THE Inspector SHALL display the Width and Height inputs prefilled with the selected Block's current computed `width` and `height` when the values were previously set via the Inspector.

### Requirement 11: Position Controls

**User Story:** As a designer, I want a position section to set how an element is placed in the layout, so that I can switch between flow, relative, and absolute positioning.

#### Acceptance Criteria

1. THE Inspector SHALL render a Position section that defaults to a collapsed state.
2. WHILE the Position section is expanded, THE Inspector SHALL display a position-mode dropdown with values `static`, `relative`, `absolute`, `fixed`, and `sticky`.
3. WHILE the Position section is expanded, THE Inspector SHALL display four numeric input fields with unit selectors for `top`, `right`, `bottom`, and `left`.
4. WHEN the user changes the position-mode dropdown, THE Editor SHALL update the `position` Style_Property on the selected Block.
5. WHEN the user changes any of the `top`, `right`, `bottom`, or `left` inputs, THE Editor SHALL update the corresponding Style_Property on the selected Block.

### Requirement 12: Typography Controls

**User Story:** As a designer, I want to control typography of any selected element, so that I can match my design system.

#### Acceptance Criteria

1. THE Inspector SHALL render a Typography section containing controls for Typeface, Font Weight, Font Size, and Text Align.
2. THE Inspector SHALL populate the Typeface dropdown with at least these options: `Inter`, `Urbanist`, `Playfair Display`, `Manrope`, `JetBrains Mono`, plus a `System default` option that clears the property.
3. THE Inspector SHALL populate the Font Weight dropdown with values `100` through `900` in steps of `100`.
4. THE Inspector SHALL render the Font Size as a numeric input with a unit dropdown (`px`, `rem`, `em`).
5. THE Inspector SHALL render an Align row with four icon buttons representing `left`, `center`, `right`, and `justify`.
6. WHEN the user changes any Typography control, THE Editor SHALL update the corresponding Style_Property (`font-family`, `font-weight`, `font-size`, `text-align`) on the selected Block.
7. WHEN the user selects `System default` for Typeface, THE Editor SHALL remove the `font-family` Style_Property from the selected Block.

### Requirement 13: Color Controls

**User Story:** As a designer, I want a colors section to set background and text color, so that I can theme any element from the inspector.

#### Acceptance Criteria

1. THE Inspector SHALL render a Colors section that defaults to a collapsed state.
2. WHILE the Colors section is expanded, THE Inspector SHALL display a Background color picker and a Text color picker, each with a hex text input alongside a native color picker swatch.
3. WHEN the user changes the Background color picker, THE Editor SHALL update the `background-color` Style_Property on the selected Block.
4. WHEN the user changes the Text color picker, THE Editor SHALL update the `color` Style_Property on the selected Block.
5. WHEN the user clears a color hex input (empty value), THE Editor SHALL remove the corresponding Style_Property from the selected Block.

### Requirement 14: Device Mode and Canvas Resize

**User Story:** As a designer, I want the device toggle to actually resize the canvas, so that I can preview how the page looks at desktop, tablet, and mobile widths.

#### Acceptance Criteria

1. WHEN the user clicks the Desktop button in the device toggle, THE Editor SHALL set Device_Mode to `desktop` and set the Canvas sheet width to 1440 px.
2. WHEN the user clicks the Tablet button in the device toggle, THE Editor SHALL set Device_Mode to `tablet` and set the Canvas sheet width to 768 px.
3. WHEN the user clicks the Mobile button in the device toggle, THE Editor SHALL set Device_Mode to `mobile` and set the Canvas sheet width to 375 px.
4. THE Editor SHALL animate the Canvas sheet width transition over 200 ms to 300 ms when Device_Mode changes.
5. THE Editor SHALL update the Top_Bar viewport readout to reflect the new Device_Mode width within one render frame of a Device_Mode change.
6. THE Editor SHALL persist Device_Mode in Persisted_State so that the last-used device is restored on reload.

### Requirement 15: Zoom Control

**User Story:** As a designer, I want to zoom the canvas, so that I can see the whole page or focus on a detail.

#### Acceptance Criteria

1. THE Editor SHALL provide a Zoom_Level control allowing values of `25%`, `50%`, `60%`, `75%`, `100%`, `125%`, `150%`, and `200%`.
2. WHEN the user selects a Zoom_Level value, THE Editor SHALL apply a CSS `transform: scale({zoom})` to the Canvas sheet, anchored at its top-center.
3. WHEN Zoom_Level changes, THE Editor SHALL update the Top_Bar viewport readout to reflect the new percentage within one render frame.
4. WHEN the user holds `Ctrl` (or `Cmd` on macOS) and scrolls the mouse wheel over the Canvas, THE Editor SHALL change Zoom_Level to the next discrete value in the corresponding direction.
5. THE Editor SHALL persist Zoom_Level in Persisted_State so that the last-used zoom is restored on reload.

### Requirement 16: Persistence and Backwards Compatibility

**User Story:** As a returning user, I want my existing saved page to load in the redesigned editor, so that I don't lose my work.

#### Acceptance Criteria

1. THE Editor SHALL continue to persist Persisted_State to `localStorage` under the key `altask:editor-state-v1`.
2. WHEN the Editor loads and a `altask:editor-state-v1` value is present, THE Editor SHALL deserialize it and render the existing Blocks, name, and selectedId on the Canvas.
3. WHERE the loaded state lacks the new fields `deviceMode`, `zoomLevel`, or per-block style props (`margin`, `padding`, etc.), THE Editor SHALL apply defaults (`desktop`, `100%`, no inline styles) without rejecting the state.
4. THE Editor SHALL preserve the existing Block schema (`id`, `type`, `props`) so that Blocks created prior to this redesign continue to render.
5. WHEN the Editor saves Persisted_State after a Style_Property change, THE Editor SHALL store the new style values inside the affected Block's `props` under reserved keys prefixed with `_style.` (e.g., `_style.margin-top`).

### Requirement 17: Undo and Redo

**User Story:** As a designer, I want every meaningful change to be undoable, so that I can experiment safely.

#### Acceptance Criteria

1. THE Editor SHALL push a History entry for each of the following user actions: insert Block, delete Block, duplicate Block, move/reorder Block, change Block content via inline edit (one entry per focus session), change a Style_Property via the Inspector (one entry per focus session), change project title (one entry per focus session), change Device_Mode, and change Zoom_Level.
2. WHEN the user clicks the undo button or presses `Cmd/Ctrl + Z`, THE Editor SHALL revert the Page to the previous History entry.
3. WHEN the user clicks the redo button or presses `Cmd/Ctrl + Shift + Z` (or `Cmd/Ctrl + Y`), THE Editor SHALL reapply the next History entry.
4. THE Editor SHALL retain at most 80 History entries and SHALL discard the oldest entry when the limit is exceeded.
5. WHEN a new History entry is pushed, THE Editor SHALL clear the redo stack.

### Requirement 18: Export and Publish

**User Story:** As a designer, I want export and publish to produce a clean HTML file matching what I see in the canvas, so that I can ship the page.

#### Acceptance Criteria

1. WHEN the user invokes the existing Export action, THE Editor SHALL generate a standalone HTML document that includes all Style_Property values applied via the Inspector as inline `style` attributes on the corresponding Block elements.
2. WHEN the user clicks the Publish button or the play/preview icon button, THE Editor SHALL open the existing preview overlay populated with the same generated HTML.
3. THE Editor SHALL strip editor-only attributes (`data-edit`, `data-id`, `contenteditable`) from the exported HTML.
4. THE Editor SHALL include the existing exported stylesheet (`exportedCss()`) in the exported document so that default block styles render in the exported file.
5. THE exported HTML SHALL set the `<title>` tag to the current Page name.

### Requirement 19: Inline Text Editing Preservation

**User Story:** As a designer, I want to keep clicking text in the canvas to edit it inline, so that the editing flow I already use keeps working after the redesign.

#### Acceptance Criteria

1. THE Editor SHALL preserve the existing inline contenteditable behavior for elements marked with `data-edit` inside rendered Blocks.
2. WHEN the user edits inline text in a Block, THE Editor SHALL update the corresponding `props` key on the Block and persist Persisted_State on each input event.
3. WHEN inline text editing begins (`focus` on a contenteditable element), THE Editor SHALL select the containing Block.
4. WHEN inline text editing ends (`blur`) and the text changed, THE Editor SHALL push a single History entry for the edit session.
5. WHILE an inline editable element is focused, THE Editor SHALL NOT clear Selection on Inspector control interactions.

### Requirement 20: Keyboard Shortcuts

**User Story:** As a designer, I want keyboard shortcuts for the most common actions, so that I can work without leaving the keyboard.

#### Acceptance Criteria

1. WHEN the user presses `Cmd/Ctrl + Z` and no input or contenteditable element is focused, THE Editor SHALL invoke undo.
2. WHEN the user presses `Cmd/Ctrl + Shift + Z` or `Cmd/Ctrl + Y` and no input or contenteditable element is focused, THE Editor SHALL invoke redo.
3. WHEN the user presses `Delete` or `Backspace` while a Block is selected and no input or contenteditable element is focused, THE Editor SHALL delete the selected Block, push a History entry, and clear Selection.
4. WHEN the user presses `Cmd/Ctrl + D` while a Block is selected and no input or contenteditable element is focused, THE Editor SHALL duplicate the selected Block, push a History entry, and select the duplicate.
5. WHEN the user presses `Escape` while a Block is selected and no input or contenteditable element is focused, THE Editor SHALL clear Selection.
