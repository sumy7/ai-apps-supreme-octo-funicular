# Online Polaroid Canvas

An online Polaroid application focused on information density and operational efficiency.

[Online Demo](https://sumy7.github.io/ai-apps-supreme-octo-funicular/)

## Features

- **Virtual Polaroid Camera**: Real-time shooting using the browser camera.
- **Polaroid Style**: Automatically generates Polaroid-style photos with white borders and timestamps.
- **Free Canvas**: Photos can be freely dragged and stacked on the canvas like sticky notes.
- **Data Persistence**: Photo data is saved in the local browser and is not lost upon refresh.
- **Responsive Design**: Adapted for PC wide-screen layout, providing an immersive experience.
- **Pin Photos**: Click the pin button to fix the photo position and prevent accidental dragging.
- **Download Photos**: Supports downloading individual photos to local storage.
- **Delete Function**: Drag photos to the trash bin area to delete them.

## Tech Stack

- React 19
- TypeScript
- Vite 7
- Tailwind CSS
- Lucide React (Icon Library)
- React Draggable (Drag and Drop Interaction)
- pnpm (Package Manager)

## Development Requirements

- Node.js >= 18
- pnpm >= 8

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/sumy7/ai-apps-supreme-octo-funicular.git
   cd ai-apps-supreme-octo-funicular
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Build for production:
   ```bash
   pnpm build
   ```

5. Preview production build:
   ```bash
   pnpm preview
   ```

6. Lint code:
   ```bash
   pnpm lint
   ```

## Usage Instructions

1. Click the camera icon in the top right corner to open the shooting interface.
2. Allow browser access to the camera.
3. Click the red shutter button to take a photo.
4. The photo will be automatically added to the canvas.
5. Drag photos to adjust their position; hover over them to reveal the delete button.
6. Click the pin icon to pin/unpin photos.
7. Click the download icon to save the photo locally.
8. Drag photos to the trash bin area to delete them.

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Photo.tsx              # Photo Component
│   │   ├── SkeuomorphicCamera.tsx # Skeuomorphic Camera Component
│   │   └── SkeuomorphicTrash.tsx  # Skeuomorphic Trash Component
│   ├── App.tsx                     # Main Application Component
│   ├── App.css                     # Application Styles
│   ├── index.css                   # Global Styles
│   └── main.tsx                    # Application Entry
├── public/                          # Static Assets
├── package.json                     # Project Configuration
└── vite.config.ts                  # Vite Configuration
```

## Deployment

This project is automatically deployed to GitHub Pages via GitHub Actions. When code is pushed to the `main` branch, the build and deployment process is automatically triggered.

## Browser Compatibility

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Requires WebRTC API support (for camera access)

## License

MIT

## Contribution

Issues and Pull Requests are welcome!
