# Changelog

## Latest Updates

### ✅ A4 Page Visualization
- **Visual page breaks** - See exactly how content flows across A4 pages
- **Page indicators** - Page numbers shown on screen (bottom right)
- **Shadow separation** - Clear visual distinction between pages
- **Print-optimized** - Page breaks removed when printing

### ✅ 1-Column Standard Layout
- Professional tech resume format
- Content flows top to bottom
- Designed for 3+ pages
- Clean modern styling

### ✅ Smart Content Distribution
- **Page 1**: Header + first 3 jobs
- **Page 2**: Remaining experience (if needed)
- **Page 3**: Skills, Education, Awards, Volunteer

### ✅ Fully Customizable
- Control visibility of every element via JSON
- Flexible date formats (full, year, hidden)
- Show/hide tech stack per job
- Adjust items per page (currently 3)

## How Pages Work

### On Screen
- Each page is exactly **210mm × 297mm** (A4)
- Pages stacked vertically with spacing
- Shadow effects for depth
- Page numbers in bottom right corner

### When Printing
- Page breaks respected
- No shadows or visual decoration
- Phone number automatically shown
- Content flows naturally across pages

## Customization

### Adjust Items Per Page
Edit [src/renderer.ts](src/renderer.ts) line 340:

```typescript
const itemsPerPage = 3; // Change to 2, 4, or 5
```

### Hide Page Numbers
Add to [src/style.css](src/style.css):

```css
.page::after {
  display: none !important;
}
```

### Change Page Size
Edit [src/style.css](src/style.css):

```css
.page {
  width: 8.5in;    /* US Letter width */
  min-height: 11in; /* US Letter height */
}
```

## Technical Details

- **A4 Dimensions**: 210mm × 297mm (8.27" × 11.69")
- **Content Padding**: 12mm (3rem) on sides
- **Page Gap**: 20px between pages on screen
- **Page Counter**: CSS counter for automatic numbering
