# GitHub Pages Documentation Framework

The GitHub Pages Documentation Framework is a Vue.js application designed to streamline the process of creating and managing documentation for your projects using Markdown and GitHub Pages. With an easy-to-use interface and automated features, you can quickly create a professional-looking and fully functional documentation site by simply adding static content such as icons, images, and Markdown files.

## Key Features
 
- Web app for displaying Markdown-based documentation
- Mobile-friendly, responsive design
- Supports any depth of document hierarchy
- Automated routing configuration based on markdown folder and file structure
- Allows title, description, icon, tags, and owner for each folder and document
- Live search/filtering with keywords and tags (no infrastructure required)
- Optimized for deployment on GitHub Pages
- Left-sided tree navigator
- Breadcrumb support for easy navigation through any level of document hierarchy
- Tag support for grouping documents together

## Dependencies

In order to build and run the application locally, following the build commands below, you will need to have Node 12 installed.  To do this with Homebrew on Mac using `brew install node@12`.

## Getting Started

1. Clone this repository:
```bash
git clone https://github.com/jsoconno/github-pages-template.git
```
2. Change into the cloned directory:
```bash
cd github-pages-template
```
3. Follow the [Build Setup](#build-setup) instructions to install dependencies and run the development server.
4. Write your documents in Markdown format and place them in the `/static/markdown` folder. You can organize your documents into sub-folders as needed.
5. Create a new Git repository in GitHub
6. Import your documentation trunk:
```bash
git init
git add .
git commit -m "Initial commit"
```
1. Deploy your documentation to GitHub Pages changing the value for `TARGET_BRANCH` as desired:
```bash
export TARGET_BRANCH=gh-pages && npm run gh-pages
```
1. In your GitHub repository > Settings > scroll down to "GitHub Pages", ensure it points to your GitHub Pages branch (e.g. "gh-pages").
2. Find the link to your GitHub Pages deployment on that screen and share it with your audience.

## Customizing Metadata

To customize the metadata for each folder and document, simply modify the header of you markdown files to include the desired information as shown below.

- `title`: The title of the folder or document.
- `description`: A short description of the folder or document.
- `icon`: The name of the icon from `https://fontawesome.com/icons`.
- `icon-style`: The icon style you want to use (e.g. `fab` for branded icons, `far` for regular icons, or `fas` for solid icons).  `fas` is the default and is not required.
- `tags`: An comma-separated list of tags associated with the markdown document.
- `owner`: The name of the person responsible for the document.

Example:

```markdown
<!--
title: "Getting Started"
description: "Learn how to use the GitHub Pages"
icon: poo
tags: tutorial, beginner
owner: John Doe
-->
My actual markdown content does here.
```

## Live Search and Filtering

The live search feature allows users to quickly find documents based on keywords or tags. To use the live search, simply type in the search bar located at the top of the documentation site. The results will automatically update as you type, with matching documents and folders being highlighted.

To search for tags, use the search prefix `tag:` followed by the tag name.  For example, `tag:tutorial`.

## Documentation Navigation

The left-sided tree navigator provides an easy way to browse your documentation. Click on folders to expand or collapse their contents, and click on document titles to navigate to their respective pages.

Breadcrumb navigation is also available to help you easily navigate through any level of document hierarchy. Breadcrumbs are displayed at the top of each page, showing the current location within the documentation structure.

## Build Setup

Follow these steps to set up your development environment:

### install dependencies
```
npm install
```
### serve with hot reload at localhost:8080
```
npm run dev
```
### build for production with minification, also build the search index
```
npm run build
```
### build the search index only
```
npm run build-search
```
### build the route configuration only
```
npm run generate-config
```
### deploy playbook to GH pages (includes build and deploy to GH pages)
```
export TARGET_BRANCH=gh-pages
npm run gh-pages
```
## Bug Reports and Enhancement Requests

For feedback, enhancement requests, or defect reports, use the "Issues" section on this repository. When reporting a bug, please include as much information as possible to help us reproduce and fix the issue. This may include steps to reproduce, screenshots, and any relevant error messages or logs.



