/**
 * Webpack plugin to remove development artifacts from production builds
 */

class RemoveDevArtifactsPlugin {
  constructor(options = {}) {
    this.options = {
      removeConsole: options.removeConsole !== false,
      removeDevOnly: options.removeDevOnly !== false,
      ...options,
    };
  }

  apply(compiler) {
    const pluginName = 'RemoveDevArtifactsPlugin';

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.optimizeModules.tap(pluginName, (modules) => {
        for (const module of modules) {
          if (module.resource) {
            const source = module._source?.source();
            if (source && typeof source === 'string') {
              let newSource = source;

              // Remove console.log statements (except errors/warns if requested)
              if (this.options.removeConsole) {
                if (this.options.removeConsole === 'errors-only') {
                  // Remove everything except console.error and console.warn
                  newSource = newSource.replace(
                    /console\.(log|info|debug|trace)\([^)]*\);?/g,
                    ''
                  );
                } else {
                  // Remove all console statements
                  newSource = newSource.replace(
                    /console\.[^;]+;?/g,
                    ''
                  );
                }
              }

              // Remove dev-only code blocks
              if (this.options.removeDevOnly) {
                // Remove if (process.env.NODE_ENV === 'development') blocks
                newSource = newSource.replace(
                  /if\s*\(process\.env\.NODE_ENV\s*===\s*['"`]development['"`]\)\s*\{[^}]*\}/gs,
                  ''
                );

                // Remove __DEV__ conditional blocks
                newSource = newSource.replace(
                  /if\s*\(__DEV__\)\s*\{[^}]*\}/gs,
                  ''
                );

                // Remove debugger statements
                newSource = newSource.replace(/\bdebugger;\b/g, '');
              }

              // Update module source if changed
              if (newSource !== source) {
                if (module._source) {
                  module._source = {
                    source: () => newSource,
                    size: () => newSource.length,
                    buffer: () => Buffer.from(newSource),
                  };
                }
              }
            }
          }
        }
      });
    });
  }
}

module.exports = RemoveDevArtifactsPlugin;