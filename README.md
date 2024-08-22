# Nobs CodeGen Figma Plugin

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Nobs CodeGen is a powerful Figma plugin that bridges the gap between design and development by automatically generating CSS and HTML code from your Figma designs. It extracts properties from various Figma node types and produces corresponding code, making the transition from design to implementation smoother and more efficient.

## Features

Nobs CodeGen offers a range of features to streamline your design-to-code workflow:

- **Multi-node Selection**: Extract code from multiple Figma nodes simultaneously.
- **Comprehensive Property Extraction**: Captures a wide range of design properties, including:
  - Position and size
  - Colors and gradients
  - Typography styles
  - Borders and shadows
  - Layout properties (for auto layout frames)
- **Customizable Output**: Choose between pixel (px) and relative (rem) units.
- **Batch Processing**: Efficiently handles large selections with progress reporting.
- **Structure Export**: Option to export the design structure as HTML, XML, or JSON.
- **Code Dividers**: Clear commented dividers for each root node in the generated code.
- **User-friendly Interface**: Easy-to-use plugin UI for configuration and code generation.

## Installation

1. Open the Figma desktop app
2. Navigate to `Plugins > Development > New Plugin`
3. Choose "Link existing plugin"
4. Select the `manifest.json` file from this project

## Usage

1. Select one or more nodes in your Figma design
2. Run the Nobs CodeGen plugin from the Plugins menu
3. In the plugin UI, configure your preferences (units, included properties, etc.)
4. Click the "Generate Code" button
5. Review the generated code in the plugin window
6. Copy the code to use in your project

### Detailed Steps

1. **Node Selection**: 
   - Single node: Click on any node in your Figma design
   - Multiple nodes: Hold Shift and click on multiple nodes, or drag to select an area

2. **Running the Plugin**:
   - Go to `Plugins > Nobs CodeGen` in the Figma menu
   - If you've used it recently, you can also find it under `Plugins > Recent`

3. **Configuration**:
   - Units: Choose between 'px' and 'rem'
   - Include Position: Toggle to include/exclude position properties
   - Include Size: Toggle to include/exclude size properties
   - Include Font Styles: Toggle to include/exclude typography properties
   - REM Base: Set the base pixel value for rem calculations (default is 16)
   - Export Structure Format: Choose between None, HTML, XML, or JSON

4. **Generating Code**:
   - Click "Generate Code" to start the code generation process
   - For large selections, you'll see a progress bar indicating the status

5. **Reviewing and Using the Code**:
   - The generated code will appear in the plugin window
   - CSS and HTML code will be separated with clear headings
   - Each root node (page) will have commented dividers for easy navigation
   - If selected, the structure export (HTML, XML, or JSON) will be included at the end
   - Use the copy button or manually select and copy the code
   - Paste the code into your project files as needed

## Example Output

For a design with multiple components, Nobs CodeGen might generate CSS and HTML like this:

```css
/* CSS */

/* -------------------- Header (Start) -------------------- */

.header {
  width: 100%;
  height: 80px;
  background-color: #f8f8f8;
}

.header .logo {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

/* -------------------- Header (End) -------------------- */

/* -------------------- Main Content (Start) -------------------- */

.main-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.main-content .title {
  font-size: 32px;
  margin-bottom: 16px;
}

/* -------------------- Main Content (End) -------------------- */
```

```html
<!-- HTML -->

<!-- -------------------- Header (Start) -------------------- -->

<div class="figma-node figma-frame header" data-id="1:2">
  <span class="node-name">Header</span>
  <div class="figma-node figma-text logo" data-id="1:3">
    <span class="node-name">Logo</span>
  </div>
</div>

<!-- -------------------- Header (End) -------------------- -->

<!-- -------------------- Main Content (Start) -------------------- -->

<div class="figma-node figma-frame main-content" data-id="1:4">
  <span class="node-name">Main Content</span>
  <div class="figma-node figma-text title" data-id="1:5">
    <span class="node-name">Title</span>
  </div>
</div>

<!-- -------------------- Main Content (End) -------------------- -->
```

## Configuration Options

Nobs CodeGen offers several configuration options to tailor the output to your needs:

- **Units**: Choose between pixels (px) or relative units (rem)
- **Include Position**: When enabled, generates `position`, `top`, and `left` properties
- **Include Size**: When enabled, generates `width` and `height` properties
- **Include Font Styles**: When enabled, generates typography-related properties
- **REM Base**: Set the pixel equivalent of 1rem (default is 16px)
- **Export Structure Format**: Choose between None, HTML, XML, or JSON for additional structure export

These options can be adjusted in the plugin UI before generating the code.

## Development Setup

To set up the project for development:

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/nobs-codegen.git
   cd nobs-codegen
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the plugin:
   ```
   npm run build
   ```

4. To watch for changes and rebuild automatically:
   ```
   npm run watch
   ```

## Contributing

Contributions to Nobs CodeGen are welcome! Please refer to the CONTRIBUTING.md file for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

If you encounter any issues or have questions about using Nobs CodeGen, please:

1. Check the Troubleshooting section in this README
2. Look through existing issues on the GitHub repository
3. If your problem isn't addressed, please open a new issue with a clear description and steps to reproduce the problem

## Changelog

### Version 1.1.0
- Added commented dividers for each root node in generated code
- Improved structure export options (HTML, XML, JSON)
- Enhanced batch processing for large selections

### Version 1.0.0
- Initial release of Nobs CodeGen
- Features include CSS and HTML generation for multiple node types, configurable units, and batch processing

## Credits

Nobs CodeGen is developed and maintained by [Your Name/Organization]. We'd like to thank all contributors who have helped shape and improve this plugin.

---

Made with ❤️ by Ei Eye