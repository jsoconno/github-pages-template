function getNestedMarkdownFiles(folder) {
    const result = [];
    const traverse = (currentFolder, currentPath = "") => {
      const entries = Object.entries(currentFolder);
  
      for (const [name, value] of entries) {
        if (typeof value === "object") {
          traverse(value, currentPath + name + "/");
        } else {
          const routePath = currentPath + name.replace(/\.md$/, "");
          const properCaseName = name
            .replace(/\.md$/, "")
            .replace(/-/g, " ")
            .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
          const iconMatch = value.match(/icon:\s*["'](.+?)["']/);
          const tagsMatch = value.match(/tags:\s*\[(.+?)\]/);
          const icon = iconMatch ? iconMatch[1] : null;
          const tags = tagsMatch
            ? tagsMatch[1]
                .split(",")
                .map((t) => t.trim().replace(/["']/g, ""))
            : [];
  
          result.push({
            route: routePath,
            name: properCaseName,
            icon,
            tags,
            markdown: `/static/markdown${currentPath}${name}`,
          });
        }
      }
    };
  
    traverse(folder);
    return result;
  }
  
  module.exports = {
    getNestedMarkdownFiles,
  };