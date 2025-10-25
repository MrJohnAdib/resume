// Date configuration types
export type DateFormat = 'full' | 'year' | 'hidden';

export interface DateConfig {
  start?: string; // ISO format: YYYY-MM-DD or YYYY
  end?: string; // ISO format: YYYY-MM-DD, YYYY, or 'present'
  format?: DateFormat; // How to display dates
  showDuration?: boolean; // Show calculated duration
}

// Visibility control for all elements
export interface Visibility {
  show: boolean;
}

// Header section
export interface Link extends Visibility {
  url: string;
  label: string;
  icon?: string; // Optional icon path
}

export interface ContactInfo extends Visibility {
  email?: string;
  phone?: string;
  location?: string;
  badge?: string; // e.g., "UK Global Talent Visa Holder"
}

export interface Header extends Visibility {
  name: string;
  title: string;
  summary: string[]; // Array of summary paragraphs
  links: Link[];
  contact: ContactInfo;
  avatar?: {
    show: boolean;
    url?: string;
  };
}

// Professional Experience
export interface BulletPoint extends Visibility {
  text: string;
}

export interface TechStackItem extends Visibility {
  name: string;
}

export interface Experience extends Visibility {
  title: string;
  company: string;
  companyUrl?: string;
  employmentType?: string; // Full-time, Part-time, Freelance
  location?: string;
  dates: DateConfig;
  bulletPoints: BulletPoint[];
  techStack?: {
    show: boolean;
    items: TechStackItem[];
  };
}

// Skills section
export interface SkillCategory extends Visibility {
  title: string;
  items: TechStackItem[];
}

export interface Skills extends Visibility {
  categories: SkillCategory[];
}

// Awards and Honors
export interface Award extends Visibility {
  title: string;
  organization: string;
  description: string;
  date: DateConfig;
  icon?: string; // emoji or icon
}

export interface Awards extends Visibility {
  items: Award[];
}

// Education
export interface Education extends Visibility {
  degree: string;
  institution: string;
  location?: string;
  dates: DateConfig;
  thesis?: {
    show: boolean;
    title?: string;
  };
  coursework?: {
    show: boolean;
    items: TechStackItem[];
  };
}

export interface EducationSection extends Visibility {
  items: Education[];
}

// Volunteer Work
export interface Volunteer extends Visibility {
  title: string;
  organization: string;
  organizationUrl?: string;
  location?: string;
  dates: DateConfig;
  bulletPoints: BulletPoint[];
}

export interface VolunteerSection extends Visibility {
  items: Volunteer[];
}

// Theme configuration
export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  lightTextColor: string;
  borderColor: string;
  fontFamily: string;
  headingFontFamily?: string;
}

// Main Resume structure
export interface Resume {
  version: string;
  metadata: {
    lastUpdated: string;
    author: string;
    title: string;
    description: string;
  };
  theme?: Theme;
  layout: {
    columns: 1 | 2; // 1 for standard tech resume, 2 for creative
    pageSize: 'A4' | 'Letter';
  };
  header: Header;
  sections: {
    experience: {
      show: boolean;
      title: string;
      items: Experience[];
    };
    skills: {
      show: boolean;
      title: string;
      data: Skills;
    };
    awards: {
      show: boolean;
      title: string;
      data: Awards;
    };
    education: {
      show: boolean;
      title: string;
      data: EducationSection;
    };
    volunteer: {
      show: boolean;
      title: string;
      data: VolunteerSection;
    };
  };
}
