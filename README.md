# Brackets Zotero Plugin (beta)

Add In-Text Citations and Bibliographies in your Markdown text files in Brackets using Zotero. Uses pandoc citeproc style by default.

This extension heavily uses [Better Bib(La)TeX][1] and takes inspiration from [Zotero Markdown citations][3]. Thumbs up to [ZotPlus][2] for building such a versatile plugin.

To use this extension, like [Zotero Markdown citations][3], you need to install [Better BibTeX][1] plugin in Zotero and enable 'Enable export by HTTP' in preferences.


## GIF Demo

![Demo][gif]


## Main Features

- Scans txt/md documents for citations.

- Search your Zotero Library to select items to reference
    - "Ctrl+Shift+Z" to show Zotero Panel OR
    - Press Zotero Icon in the Project Panel

- Insert Citations in the Document
    - Uses Pandoc Markdown by default
    
- Insert Bibliography in the document
    
- Generate Bibliography in a separate BibTeX File


## Using the Extension

Download a custom Zotero Better BibTeX which provides search capabilities.

Enable Export on HTTPs in Better BibTex preferences.

Generate bibtex keys for all zotero items. If no bibtex key in "extra" field, the extension ill throw an error. See this for guide for making unique bibtex keys.


## Author

[Wasif Hasan Baig][4]


## License

Copyright &copy; 2015 Wasif Hasan Baig

Source code is released under the Terms and Conditions of [MIT License][5].

Please refer to the [License file][6] in the source code project directory.


[gif]: https://raw.githubusercontent.com/baig/brackets-zotero/master/demo.gif
[1]: https://github.com/ZotPlus/zotero-better-bibtex
[2]: https://github.com/ZotPlus
[3]: https://atom.io/packages/zotero-citations
[4]: https://twitter.com/wasifhasanbaig
[5]: http://opensource.org/licenses/MIT
[6]: https://github.com/baig/brackets-zotero/blob/master/LICENSE.txt

