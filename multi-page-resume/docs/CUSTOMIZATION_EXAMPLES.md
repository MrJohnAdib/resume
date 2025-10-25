# Customization Examples

Quick reference for common customization scenarios.

## Hiding Elements

### Hide a specific job's tech stack
```json
{
  "techStack": {
    "show": false,  // ← Set to false
    "items": [...]
  }
}
```

### Hide a bullet point
```json
{
  "bulletPoints": [
    {
      "show": false,  // ← Hide this specific point
      "text": "This won't appear"
    }
  ]
}
```

### Hide an entire section
```json
{
  "sections": {
    "volunteer": {
      "show": false,  // ← Hides entire volunteer section
      "title": "Volunteer work",
      "data": {...}
    }
  }
}
```

### Hide specific tech in a list
```json
{
  "items": [
    { "show": true, "name": "TypeScript" },
    { "show": false, "name": "PHP" },  // ← Won't appear
    { "show": true, "name": "Python" }
  ]
}
```

## Date Formatting Examples

### Full date with duration (jobs)
```json
{
  "dates": {
    "start": "2024-01-15",
    "end": "present",
    "format": "full",         // Shows: 01/2024 - Present
    "showDuration": true      // Shows: (1 year 2 months)
  }
}
```

### Year only (education)
```json
{
  "dates": {
    "start": "2020",
    "end": "2024",
    "format": "year",         // Shows: 2020 - 2024
    "showDuration": false
  }
}
```

### Single date (awards)
```json
{
  "date": {
    "start": "2024",
    "format": "year"          // Shows: 2024
  }
}
```

### Hide dates completely
```json
{
  "dates": {
    "format": "hidden"        // Dates won't appear
  }
}
```

## Theme Customization

### Change primary color
```css
/* In src/style.css */
:root {
  --color-primary: #3b82f6;  /* Blue instead of cyan */
}
```

### Change font
```css
/* In src/style.css */
:root {
  --font-family: 'Inter', sans-serif;
}
```

### Dark theme colors
```css
:root {
  --color-primary: #60a5fa;
  --color-background: #1f2937;
  --color-text: #f3f4f6;
  --color-text-light: #d1d5db;
}
```

## Layout Changes

### Two-column layout
```json
{
  "layout": {
    "columns": 2,  // Experience on left, skills/education on right
    "pageSize": "A4"
  }
}
```

### Letter size paper
```json
{
  "layout": {
    "columns": 1,
    "pageSize": "Letter"  // US Letter instead of A4
  }
}
```

## Content Variations

### Create job-specific versions

#### Frontend-focused (`data-frontend.json`)
```json
{
  "sections": {
    "skills": {
      "data": {
        "categories": [
          {
            "show": true,
            "title": "Frontend",
            "items": [
              { "show": true, "name": "React" },
              { "show": true, "name": "TypeScript" }
            ]
          },
          {
            "show": false,  // Hide backend skills
            "title": "Backend",
            "items": [...]
          }
        ]
      }
    }
  }
}
```

#### Backend-focused (`data-backend.json`)
```json
{
  "sections": {
    "skills": {
      "data": {
        "categories": [
          {
            "show": false,  // Hide frontend skills
            "title": "Frontend",
            "items": [...]
          },
          {
            "show": true,
            "title": "Backend",
            "items": [
              { "show": true, "name": "Node.js" },
              { "show": true, "name": "PostgreSQL" }
            ]
          }
        ]
      }
    }
  }
}
```

### Show tech stack only for recent jobs
```json
{
  "items": [
    {
      "title": "Current Job",
      "techStack": {
        "show": true,  // Show for recent role
        "items": [...]
      }
    },
    {
      "title": "Old Job (5 years ago)",
      "techStack": {
        "show": false,  // Hide for old role
        "items": [...]
      }
    }
  ]
}
```

## Icons and Emojis

### Use emojis in awards
```json
{
  "awards": {
    "items": [
      {
        "icon": "🏆",  // Trophy emoji
        "title": "Award Name"
      },
      {
        "icon": "🥇",  // Gold medal
        "title": "Another Award"
      }
    ]
  }
}
```

### Remove emojis
```json
{
  "awards": {
    "items": [
      {
        "icon": "",  // Empty string = no icon
        "title": "Award Name"
      }
    ]
  }
}
```

## Contact Information

### Show phone only in print
The phone number automatically shows when printing. To hide it completely:

```json
{
  "contact": {
    "phone": "",  // Leave empty or null
  }
}
```

### Hide badge
```json
{
  "contact": {
    "badge": ""  // No badge text
  }
}
```

## Summary Variations

### Single paragraph
```json
{
  "summary": [
    "One comprehensive paragraph summarizing your experience."
  ]
}
```

### Multiple paragraphs
```json
{
  "summary": [
    "First paragraph about experience.",
    "Second paragraph about leadership.",
    "Third paragraph about achievements."
  ]
}
```

## Quick Tips

### For Senior Roles
- Show tech stack for last 2-3 jobs only
- Use year format for older positions
- Hide location if remote
- Emphasize leadership in bullet points

### For Entry Level
- Show all tech stack
- Include coursework in education
- Show volunteer work
- Use full date format to show recency

### For Career Change
- Emphasize transferable skills
- Reorder sections (skills before experience)
- Hide irrelevant old roles
- Show relevant volunteer work

### For Consulting/Freelance
- Show tech stack for every project
- Use single dates or year format
- Group similar projects
- Emphasize variety of technologies
