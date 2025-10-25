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
      <header class="bg-stone-50 mb-4">
        <div class="flex m-6 mb-4">
          ${avatar.show && avatar.url ? `
            <div class="basis-36 w-36 h-36 flex-none mr-6">
              <img src="${avatar.url}" alt="${name}" class="rounded-lg" />
            </div>
          ` : ''}
          <div class="basis-auto w-full">
            <div class="flex items-start justify-between">
              <div class="grow">
                <h1 class="text-black text-3xl font-light leading-8">${name}</h1>
                <h2 class="text-cyan-600 text-xl leading-7 mt-1">${title}</h2>
              </div>
              ${links.filter(l => l.show).length > 0 ? `
                <nav class="text-xs flex gap-2 flex-wrap justify-end">
                  ${links.filter(l => l.show).map(link => `
                    <a target="_blank"
                       class="flex leading-4 rounded-lg bg-cyan-600 hover:bg-cyan-800 transition"
                       href="${link.url}">
                      ${link.icon ? `<img src="${link.icon}" alt="${link.label}" class="h-8 w-8 p-2" />` : ''}
                      <span class="bg-white bg-opacity-30 px-2 leading-8 text-white text-xs">${link.label}</span>
                    </a>
                  `).join('')}
                </nav>
              ` : ''}
            </div>
            <div class="text-stone-700 text-sm leading-snug mt-1 space-y-1">
              ${summary.map(p => `<p>${p}</p>`).join('')}
            </div>
          </div>
        </div>
        ${contact.show ? `
          <div class="bg-stone-100 leading-10 px-6 gap-6 text-xs flex items-center justify-center text-stone-600">
            ${contact.email ? `
              <div class="flex items-center">
                <img src="./img/email.svg" alt="email" class="h-4 w-4 mr-1" />
                <a href="mailto:${contact.email}">${contact.email}</a>
              </div>
            ` : ''}
            ${contact.phone ? `
              <div class="flex items-center" id="phoneBox">
                <img src="./img/tel.svg" alt="phone" class="h-4 w-4 mr-1" />
                <a href="tel:${contact.phone}">${contact.phone}</a>
              </div>
            ` : ''}
            ${contact.location ? `
              <div class="flex items-center">
                <img src="./img/location.svg" alt="location" class="h-4 w-4 mr-1" />
                <span>${contact.location}</span>
              </div>
            ` : ''}
            ${contact.badge ? `
              <div class="flex items-center">
                <img src="./img/star.svg" alt="badge" class="h-4 w-4 mr-1" />
                <span>${contact.badge}</span>
              </div>
            ` : ''}
          </div>
        ` : ''}
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
      <article class="mb-4">
        <h2 class="text-cyan-600 text-xl leading-5 mb-2 underline underline-offset-2">
          ${section.title}
        </h2>
        ${visibleItems.map(item => this.renderExperienceItem(item)).join('')}
      </article>
    `;
  }

  private renderExperienceItem(item: Experience): string {
    return `
      <section class="mb-2">
        <h3 class="font-light text-base leading-5">${item.title}</h3>
        <div class="flex items-center flex-wrap gap-x-2">
          <h4 class="text-sm text-stone-500">
            ${item.companyUrl ? `<a href="${item.companyUrl}" target="_blank">${item.company}</a>` : item.company}
          </h4>
          ${item.employmentType ? `<span class="text-xs text-stone-500">${item.employmentType}</span>` : ''}
          ${item.location ? `<span class="text-xs text-stone-500">${item.location}</span>` : ''}
          ${this.renderDateRange(item.dates)}
        </div>
        ${this.renderBulletPoints(item.bulletPoints)}
        ${item.techStack?.show && item.techStack.items.length > 0 ? `
          <div class="leading-[14px] text-xs text-stone-600 mt-2">
            <h3 class="font-light inline-block text-stone-700">Tech Stack: </h3>
            ${this.renderTechStack(item.techStack.items)}
          </div>
        ` : ''}
      </section>
    `;
  }

  // Render skills section
  renderSkills(): string {
    const section = this.data.sections.skills;
    if (!section.show || !section.data.show) return '';

    const visibleCategories = section.data.categories.filter(cat => cat.show);
    if (visibleCategories.length === 0) return '';

    return `
      <article class="mb-4">
        <h2 class="text-cyan-600 text-xl leading-5 mb-2 underline underline-offset-2">
          ${section.title}
        </h2>
        ${visibleCategories.map(category => `
          <section class="leading-5 text-xs mb-1">
            <h3 class="font-light inline-block text-stone-700">${category.title}: </h3>
            ${this.renderTechStack(category.items)}
          </section>
        `).join('')}
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
      <article class="mb-4">
        <h2 class="text-cyan-600 text-xl leading-5 mb-2 underline underline-offset-2">
          ${section.title}
        </h2>
        ${visibleItems.map(item => `
          <section class="mb-2">
            <div class="flex items-center justify-between">
              <h4 class="text-base leading-5 font-light">
                ${item.icon ? `${item.icon} ` : ''}${item.title}
              </h4>
            </div>
            <div class="flex flex-wrap justify-between text-xs">
              <div class="text-stone-600">${item.description}</div>
              ${this.renderDateRange(item.date)}
            </div>
          </section>
        `).join('')}
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
      <article class="mb-4">
        <h2 class="text-cyan-600 text-xl leading-5 mb-2 underline underline-offset-2">
          ${section.title}
        </h2>
        ${visibleItems.map(item => `
          <section class="mb-2">
            <h4 class="text-base leading-5 font-light">${item.degree}</h4>
            <div class="flex flex-wrap items-center gap-x-2 text-xs">
              <h5 class="text-sm text-stone-600">${item.institution}</h5>
              ${item.location ? `<span class="text-stone-500">${item.location}</span>` : ''}
              ${this.renderDateRange(item.dates)}
            </div>
            ${item.thesis?.show && item.thesis.title ? `
              <div class="text-xs text-stone-600 mt-1">${item.thesis.title}</div>
            ` : ''}
            ${item.coursework?.show && item.coursework.items.length > 0 ? `
              <div class="text-xs text-stone-600 mt-1">
                <span class="font-light text-stone-700">Relevant Coursework: </span>
                ${this.renderTechStack(item.coursework.items)}
              </div>
            ` : ''}
          </section>
        `).join('')}
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
      <article class="mb-4">
        <h2 class="text-cyan-600 text-xl leading-5 mb-2 underline underline-offset-2">
          ${section.title}
        </h2>
        ${visibleItems.map(item => `
          <section class="mb-2">
            <h3 class="font-light text-base leading-5">${item.title}</h3>
            <div class="flex items-center flex-wrap gap-x-2">
              <h4 class="text-sm text-stone-500">
                ${item.organizationUrl ? `<a href="${item.organizationUrl}" target="_blank">${item.organization}</a>` : item.organization}
              </h4>
              ${item.location ? `<span class="text-xs text-stone-500">${item.location}</span>` : ''}
              ${this.renderDateRange(item.dates)}
            </div>
            ${this.renderBulletPoints(item.bulletPoints)}
          </section>
        `).join('')}
      </article>
    `;
  }

  // Render complete resume
  render(): string {
    const layoutClass = this.data.layout.columns === 2 ? 'grid grid-cols-2 gap-4' : '';

    return `
      ${this.renderHeader()}
      <main class="mx-6 mb-4 ${layoutClass}">
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
    `;
  }
}
