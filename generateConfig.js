const fs = require('fs-extra');
const path = require('path');

// Define the path to the markdown folder
const markdownPath = path.join(__dirname, 'static', 'markdown');

// Define the path to the output file
const outputPath = path.join(__dirname, 'src', 'pageConfig.json');

// Define the header navigation and landing page
const headerNavigation = [
  {
    name: 'Playbook',
    path: '/playbook',
  },
];
const landingPage = '/playbook';

// Define the function to generate the page configuration
function generatePageConfig() {
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
          icon: '',
          children: [],
          topics: [],
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
            icon: '',
            children: [],
            markdown: `/static/markdown/${pageRoute}/main.md`,
          };

          // Add the page object to the page configuration
          parentPage.children.push(page);
        }
      } else {
        const pageName = path.basename(fileName, path.extname(fileName));
        const pageRoute = `${pageName}`.toLowerCase();
        const markdownPath = filePath.replace(/.*\/static\/markdown\//, "/static/markdown/");

        // Create the page object
        const page = {
          route: `/${pageRoute}`,
          name: pageName,
          description: '',
          icon: '',
          topics: [],
          markdown: markdownPath,
        };

        // Add the page object to the page configuration
        parentPage.children.push(page);
      }
    });
  }

  // Initialize the page configuration object
  const pageConfig = {
    appName: 'Git',
    headerNavigation,
    landingPage,
    topics: ['news', 'process'],
    pages: [],
  };

  // Generate the page configuration recursively
  const rootRoute = landingPage.toLowerCase();
  const rootPage = {
    route: rootRoute,
    name: 'Playbook',
    description: 'This is the playbook',
    icon: 'address-book',
    children: [],
    topics: [],
  };
  traverseDirectory(markdownPath, rootPage, rootRoute);
  pageConfig.pages.push(rootPage);

  // Write the page configuration to the output file
  fs.writeFileSync(outputPath, JSON.stringify(pageConfig, null, 2));
}

// Call the function to generate the page configuration
generatePageConfig();
