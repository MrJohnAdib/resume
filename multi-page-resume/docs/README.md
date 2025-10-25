# Multi-Page Resume System

A fully customizable, multi-page resume builder powered by TypeScript, Vite, and Tailwind CSS. Every element is controllable via JSON configuration with granular visibility controls.

## Features

✨ **Fully Customizable**
- Control visibility of every section, entry, bullet point, and tech stack item
- Flexible date formatting (full, year-only, or hidden)
- Customizable theme via CSS variables
- Support for 1 or 2 column layouts

📄 **Multi-Page Support**
- Automatic pagination for A4/Letter paper sizes
- Print-optimized CSS with smart page breaks
- Handles 1-3+ pages seamlessly

🎨 **Modern Stack**
- TypeScript for type safety
- Vite for fast development and builds
- Tailwind CSS for styling
- No framework dependencies (vanilla TypeScript)

📱 **Export Features**
- Print to PDF functionality
- Optimized print styles
- Automatic filename generation

## Quick Start

### Installation

```bash
cd multi-page-resume
npm install
```

### Development

```bash
npm run dev
```

This will start the Vite dev server and open your resume in the browser.

### Build

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Build

```bash
npm run preview
```

Preview the production build locally.

## Project Structure

```
multi-page-resume/
├── src/
│   ├── main.ts           # Entry point, loads data and initializes renderer
│   ├── renderer.ts       # Resume rendering engine
│   ├── types.ts          # TypeScript type definitions
│   └── style.css         # Main styles with Tailwind imports
├── public/
│   └── data.json         # Resume data (customize this!)
├── docs/
│   └── README.md         # This file
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```

## Configuration Guide

### JSON Structure

The resume data is stored in `public/data.json`. Here's the complete structure:

#### Metadata

```json
{
  "version": "1.0.0",
  "metadata": {
    "lastUpdated": "2025-10-25",
    "author": "Your Name",
    "title": "Your Name - Job Title - Resume",
    "description": "Brief description"
  }
}
```

#### Layout

```json
{
  "layout": {
    "columns": 1,        // 1 for standard tech resume, 2 for creative layout
    "pageSize": "A4"     // "A4" or "Letter"
  }
}
```

#### Visibility Control

Every element has a `show` boolean flag:

```json
{
  "show": true  // Set to false to hide this element
}
```

#### Date Configuration

Dates support three formats:

1. **Full format** (MM/YYYY):
```json
{
  "dates": {
    "start": "2024-12-16",
    "end": "present",
    "format": "full",
    "showDuration": true
  }
}
```

2. **Year only**:
```json
{
  "dates": {
    "start": "2024",
    "end": "2025",
    "format": "year",
    "showDuration": false
  }
}
```

3. **Single date** (for awards, etc.):
```json
{
  "date": {
    "start": "2024-12",
    "format": "year"
  }
}
```

4. **Hidden**:
```json
{
  "dates": {
    "format": "hidden"
  }
}
```

### Sections

#### Header

```json
{
  "header": {
    "show": true,
    "name": "Your Name",
    "title": "Your Job Title",
    "summary": [
      "First paragraph of your summary.",
      "Second paragraph if needed."
    ],
    "avatar": {
      "show": false,
      "url": "./img/avatar.jpg"
    },
    "links": [
      {
        "show": true,
        "url": "https://yourwebsite.com",
        "label": "yourwebsite.com",
        "icon": "./img/website.svg"
      }
    ],
    "contact": {
      "show": true,
      "email": "your.email@example.com",
      "phone": "+1 234 567 8900",
      "location": "City, Country",
      "badge": "Special Badge Text"
    }
  }
}
```

#### Professional Experience

```json
{
  "sections": {
    "experience": {
      "show": true,
      "title": "Professional Experience",
      "items": [
        {
          "show": true,
          "title": "Job Title",
          "company": "Company Name",
          "companyUrl": "https://company.com",
          "employmentType": "Full-time",
          "location": "City, Country",
          "dates": {
            "start": "2024-01-01",
            "end": "present",
            "format": "full",
            "showDuration": true
          },
          "bulletPoints": [
            {
              "show": true,
              "text": "Achievement or responsibility description."
            }
          ],
          "techStack": {
            "show": true,
            "items": [
              { "show": true, "name": "TypeScript" },
              { "show": true, "name": "React" }
            ]
          }
        }
      ]
    }
  }
}
```

#### Skills

```json
{
  "sections": {
    "skills": {
      "show": true,
      "title": "Skills",
      "data": {
        "show": true,
        "categories": [
          {
            "show": true,
            "title": "Programming Languages",
            "items": [
              { "show": true, "name": "TypeScript" },
              { "show": true, "name": "Python" }
            ]
          }
        ]
      }
    }
  }
}
```

#### Awards and Honors

```json
{
  "sections": {
    "awards": {
      "show": true,
      "title": "Awards and Honors",
      "data": {
        "show": true,
        "items": [
          {
            "show": true,
            "icon": "🏅",
            "title": "Award Name",
            "organization": "Organization Name",
            "description": "Award description",
            "date": {
              "start": "2024",
              "format": "year"
            }
          }
        ]
      }
    }
  }
}
```

#### Education

```json
{
  "sections": {
    "education": {
      "show": true,
      "title": "Education",
      "data": {
        "show": true,
        "items": [
          {
            "show": true,
            "degree": "M.S. in Computer Science",
            "institution": "University Name",
            "location": "City, Country",
            "dates": {
              "start": "2020",
              "end": "2022",
              "format": "year"
            },
            "thesis": {
              "show": false,
              "title": "Thesis title if applicable"
            },
            "coursework": {
              "show": false,
              "items": [
                { "show": true, "name": "Machine Learning" }
              ]
            }
          }
        ]
      }
    }
  }
}
```

#### Volunteer Work

```json
{
  "sections": {
    "volunteer": {
      "show": true,
      "title": "Volunteer Work",
      "data": {
        "show": true,
        "items": [
          {
            "show": true,
            "title": "Volunteer Role",
            "organization": "Organization Name",
            "organizationUrl": "https://org.com",
            "location": "City, Country",
            "dates": {
              "start": "2024-01",
              "end": "present",
              "format": "full",
              "showDuration": false
            },
            "bulletPoints": [
              {
                "show": true,
                "text": "Description of volunteer work."
              }
            ]
          }
        ]
      }
    }
  }
}
```

## Customization

### Theming

You can customize colors and fonts in two ways:

#### 1. Via CSS Variables (Recommended)

Edit `src/style.css`:

```css
:root {
  --color-primary: #0891b2;
  --color-secondary: #44403c;
  --color-accent: #06b6d4;
  --color-background: #ffffff;
  --color-text: #1c1917;
  --color-text-light: #78716c;
  --color-border: #e7e5e4;
  --font-family: 'Airbnb Cereal App', ui-sans-serif, system-ui;
}
```

#### 2. Via JSON Theme Config (Optional)

Add a `theme` object to your `data.json`:

```json
{
  "theme": {
    "primaryColor": "#0891b2",
    "secondaryColor": "#44403c",
    "accentColor": "#06b6d4",
    "backgroundColor": "#ffffff",
    "textColor": "#1c1917",
    "lightTextColor": "#78716c",
    "borderColor": "#e7e5e4",
    "fontFamily": "Airbnb Cereal App, ui-sans-serif",
    "headingFontFamily": "Airbnb Cereal App, ui-sans-serif"
  }
}
```

### Tailwind Configuration

Customize Tailwind settings in `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
      },
      fontFamily: {
        sans: ['Your Font', 'ui-sans-serif'],
      },
    },
  },
};
```

## Print & PDF Export

### Browser Print

Click the "Download PDF" button or use `Ctrl+P` / `Cmd+P` to print.

### Print Settings

For best results:
- **Margins**: None or Minimal
- **Background graphics**: Enabled
- **Scale**: 100%
- **Paper size**: A4 (or Letter if configured)

### Automatic Page Breaks

The system uses CSS `break-inside: avoid` to prevent awkward section breaks. Articles and sections stay together when possible.

## Advanced Usage

### Custom Rendering Logic

Edit `src/renderer.ts` to customize how sections are rendered:

```typescript
export class ResumeRenderer {
  // Add your custom rendering methods here

  renderCustomSection(): string {
    return `<div>Your custom HTML</div>`;
  }
}
```

### Custom Styles

Add custom styles to `src/style.css`:

```css
/* Custom print styles */
@media print {
  .my-custom-class {
    /* Your styles */
  }
}
```

### Extending TypeScript Types

Add new types in `src/types.ts`:

```typescript
export interface CustomSection extends Visibility {
  customField: string;
}
```

## Troubleshooting

### Resume Not Loading

1. Check browser console for errors
2. Verify `public/data.json` is valid JSON
3. Ensure all required fields are present

### PDF Export Issues

1. Enable "Background graphics" in print settings
2. Set margins to "None" or "Minimal"
3. Ensure scale is 100%

### Styling Issues

1. Clear browser cache
2. Rebuild: `npm run build`
3. Check CSS custom properties are set correctly

## Tips & Best Practices

### Content Organization

1. **Keep it concise**: Aim for 2-3 pages maximum
2. **Prioritize**: Show most relevant experience first
3. **Use bullet points**: Keep them under 2 lines
4. **Tech stack**: Show only relevant technologies per role

### Visibility Flags

Use visibility flags strategically:
- Hide older/less relevant experience
- Show tech stack only for recent roles
- Hide coursework unless relevant to the position
- Toggle awards based on relevance

### Date Formatting

- **Jobs**: Use full format (MM/YYYY) with duration
- **Education**: Year only is usually sufficient
- **Awards**: Single date in year format
- **Old positions**: Consider hiding months

### Customization for Different Applications

Create multiple JSON files for different job applications:
- `data-frontend.json` - Frontend-focused
- `data-backend.json` - Backend-focused
- `data-fullstack.json` - Full-stack focused

Switch by updating the filename in `src/main.ts`:

```typescript
const response = await fetch('/data-frontend.json');
```

## Contributing

Feel free to fork this project and customize it for your needs! If you make improvements, consider sharing them.

## License

MIT License - Feel free to use this for your own resume!

## Credits

Created by John Adib
- Website: [MrAdib.com](https://mradib.com)
- GitHub: [@JohnAdib](https://github.com/JohnAdib)
- LinkedIn: [linkedin.com/in/MrAdib](https://linkedin.com/in/MrAdib)

## Support

If you find this helpful, consider:
- ⭐ Starring the [GitHub repository](https://github.com/johnAdib/resume)
- 🐛 Reporting issues or suggesting features
- 📢 Sharing with others who might benefit

---

Built with ❤️ using TypeScript, Vite, and Tailwind CSS
