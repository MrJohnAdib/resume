# MrAdib Resume

Welcome to the the repository for **John Adib's personal resume**, designed and developed to showcase both my technical expertise and front-end design skills. This project is built using **HTML**, **Tailwind CSS**, and **JavaScript**. It delivers a sharp, modern, and fully responsive design that adapts perfectly to any device. Built for seamless printing and effortless PDF downloads, it incorporates intelligent JavaScript features that elevate the entire user experience.

## About

As an engineer passionate about frontend development, I wanted my resume to stand out in both design and content. This resume embodies my dedication to crafting elegant, functional, and user-centered web experiences. The clean two-column layout organizes information clearly, while the minimalist design ensures it remains visually appealing and easy to navigate.

The resume is not just a static document. I've added interactive elements using JavaScript to make it dynamic and adaptable. For example, the link to download the PDF version of the resume is automatically updated to the latest version of PDF.

I love pursuing unique ideas, and that's exactly why I created this resume using HTML. While most people stick to traditional formats, I decided to build something different. Not only does it work beautifully as a web page, but it's also print-friendly and fully optimized for PDF downloads. This approach gives me total flexibility and control over every aspect of the design, allowing me to make changes without the fear of breaking something. I really enjoy the process of building this—it’s rewarding to have a resume that reflects my passion for both creativity and functionality.

## Features

- **Responsive Design**: Adapts seamlessly to different screen sizes, making it accessible on any device.
- **Print-Friendly**: You can print the resume directly from your browser using the standard print feature (Ctrl + P or Cmd + P), which will automatically format it for printing.
- **Interactive Elements**: JavaScript adds functionality, such as dynamically showing the latest resume PDF and controlling visibility of personal details like phone number.
- **Automatic PDF Updates**: The resume automatically links to the latest version of the PDF using custom JavaScript logic.
- **Customizable**: Easily modify the HTML, CSS, or JavaScript to suit your needs.
- **Includes Cover Letter**: A tailored cover letter is also part of the repository, designed to match the resume's style and color scheme.

## Design System

The design of the resume follows a thoughtful color palette inspired by professionalism and clarity

- **Primary Color**: A soft cyan (`#00bcd4`) is used for headers and important elements, providing a refreshing yet professional feel.
- **Secondary Color**: Stone grey (`#4b5563`) is used for body text, offering excellent readability while maintaining a neutral tone.

This color scheme creates a cohesive, elegant design that ensures both clarity and visual appeal. The use of **Tailwind CSS** allows for easy customization and scalability while maintaining a consistent design language.

## Deployment

Imagine being able to share your resume with just a simple link. That’s exactly what this project does. Thanks to GitHub Actions, my resume is automatically deployed as a static site on GitHub Pages and connected to my custom subdomain at [resume.mradib.com](https://resume.mradib.com).

It's sleek, simple, and always available. No need to send files or worry about outdated versions. With one click, visitors can view the web version or download the latest PDF. It’s a professional, modern way to keep my resume accessible and ready to share instantly.


## Installation

To use or modify this resume template, follow these steps:

1. **Fork this repository**: Create your own copy of this repository on GitHub.
2. **Clone the repository** to your local machine:
```bash
   git clone https://github.com/your-username/mradib-resume.git
```
3. Install dependencies using Node.js:
```bash
npm install
```
4. Build the CSS using Tailwind CSS:
```bash
npm run build
```
5. Open index.html in your browser to view and edit the resume.

This will allow you to customize the template for your own use and generate the required styles using Tailwind CSS.

## Usage

### Customization

- **HTML**: Modify the content in `index.html` to reflect your own experience, skills, and personal details.
- **CSS**: The styling is built with **Tailwind CSS**. To adjust the styles, edit the `tailwind.css` file and rebuild the CSS.
- **JavaScript**: Some JavaScript is used to add interactivity, such as hiding and showing the phone number, and ensuring the latest PDF version is linked.

### PDF Download and Print

- **Download PDF**: The resume includes a button to download the latest version of the resume in PDF format, which is automatically linked using JavaScript.
- **Print the Resume**: To print the document, simply use your browser’s print feature `Ctrl + P` or `Cmd + P`. The resume is designed to be print-friendly, ensuring it looks clean and professional when printed.

## JavaScript Features

1. **Hide/Show Phone Number**: By default, my phone number is hidden for privacy. The number can be revealed with a click on the contact section.
2. **Automatic PDF Versioning**: JavaScript is used to check for the latest version of the resume PDF and update the download link accordingly. This ensures that users always download the most up-to-date resume.

## Cover Letter

This repository also contains a **matching cover letter** designed with the same aesthetic principles. It shares the same clean layout, colors, and interactive elements, making it a seamless addition to your professional toolkit.

## Contributions

If you have suggestions for improving the design or functionality, feel free to contribute by submitting a pull request or opening an issue. Your ideas are always welcome!

## License

This project is licensed under the **MIT License**, meaning you are free to use, modify, and distribute it for both personal and commercial purposes.
