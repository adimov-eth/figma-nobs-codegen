# Nobs CodeGen Figma Plugin

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Nobs CodeGen is a powerful Figma plugin that bridges the gap between design and development by automatically generating CSS code from your Figma designs. It extracts properties from various Figma node types and produces corresponding CSS, making the transition from design to implementation smoother and more efficient.

## Features

Nobs CodeGen offers a range of features to streamline your design-to-code workflow:

- **Multi-node Selection**: Extract CSS from multiple Figma nodes simultaneously.
- **Comprehensive Property Extraction**: Captures a wide range of design properties, including:
  - Position and size
  - Colors and gradients
  - Typography styles
  - Borders and shadows
  - Layout properties (for auto layout frames)
- **Customizable Output**: Choose between pixel (px) and relative (rem) units.
- **Batch Processing**: Efficiently handles large selections with progress reporting.
- **User-friendly Interface**: Easy-to-use plugin UI for configuration and code generation.

### Example Output

For a text node with specific styling, Nobs CodeGen might generate CSS like this:

```css
.my-text-element {
  position: absolute;
  left: 24px;
  top: 48px;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 1.5;
}
```

## Installation

1. Open the Figma desktop app
2. Navigate to `Plugins > Development > New Plugin`
3. Choose "Link existing plugin"
4. Select the `manifest.json` file from this project

## Usage

1. Select one or more nodes in your Figma design
2. Run the Nobs CodeGen plugin from the Plugins menu
3. In the plugin UI, configure your preferences (units, included properties, etc.)
4. Click the "Extract Data" button
5. Review the generated CSS in the plugin window
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

4. **Generating Code**:
   - Click "Extract Data" to start the code generation process
   - For large selections, you'll see a progress bar indicating the status

5. **Reviewing and Using the Code**:
   - The generated CSS will appear in the plugin window
   - Review the code for accuracy
   - Use the copy button or manually select and copy the code
   - Paste the code into your CSS file or style block in your project

## Configuration Options

Nobs CodeGen offers several configuration options to tailor the output to your needs:

- **Units**: Choose between pixels (px) or relative units (rem)
- **Include Position**: When enabled, generates `position`, `top`, and `left` properties
- **Include Size**: When enabled, generates `width` and `height` properties
- **Include Font Styles**: When enabled, generates typography-related properties
- **REM Base**: Set the pixel equivalent of 1rem (default is 16px)

These options can be adjusted in the plugin UI before generating the CSS.

## Troubleshooting

If you encounter any issues while using Nobs CodeGen, try these steps:

1. **Plugin not appearing**: Ensure the plugin is correctly installed and linked in Figma
2. **No CSS generated**: Make sure you have selected at least one node before running the plugin
3. **Unexpected CSS output**: Check your configuration settings and ensure they match your expectations
4. **Plugin crashing**: Try restarting Figma and reinstalling the plugin

If problems persist, please file an issue on the GitHub repository with a detailed description of the problem and steps to reproduce it.

## Changelog

### Version 1.0.0
- Initial release of Nobs CodeGen
- Features include CSS generation for multiple node types, configurable units, and batch processing

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

Contributions to Nobs CodeGen are welcome! Here's how you can contribute:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Contribution Guidelines

- Ensure your code adheres to the existing style for consistency
- Update the README.md with details of changes to the interface or new features
- Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent
- Your Pull Request will be reviewed by the maintainers, who may request changes or provide feedback

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

If you encounter any issues or have questions about using Nobs CodeGen, please:

1. Check the Troubleshooting section in this README
2. Look through existing issues on the GitHub repository
3. If your problem isn't addressed, please open a new issue with a clear description and steps to reproduce the problem

## Credits

Nobs CodeGen is developed and maintained by [Your Name/Organization]. We'd like to thank all contributors who have helped shape and improve this plugin.

---

Made with ❤️ by Ei Eye