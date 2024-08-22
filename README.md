# Nobs CodeGen Figma Plugin

Nobs CodeGen is a Figma plugin that generates code from your designs. It extracts properties from Figma nodes and generates corresponding CSS and HTML code, making it easier to transition from design to development.

## Features

- Extracts properties from various Figma node types
- Generates CSS code based on node properties
- Supports multiple node selection
- Provides a user-friendly interface for code generation

## Installation

1. Open the Figma desktop app
2. Go to `Plugins > Development > New Plugin`
3. Choose "Link existing plugin"
4. Select the `manifest.json` file from this project

## Usage

1. Select one or more nodes in your Figma design
2. Run the Nobs CodeGen plugin from the Plugins menu
3. Click the "Extract Data" button in the plugin UI
4. View the generated code in the plugin window
5. Copy the code to use in your project

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

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

---

Made with ❤️ by ei eye