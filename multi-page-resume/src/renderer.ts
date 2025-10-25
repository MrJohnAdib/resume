import type {
  Resume,
  DateConfig,
  Experience,
  Award,
  Education,
  Volunteer,
  Skills,
  BulletPoint,
  TechStackItem,
} from './types';

export class ResumeRenderer {
  private data: Resume;

  constructor(data: Resume) {
    this.data = data;
  }

  // Format date based on configuration
  private formatDate(date: string | undefined, format: string = 'full'): string {
    if (!date) return '';

    const dateObj = new Date(date);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();

    if (format === 'year') {
      return year.toString();
    }

    if (format === 'full') {
      return `${month}/${year}`;
    }

    return '';
  }

  // Calculate duration between two dates
  private calculateDuration(config: DateConfig): string {
    if (!config.showDuration || !config.start) return '';

    const startDate = new Date(config.start);
    const endDate = config.end === 'present' ? new Date() : new Date(config.end || '');

    const years = endDate.getFullYear() - startDate.getFullYear();
    const months = endDate.getMonth() - startDate.getMonth();
    const totalMonths = years * 12 + months;
    const calculatedYears = Math.floor(totalMonths / 12);
    const calculatedMonths = totalMonths % 12;

    let durationText = '';

    if (calculatedYears > 0) {
      durationText = calculatedYears === 1 ? '1 year' : `${calculatedYears} years`;
      if (calculatedMonths > 0) {
        durationText += calculatedMonths === 1 ? ' 1 month' : ` ${calculatedMonths} months`;
      }
    } else {
      durationText = calculatedMonths === 1 ? '1 month' : `${calculatedMonths} months`;
    }

    return `(${durationText})`;
  }

  // Render date range
  private renderDateRange(config: DateConfig): string {
    if (config.format === 'hidden') return '';

    const startFormatted = this.formatDate(config.start, config.format);
    const endFormatted = config.end === 'present' ? 'Present' : this.formatDate(config.end, config.format);
    const duration = this.calculateDuration(config);

    if (!config.end) {
      return `<div class="text-xs text-stone-900">${startFormatted}</div>`;
    }

    return `
      <div class="flex items-center gap-2 text-xs">
        ${duration ? `<div class="text-stone-700">${duration}</div>` : ''}
        <div class="text-stone-900">
          <time datetime="${config.start}">${startFormatted}</time> -
          <time datetime="${config.end}">${endFormatted}</time>
        </div>
      </div>
    `;
  }

  // Render bullet points
  private renderBulletPoints(points: BulletPoint[]): string {
    const visiblePoints = points.filter(p => p.show);
    if (visiblePoints.length === 0) return '';

    return `
      <ul class="list-disc list-outside leading-[14px] text-xs ml-4 space-y-1.5">
        ${visiblePoints.map(point => `
          <li>
            <span class="text-stone-500 block">${point.text}</span>
          </li>
        `).join('')}
      </ul>
    `;
  }

  // Render tech stack
  private renderTechStack(items: TechStackItem[]): string {
    const visibleItems = items.filter(i => i.show);
    if (visibleItems.length === 0) return '';

    return visibleItems.map(item => `<span>${item.name}</span>`).join(', ');
  }

  // Render header section
  renderHeader(): string {
    if (!this.data.header.show) return '';

    const { name, title, summary, links, contact, avatar } = this.data.header;

    return `
      <header class="bg-white border-b-2 border-stone-200 pb-4 mb-6">
        <div class="max-w-4xl mx-auto px-12 pt-8">
          <div class="text-center">
            <h1 class="text-black text-4xl font-bold">${name}</h1>
            <h2 class="text-cyan-600 text-xl mt-2">${title}</h2>
          </div>

          ${contact.show ? `
            <div class="flex items-center justify-center gap-4 mt-4 text-sm text-stone-600 flex-wrap">
              ${contact.email ? `
                <a href="mailto:${contact.email}" class="hover:text-cyan-600">${contact.email}</a>
              ` : ''}
              ${contact.phone ? `
                <span id="phoneBox" class="hidden print:inline">|</span>
                <a href="tel:${contact.phone}" id="phoneNumber" class="hover:text-cyan-600 hidden print:inline">${contact.phone}</a>
              ` : ''}
              ${contact.location ? `
                <span>|</span>
                <span>${contact.location}</span>
              ` : ''}
              ${links.filter(l => l.show).length > 0 ? links.filter(l => l.show).map(link => `
                <span>|</span>
                <a href="${link.url}" target="_blank" class="hover:text-cyan-600">${link.label}</a>
              `).join('') : ''}
            </div>
          ` : ''}

          ${contact.badge ? `
            <div class="text-center mt-3 text-sm text-cyan-700 font-medium">
              ${contact.badge}
            </div>
          ` : ''}

          ${summary.length > 0 ? `
            <div class="mt-4 text-stone-700 text-sm leading-relaxed">
              ${summary.map(p => `<p class="mb-2">${p}</p>`).join('')}
            </div>
          ` : ''}
        </div>
      </header>
    `;
  }

  // Render experience section
  renderExperience(): string {
    const section = this.data.sections.experience;
    if (!section.show) return '';

    const visibleItems = section.items.filter(item => item.show);
    if (visibleItems.length === 0) return '';

    return `
      <article class="mb-6">
        <h2 class="text-cyan-700 text-2xl font-semibold mb-3 pb-2 border-b-2 border-stone-200">
          ${section.title}
        </h2>
        <div class="space-y-4">
          ${visibleItems.map(item => this.renderExperienceItem(item)).join('')}
        </div>
      </article>
    `;
  }

  private renderExperienceItem(item: Experience): string {
    return `
      <div>
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold text-stone-800">${item.title}</h3>
            <div class="text-sm text-stone-600">
              ${item.companyUrl ? `<a href="${item.companyUrl}" target="_blank" class="hover:text-cyan-600">${item.company}</a>` : item.company}
              ${item.employmentType ? ` • ${item.employmentType}` : ''}
              ${item.location ? ` • ${item.location}` : ''}
            </div>
          </div>
          <div class="text-sm text-stone-600 text-right whitespace-nowrap ml-4">
            ${this.renderDateRange(item.dates)}
          </div>
        </div>
        ${this.renderBulletPoints(item.bulletPoints)}
        ${item.techStack?.show && item.techStack.items.length > 0 ? `
          <div class="text-sm text-stone-600 mt-2">
            <span class="font-semibold">Technologies:</span> ${this.renderTechStack(item.techStack.items)}
          </div>
        ` : ''}
      </div>
    `;
  }

  // Render skills section
  renderSkills(): string {
    const section = this.data.sections.skills;
    if (!section.show || !section.data.show) return '';

    const visibleCategories = section.data.categories.filter(cat => cat.show);
    if (visibleCategories.length === 0) return '';

    return `
      <article class="mb-6">
        <h2 class="text-cyan-700 text-2xl font-semibold mb-3 pb-2 border-b-2 border-stone-200">
          ${section.title}
        </h2>
        <div class="grid grid-cols-2 gap-x-8 gap-y-2">
          ${visibleCategories.map(category => `
            <div class="text-sm">
              <span class="font-semibold text-stone-800">${category.title}:</span>
              <span class="text-stone-600"> ${this.renderTechStack(category.items)}</span>
            </div>
          `).join('')}
        </div>
      </article>
    `;
  }

  // Render awards section
  renderAwards(): string {
    const section = this.data.sections.awards;
    if (!section.show || !section.data.show) return '';

    const visibleItems = section.data.items.filter(item => item.show);
    if (visibleItems.length === 0) return '';

    return `
      <article class="mb-6">
        <h2 class="text-cyan-700 text-2xl font-semibold mb-3 pb-2 border-b-2 border-stone-200">
          ${section.title}
        </h2>
        <div class="space-y-3">
          ${visibleItems.map(item => `
            <div>
              <div class="flex justify-between items-start">
                <h4 class="font-semibold text-stone-800">
                  ${item.icon ? `${item.icon} ` : ''}${item.title}
                </h4>
                <div class="text-sm text-stone-600">${this.renderDateRange(item.date)}</div>
              </div>
              <div class="text-sm text-stone-600 mt-1">${item.description}</div>
            </div>
          `).join('')}
        </div>
      </article>
    `;
  }

  // Render education section
  renderEducation(): string {
    const section = this.data.sections.education;
    if (!section.show || !section.data.show) return '';

    const visibleItems = section.data.items.filter(item => item.show);
    if (visibleItems.length === 0) return '';

    return `
      <article class="mb-6">
        <h2 class="text-cyan-700 text-2xl font-semibold mb-3 pb-2 border-b-2 border-stone-200">
          ${section.title}
        </h2>
        <div class="space-y-3">
          ${visibleItems.map(item => `
            <div>
              <div class="flex justify-between items-start">
                <h4 class="font-semibold text-stone-800">${item.degree}</h4>
                <div class="text-sm text-stone-600">${this.renderDateRange(item.dates)}</div>
              </div>
              <div class="text-sm text-stone-600">${item.institution}${item.location ? `, ${item.location}` : ''}</div>
              ${item.thesis?.show && item.thesis.title ? `
                <div class="text-sm text-stone-600 mt-1 italic">${item.thesis.title}</div>
              ` : ''}
              ${item.coursework?.show && item.coursework.items.length > 0 ? `
                <div class="text-sm text-stone-600 mt-1">
                  <span class="font-semibold">Relevant Coursework:</span> ${this.renderTechStack(item.coursework.items)}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </article>
    `;
  }

  // Render volunteer section
  renderVolunteer(): string {
    const section = this.data.sections.volunteer;
    if (!section.show || !section.data.show) return '';

    const visibleItems = section.data.items.filter(item => item.show);
    if (visibleItems.length === 0) return '';

    return `
      <article class="mb-6">
        <h2 class="text-cyan-700 text-2xl font-semibold mb-3 pb-2 border-b-2 border-stone-200">
          ${section.title}
        </h2>
        <div class="space-y-4">
          ${visibleItems.map(item => `
            <div>
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold text-stone-800">${item.title}</h3>
                  <div class="text-sm text-stone-600">
                    ${item.organizationUrl ? `<a href="${item.organizationUrl}" target="_blank" class="hover:text-cyan-600">${item.organization}</a>` : item.organization}
                  </div>
                </div>
                <div class="text-sm text-stone-600 text-right">${this.renderDateRange(item.dates)}</div>
              </div>
              ${this.renderBulletPoints(item.bulletPoints)}
            </div>
          `).join('')}
        </div>
      </article>
    `;
  }

  // Split experience into pages (3-4 jobs per page)
  private splitExperienceIntoPages(): string[][] {
    const section = this.data.sections.experience;
    if (!section.show) return [];

    const visibleItems = section.items.filter(item => item.show);
    const pages: string[][] = [];
    const itemsPerPage = 3; // Adjust based on content density

    for (let i = 0; i < visibleItems.length; i += itemsPerPage) {
      const pageItems = visibleItems.slice(i, i + itemsPerPage);
      pages.push(pageItems.map(item => this.renderExperienceItem(item)));
    }

    return pages;
  }

  // Render complete resume with A4 page breaks
  render(): string {
    // Standard 1-column tech resume layout (multi-page)
    if (this.data.layout.columns === 1) {
      const experiencePages = this.splitExperienceIntoPages();
      const hasExperience = experiencePages.length > 0;

      return `
        <!-- Page 1: Header + First Experience Items -->
        <div class="page">
          ${this.renderHeader()}
          ${hasExperience ? `
            <main class="px-12 py-6">
              <article class="mb-6">
                <h2 class="text-cyan-700 text-2xl font-semibold mb-3 pb-2 border-b-2 border-stone-200">
                  ${this.data.sections.experience.title}
                </h2>
                <div class="space-y-4">
                  ${experiencePages[0].join('')}
                </div>
              </article>
            </main>
          ` : ''}
        </div>

        <!-- Page 2: Continuing Experience -->
        ${experiencePages.length > 1 ? `
          <div class="page">
            <main class="px-12 py-12">
              <article class="mb-6">
                <h2 class="text-cyan-700 text-2xl font-semibold mb-3 pb-2 border-b-2 border-stone-200">
                  ${this.data.sections.experience.title} (continued)
                </h2>
                <div class="space-y-4">
                  ${experiencePages.slice(1).flat().join('')}
                </div>
              </article>
            </main>
          </div>
        ` : ''}

        <!-- Page 3: Skills, Education, Awards, Volunteer -->
        <div class="page">
          <main class="px-12 py-12">
            ${this.renderSkills()}
            ${this.renderEducation()}
            ${this.renderAwards()}
            ${this.renderVolunteer()}
          </main>
        </div>
      `;
    }

    // 2-column layout (single page)
    return `
      <div class="page">
        ${this.renderHeader()}
        <main class="grid grid-cols-2 gap-6 px-6 py-6">
          <div>
            ${this.renderExperience()}
          </div>
          <div>
            ${this.renderSkills()}
            ${this.renderAwards()}
            ${this.renderEducation()}
            ${this.renderVolunteer()}
          </div>
        </main>
      </div>
    `;
  }
}
