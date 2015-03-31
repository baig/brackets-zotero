# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

The subsection are to be interpreted as defined [here](http://keepachangelog.com/).

[Unreleased][unreleased]

### Added
- Added `lint` task in gulpfile.js for linting using `JSHint` and code
  style checking using `JSCS`.

### Changed
- Updated gitignore.
- Linted and style checked all the code.
- `src/Document.js` cleaned up.
- Shortened `COMMAND` to `CMD`.
- Moved Command IDs from `src/utils/Constants` to `src/utils/Events`.

### Fixed
- Multiple Error Dialogs popping up when Zotero not running.

## [0.1.6] - 2015-03-19

### Added
- Click on a cite item in cite panel view highlights
  the citation in the document. Repeated clicking keeps
  highlighting the next citation if present and cycles
  back to the first after encountering the last citation.

### Changed
- Refactored Panel Views out of Panel.
- Replaced string event names with string constants in
  Events' namespace.
- Many other minor changes.
- Updated template for existing cites.

### Fixed
- Spaces in URL are replaced by %20 while loading icon
  resource in `src/ui/Panel.js`.
- ~~Changed Keybinding to **Alt-Z** becasue **Shift-Cmd-Z**
  is assigned to **Edit > Redo** in Mac OS~~.
- Changed PanelView.$panelView property to point to the
  respective panel-view content container.
- Keeping the same keybinding "Ctrl-Shift-Z" in Windows and
  Linux. Changing it to **Alt-Z** only in Mac OS because
  **Shift-Cmd-Z** is already assigned to **Edit > Redo**.

## [0.1.5] - 2015-02-11

### Fixed
- Fixed icon font issue.

## [0.1.4] - 2015-02-11

### Added
- Added **Panel View**, a widget that permits hosting a
  number of distinct views inside a **Panel**.
- Added a **Panel View** to show existing citations in
  the current document.
- Zotero icon in top left corner of the panel.
- Added Settings Dialog.

### Changed
- Search results are now displayed inside a Panel View.
- Enlarged and centered text inside notification bar.
- Contents of the toolbar pushed little bit to the right
  to align with the left edge of the Panel View.
- Moved the extension intialization code to `src/Main.js`.

### Removed
- Removed `utils/EventTranslator.js`. This module's
  functionality has been moved to `src/Main.js`.
- Removed superfluous require statements from `src/Zotero.js`.

### Fixed
- Fixed table column styles to not effect distribution
  of column space in Citation View.

## [0.1.3] - 2015-02-08

### Added
- Hovering over icon in Project panel displays name and
  keyboard shortcut.
- Attempt to search when Zotero is not running displays
  an error dialog with appropriate suggestions and a
  link to detailed instructions.
- User is notified if citation keys are found on document
  scan.
- Search terms are highlighted in the search results.

## [0.1.2] - 2015-02-06

### Added
- Multiple text insertions now possible while replacing
  existing selection.

### Changed
- Modified postprocessing of date from server response.
  Checking for date presence and that the regexp match
  is not null before assigning the date.
- Column widths of checkbox input, date, and authors are
  now fixed to certain proportion of the total width of
  the row.
- Change styling of Panel View Header buttons.

## [0.1.1] - 2015-02-05

### Changed
- Refactored postprocessing of date field.

### Fixed
- Returning jQuery Promise from _request now.


## 0.1.0 - 2015-02-04
Initial release

[unreleased]: https://github.com/baig/brackets-zotero/compare/0.1.6...HEAD
[0.1.6]: https://github.com/baig/brackets-zotero/compare/0.1.5...0.1.6
[0.1.5]: https://github.com/baig/brackets-zotero/compare/0.1.4...0.1.5
[0.1.4]: https://github.com/baig/brackets-zotero/compare/0.1.3...0.1.4
[0.1.3]: https://github.com/baig/brackets-zotero/compare/0.1.2...0.1.3
[0.1.2]: https://github.com/baig/brackets-zotero/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/baig/brackets-zotero/compare/0.1.0...0.1.1
