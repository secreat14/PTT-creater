# PPT editor plan

## Product model

The editor follows a slide-object model rather than a business-form model. A slide is a canvas containing ordered objects. Every visible text run that users can select is represented by one independent text-box object with exactly one editable content value. Images and future shapes use sibling object types. File origin, semantic title/summary labels and analysis metadata must not change how an object is selected or edited.

The current representative slide semantics remain an internal compatibility projection for search, reading summaries and speaker notes. They are not editor components and must not produce multi-field object panels.

## Object contract

Shared object fields planned for every canvas object:

- Stable object ID and object type.
- X, Y, width and height in slide-relative coordinates.
- Z order, lock state, visibility and rotation.
- One selected state and one focused editing state.
- Clone, delete, move, resize and serialize commands.

Text-box-specific fields:

- One content string.
- Font family, size, weight, style, decoration and color.
- Horizontal/vertical alignment, line spacing, paragraph spacing and list settings.
- Text-box fill, border, internal margins and auto-fit behavior.

Image-specific fields:

- Local session source, accessible description and intrinsic aspect ratio.
- Crop rectangle, transparency, border, rotation and replace action.

## Interaction rules

1. Single-click selects exactly one object; Shift-click will extend selection when multi-select is implemented.
2. Dragging a selected object moves it. Dragging handles resizes or rotates it.
3. Double-clicking a text box enters inline text editing for that box only. Double-clicking an image opens image replacement/crop behavior.
4. Escape exits text editing first, then clears selection. Delete removes selected objects outside text editing.
5. The right inspector always describes only the current selection. It never becomes a form containing the entire slide's content.
6. Toolbar actions create objects or run commands. They do not introduce special editing components for titles, summaries or bullets.
7. Thumbnails and Presenter mode render the same ordered object collection as the main canvas.

## Editing surface plan

### Implemented foundation

- Independent text boxes for headings, summaries, each key point and tag line.
- Insert, select, move, free-resize, delete and inline double-click editing.
- Per-text-box content, position, size, font size, weight, alignment and tone controls.
- Image insertion/drop, movement, proportional resize, replacement and deletion.
- Session-only thumbnail and Presenter-mode synchronization.

### Next: standard editing commands

- Command-based undo/redo history.
- Copy, cut, paste, duplicate and keyboard nudge.
- Multi-selection, alignment, distribution and grouping.
- Z-order commands, object list and lock/hide state.
- Smart guides, snapping, rulers and configurable grid.

### Next: complete object formatting

- Text family/style/color, paragraph/list controls, vertical alignment and auto-fit.
- Shape insertion, fill, border, transparency, rotation and connectors.
- Image crop, contain/cover modes, rotation, transparency and filters.
- Slide background, layout/master placeholders and theme tokens.

### Later: document fidelity

- PPT/PPTX parsing into the common object model.
- Asset persistence, save/export and reload.
- Compatibility mapping for unsupported Office effects, charts, tables, media and animations.

Until document persistence is implemented, editor changes and local image data remain in the current browser session and do not write the selected PPT/PPTX file.
