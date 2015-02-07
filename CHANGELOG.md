# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

The subsection are to be interpreted as defined [here](http://keepachangelog.com/).

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

## [0.1.1] - 2015-02-05

### Changed
- Refactored postprocessing of date field.

### Fixed
- Returning jQuery Promise from _request now.


## 0.1.0 - 2015-02-04
Initial release


[0.1.2]: https://github.com/baig/brackets-zotero/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/baig/brackets-zotero/compare/0.1.0...0.1.1