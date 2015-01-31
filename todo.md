# Essentials
- [x] Insert Bibliography at the cursor position
- [x] Scan for citations when Document is openned/changed in the Editor and the document is TEXT/MD File
- [x] Scan the document for [@..] refs
- [ ] If Zotero is not running, Show msg to run zotero

# Known Bugs
- [ ] If citeKeys not found, "Insert Biblio" inserts all the Zotero Library in the document

# Searching
- [ ] When searching Display warning "Items with no BibTeX key have been omitted". Give option to show.

# Keeping Bib File in Sync
- [ ] On Init, create a bib file in the project directory (the source bib)
- [ ] Always keep this file in sync with all the md/text files in the project directory (configurable) (Watch all MD/TXT files for changes)
- [ ] Whenever user adds an in-text cite, add corresponding  bib entry to the project bib file
- [ ] Any tampering with bib  file will display a warning (potential for breaking citeKeys in MD/TXT files)
- [ ] Don't remove entries from bib file. It will provide opportunity for deep comparison of bib entries for fixing changed citeKeys in MD/TXT (a dreadful situation)
- [ ] Option to generate a separate bib file for a particular MD/TXT file from the source bib

# Niceties/Goodies
- [ ] Highlight search text string in result list
- [ ] Notification bar at the top, just below the panel toolbar.
- [ ] Show "Scanning Document...[loading icon]" whenever zotero panel scans the document for in-text citations
- [ ] Show "Scanning...Success" or "Scanning...Error" on completion

# Misc
- [x] Submit PR for ZotPlus search functionality
- [x] Animated GIF showing how to use brackets zotero (LICEcap; online-convert.com)
- [x] Generate Bibliography in a separate `.bib` file
- [ ] Circumvent errors or throw meaningful errors
- [x] Scan for citation keys only when (1) Zotero.citations is empty for current document, and (2) Zotero.panel is shown,
- [x] Don't scan the same document if its been already scanned on hide/show of panel
