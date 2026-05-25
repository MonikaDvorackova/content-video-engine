import {Config} from '@remotion/cli/config';
import {enableTailwind} from '@remotion/tailwind-v4';
import fs from 'node:fs';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setLevel('verbose');
Config.setCachingEnabled(false);
Config.setShouldOpenBrowser(false);
Config.setDelayRenderTimeoutInMilliseconds(120_000);
Config.setChromiumHeadlessMode(true);
Config.setChromiumOpenGlRenderer('angle');
Config.setIPv4(true);

// Prefer system Chrome on macOS to avoid rare connection timeouts
// when using the bundled chrome-headless-shell.
const macChromeCandidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
];
const chrome = macChromeCandidates.find((p) => fs.existsSync(p));
if (chrome) {
  Config.setBrowserExecutable(chrome);
}

Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});