const path = require("path");
function defaultIndexTemplate(filePaths) {
  const entries = filePaths.map((file) => {
    let filePath;

    if (typeof file === "string") {
      filePath = file;
    } else if (file && typeof file === "object") {
      filePath = file.path || file.originalPath;
    }

    if (!filePath) {
      throw new TypeError(
        `defaultIndexTemplate expected a string or { path, originalPath } object but received: ${JSON.stringify(file)}`
      );
    }

    const basename = path.basename(filePath, path.extname(filePath));
    const exportName = basename.replace(/^Ic/, "");
    return [exportName, basename];
  });

  // Sort entries by basename for consistent import ordering
  entries.sort((a, b) => a[1].localeCompare(b[1]));

  return `${entries
    .map(([n, p]) => `import { default as ${n} } from "./${p}";`)
    .join("\n")}

export const Icons = {
  ${entries
    .map(([n, p]) => `${n.charAt(0).toLowerCase() + n.slice(1)}: ${n},`)
    .join("\n  ")}
};

export type IconName = keyof typeof Icons;
  `;
}
module.exports = defaultIndexTemplate;
