const fs = require('fs-extra');
const path = require('path');

// Define the path to the markdown folder
const markdownPath = path.join(__dirname, 'static', 'markdown');

// Define the path to the output file
const outputPath = path.join(__dirname, 'src', 'pageConfig.json');

// Define the header navigation and landing page
const headerNavigation = [
  {
    name: 'Documentation',
    path: '/documentation',
  },
];
const landingPage = '/documentation';

// Define the function to generate the page configuration
function generatePageConfig() {
  // Define a function to extract the header data from a markdown file
  function extractHeader(filePath) {
    const header = {
      title: '',
      tags: [],
      description: '',
      icon: '',
      icon_style: 'fas',
      owner: ''
    };
    const fileData = fs.readFileSync(filePath, 'utf8');
    const headerMatch = fileData.match(/<!--([\s\S]*?)-->/);
    if (headerMatch) {
      const headerLines = headerMatch[1].trim().split('\n');
      headerLines.forEach((line) => {
        const [key, value] = line.split(':').map((s) => s.trim());
        if (key === 'title') {
          header.title = value;
        } else if (key === 'tags') {
          header.tags = value.split(',').map((s) => s.trim().toLowerCase().replace(' ', '-'));
        } else if (key === 'description') {
          header.description = value;
        } else if (key === 'icon') {
          header.icon = value;
        } else if (key === 'icon-style') {
          header.icon_style = value;
        } else if (key === 'owner') {
          header.owner = value;
        }
      });
    }
    return header;
  }
  // Define a recursive function to generate the page configuration
  function traverseDirectory(dirPath, parentPage, parentRoute) {
    const files = fs.readdirSync(dirPath);

    files.forEach((fileName) => {
      const filePath = path.join(dirPath, fileName);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        const folderName = path.basename(filePath);
        const folderRoute = `${parentRoute}/${folderName}`.replace(landingPage, '');
        const folderPage = {
          route: folderRoute,
          name: folderName,
          description: '',
          icon: ['far', 'folder'],
          children: [],
          tags: [],
        };

        traverseDirectory(filePath, folderPage, folderRoute);
        if (folderPage.children.length > 0) {
          parentPage.children.push(folderPage);
        } else {
          const pageName = folderName;
          const pageRoute = folderRoute;

          // Create the page object
          const page = {
            route: `/${pageRoute}`,
            name: pageName,
            description: '',
            icon: ['far', 'folder'],
            children: [],
            markdown: `/static/markdown/${pageRoute}/main.md`,
          };

          // Add the page object to the page configuration
          parentPage.children.push(page);
        }
      } else {
        // Extract header data from the markdown file
        const { title, tags, description, icon, owner, icon_style } = extractHeader(filePath);

        const pageName = path.basename(fileName, path.extname(fileName));
        const pageRoute = `${pageName}`.toLowerCase();
        const markdownPath = filePath.replace(/.*\/static\/markdown\//, "/static/markdown/");

        // Create the page object
        const page = {
          route: `/${pageRoute}`,
          name: title || pageName,
          description: description || '',
          icon: [icon_style, icon] || ['far', 'file'],
          tags: tags || [],
          owner: owner || '',
          markdown: markdownPath,
        };

        // Add the page object to the page configuration
        parentPage.children.push(page);
      }
    });
  }

  // Initialize the page configuration object
  const pageConfig = {
    appName: 'X',
    headerNavigation,
    landingPage,
    tags: ['news', 'process'],
    pages: [],
  };

  // Generate the page configuration recursively
  const rootRoute = landingPage.toLowerCase();
  const rootPage = {
    route: rootRoute,
    name: 'Documentation',
    description: 'This is the documentation',
    icon: 'address-book',
    children: [],
    tags: [],
  };
  traverseDirectory(markdownPath, rootPage, rootRoute);
  pageConfig.pages.push(rootPage);

  // Write the page configuration to the output file
  fs.writeFileSync(outputPath, JSON.stringify(pageConfig, null, 2));
}

// Call the function to generate the page configuration
generatePageConfig();
