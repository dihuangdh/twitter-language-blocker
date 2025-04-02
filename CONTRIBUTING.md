# Contributing to Twitter Language Blocker

Thank you for your interest in contributing to Twitter Language Blocker! This guide will help you get started.

## Ways to Contribute

1. **Report bugs**: If you find a bug, please create an issue with details on how to reproduce it
2. **Suggest features**: Have ideas for new features? Open an issue to suggest them
3. **Improve documentation**: Help make our documentation better
4. **Submit code changes**: Fix bugs or add features by submitting pull requests

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/twitter-lingo-blocker.git
   cd twitter-lingo-blocker
   ```

2. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project folder

3. Make your changes to the code
   - The extension will automatically reload when you make changes to most files
   - For changes to the manifest.json, you'll need to reload the extension manually

## Pull Request Process

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Test your changes thoroughly
5. Submit a pull request with a clear description of the changes

## Code Guidelines

- Follow existing code style
- Comment your code when necessary
- Write clear commit messages
- Test your changes on multiple versions of Chrome if possible

## Adding Support for New Languages

To add support for a new language:

1. Add the language to the `languagePatterns` object in `content.js` with the appropriate Unicode character range
2. Add a checkbox option for the language in `popup.html`
3. Test that the detection works correctly

Example for adding Thai language support:

```javascript
// In content.js
const languagePatterns = {
  // ... existing languages
  thai: /[\u0E00-\u0E7F]/
};
```

```html
<!-- In popup.html -->
<div class="language-option">
  <input type="checkbox" id="thai" name="thai">
  <label for="thai">Thai (ภาษาไทย)</label>
</div>
```

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License. 