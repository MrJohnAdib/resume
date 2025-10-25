import type { Resume } from './types';
import { ResumeRenderer } from './renderer';
import './style.css';

// Load resume data
async function loadResumeData(): Promise<Resume> {
  try {
    const response = await fetch('/data.json');
    if (!response.ok) {
      throw new Error('Failed to load resume data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading resume data:', error);
    throw error;
  }
}

// Get version from data
function getResumeVersion(data: Resume): string {
  return data.version.replace(/\./g, '');
}

// Setup PDF export
function setupPdfExport(data: Resume) {
  const pdfBtn = document.querySelector<HTMLButtonElement>('#pdf-btn');
  if (!pdfBtn) return;

  pdfBtn.addEventListener('click', () => {
    window.print();
  });

  // Change document title before print
  window.addEventListener('beforeprint', () => {
    const originalTitle = document.title;
    const version = getResumeVersion(data);
    document.title = `${data.metadata.author.replace(' ', '')}-Resume-${version}`;

    window.addEventListener('afterprint', () => {
      document.title = originalTitle;
    }, { once: true });
  });
}

// Apply theme to CSS variables
function applyTheme(data: Resume) {
  if (!data.theme) return;

  const root = document.documentElement;
  const theme = data.theme;

  root.style.setProperty('--color-primary', theme.primaryColor);
  root.style.setProperty('--color-secondary', theme.secondaryColor);
  root.style.setProperty('--color-accent', theme.accentColor);
  root.style.setProperty('--color-background', theme.backgroundColor);
  root.style.setProperty('--color-text', theme.textColor);
  root.style.setProperty('--color-text-light', theme.lightTextColor);
  root.style.setProperty('--color-border', theme.borderColor);

  if (theme.fontFamily) {
    root.style.setProperty('--font-family', theme.fontFamily);
  }
  if (theme.headingFontFamily) {
    root.style.setProperty('--font-family-heading', theme.headingFontFamily);
  }
}

// Initialize the resume
async function init() {
  try {
    // Show loading state
    const container = document.querySelector<HTMLDivElement>('#printArea');
    if (!container) {
      throw new Error('Container element not found');
    }

    container.innerHTML = '<div class="flex items-center justify-center h-full"><p class="text-stone-500">Loading resume...</p></div>';

    // Load data
    const data = await loadResumeData();

    // Apply theme
    applyTheme(data);

    // Render resume
    const renderer = new ResumeRenderer(data);
    container.innerHTML = renderer.render();

    // Setup PDF export
    setupPdfExport(data);

    // Update page metadata
    document.title = data.metadata.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', data.metadata.description);
    }

    console.log('Resume loaded successfully! 🎉');
    console.log(`Version: ${data.version}`);
    console.log(`Last updated: ${data.metadata.lastUpdated}`);
  } catch (error) {
    console.error('Failed to initialize resume:', error);
    const container = document.querySelector<HTMLDivElement>('#printArea');
    if (container) {
      container.innerHTML = `
        <div class="flex items-center justify-center h-full">
          <div class="text-center">
            <p class="text-red-600 font-semibold mb-2">Failed to load resume</p>
            <p class="text-stone-500 text-sm">Please check the console for more details</p>
          </div>
        </div>
      `;
    }
  }
}

// Start the application
init();
