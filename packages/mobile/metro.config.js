/**
 * Metro Bundler configuration
 * https://facebook.github.io/metro/docs/en/configuration
 *
 * eslint-env node, es6
 */
// PULLED FROM THIS BLOG: https://medium.com/@huntie/a-concise-guide-to-configuring-react-native-with-yarn-workspaces-d7efa71b6906

const blacklist = require('metro-config/src/defaults/blacklist'); // eslint-disable-line @typescript-eslint/no-var-requires
const getWorkspaces = require('get-yarn-workspaces'); // eslint-disable-line @typescript-eslint/no-var-requires
const path = require('path'); // eslint-disable-line @typescript-eslint/no-var-requires

function getConfig(appDir, options = {}) {
  const workspaces = getWorkspaces(appDir);

  // Add additional Yarn workspace package roots to the module map
  // https://bit.ly/2LHHTP0
  const watchFolders = [
    path.resolve(appDir, '../..', 'node_modules'),
    ...workspaces.filter((workspaceDir) => !(workspaceDir === appDir)),
  ];

  return {
    watchFolders,
    resolver: {
      blacklistRE: blacklist([
        // Ignore other resolved react-native installations outside of
        // myapp-native - this prevents a module naming collision when mapped.
        /^((?!mobile).)+[\/\\]node_modules[/\\]react-native[/\\].*/,
        /^((?!mobile).)+[\/\\]node_modules[/\\]react[/\\].*/,
        // Ignore react-native-svg dependency in myapp-ui, mapped below.
        // react-native-svg must only be included once due to a side-effect. It
        // has not been hoisted as it requires native module linking here.
        // http://bit.ly/2LJ7V4b
        /components[\/\\]node_modules[/\\]react-native-svg[/\\].*/,
        /components[\/\\]node_modules[/\\]react-native-gesture-handler[/\\].*/,
        /components[\/\\]node_modules[/\\]react-native-reanimated[/\\].*/,
        /components[\/\\]node_modules[/\\]react-native-safe-area-context[/\\].*/,
        /components[\/\\]node_modules[/\\]react-native-screens[/\\].*/,
        /components[\/\\]node_modules[/\\]@react-navigation[/\\].*/,
        /components[\/\\]node_modules[/\\]react-native-vector-icons[/\\].*/,
      ]),
      extraNodeModules: {
        // Resolve all react-native module imports to the locally-installed version
        'react-native': path.resolve(appDir, 'node_modules', 'react-native'),
        react: path.resolve(appDir, 'node_modules', 'react'),

        // Resolve additional nohoist modules depended on by other packages
        'react-native-svg': path.resolve(
          appDir,
          'node_modules',
          'react-native-svg',
        ),

        'react-native-gesture-handler': path.resolve(
          appDir,
          'node_modules',
          'react-native-gesture-handler',
        ),
        'react-native-reanimated': path.resolve(
          appDir,
          'node_modules',
          'react-native-reanimated',
        ),
        'react-native-safe-area-context': path.resolve(
          appDir,
          'node_modules',
          'react-native-safe-area-context',
        ),
        '@react-native-community/masked-view': path.resolve(
          appDir,
          'node_modules',
          '@react-native-community/masked-view',
        ),
        'react-native-screens': path.resolve(
          appDir,
          'node_modules',
          'react-native-screens',
        ),
        '@react-navigation/native': path.resolve(
          appDir,
          'node_modules',
          '@react-navigation/native',
        ),
        '@react-navigation/bottom-tabs': path.resolve(
          appDir,
          'node_modules',
          '@react-navigation/bottom-tabs',
        ),
        'react-native-vector-icons': path.resolve(
          appDir,
          'node_modules',
          'react-native-vector-icons',
        ),

        // Resolve core-js imports to the locally installed version
        'core-js': path.resolve(appDir, 'node_modules', 'core-js'),
      },
    },
  };
}

module.exports = getConfig(__dirname);
