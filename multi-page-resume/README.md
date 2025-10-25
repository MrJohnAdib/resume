# Multi-Page Resume System

A fully customizable **3-page resume builder** with 1-column standard tech resume layout. Built with TypeScript, Vite, and Tailwind CSS.

## ✨ Design Philosophy

This is a **multi-page resume** (not a single-page replica). Key differences from your current 1-page resume:

| Feature | Current 1-Page | This Multi-Page |
|---------|---------------|-----------------|
| Layout | 2 columns | **1 column** (standard tech resume) |
| Pages | 1 page | **3+ pages** |
| Content | Condensed | **Expandable with more details** |
| Purpose | Quick overview | **Comprehensive experience showcase** |

## Quick Start

```bash
cd multi-page-resume
npm install
npm run dev
```

Open `http://localhost:3000` - You'll see a clean 1-column resume ready to span multiple pages!

## Key Features

✅ **1-Column Standard Layout** - Professional tech resume format
✅ **Multi-Page Ready** - Content flows naturally across 3+ pages
✅ **Clean Modern Design** - Professional styling with clear hierarchy
✅ **Fully Customizable** - Control every element via JSON
✅ **Flexible Date Formats** - MM/YYYY, year only, or hidden
✅ **Print-Optimized** - Perfect PDF exports with smart page breaks

## What's Included

- **Professional Header**: Centered name, title, contact info, summary
- **Experience Section**: Full job history with bullets and tech stack
- **Skills Grid**: 2-column grid layout for easy scanning
- **Education**: Degree, institution, dates, optional thesis/coursework
- **Awards**: Achievements with icons and descriptions
- **Volunteer**: Community involvement and mentorship

## Customization

### Hide Elements

```json
{
  "show": false  // Hide any section, job, bullet point, or tech item
}
```

### Date Formats

```json
// Full format with duration
{ "dates": { "format": "full", "showDuration": true } }

// Year only
{ "dates": { "format": "year" } }

// Hidden
{ "dates": { "format": "hidden" } }
```

### Change Colors

```css
/* In src/style.css */
:root {
  --color-primary: #0891b2;  /* Change cyan to your brand color */
}
```

### Edit Content

All content is in [public/data.json](public/data.json) - just edit and save!

## Print to PDF

1. Click "Download PDF" button OR press `Ctrl+P` / `Cmd+P`
2. Settings:
   - Margins: **None**
   - Background graphics: **Enabled**
   - Scale: **100%**
3. Save as PDF

## Documentation

- 📖 **Complete Guide**: [docs/README.md](docs/README.md)
- 💡 **Examples**: [docs/CUSTOMIZATION_EXAMPLES.md](docs/CUSTOMIZATION_EXAMPLES.md)
- ⚡ **Quick Tips**: [QUICK_START.md](QUICK_START.md)

## File Structure

```
multi-page-resume/
├── public/
│   └── data.json          ← YOUR RESUME DATA (edit this!)
├── src/
│   ├── main.ts            ← App initialization
│   ├── renderer.ts        ← HTML generation
│   ├── types.ts           ← TypeScript types
│   └── style.css          ← Styles & theming
├── docs/                  ← Documentation
├── index.html
└── package.json
```

## Why 1-Column?

Standard tech resumes use 1-column layouts because:
- ✅ **ATS-Friendly** - Applicant Tracking Systems read them better
- ✅ **More Content** - Room for detailed descriptions
- ✅ **Better Flow** - Natural top-to-bottom reading
- ✅ **Multi-Page** - Easy to extend to 3+ pages
- ✅ **Professional** - Industry standard format

## Next Steps

1. `npm install` - Install dependencies
2. `npm run dev` - Start development server
3. Edit `public/data.json` - Add your content
4. Customize `src/style.css` - Adjust colors
5. Export to PDF - Use print button

## License

MIT - Free to use for your resume!

---

Built with ❤️ using TypeScript, Vite, and Tailwind CSS
