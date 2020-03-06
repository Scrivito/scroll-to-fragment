module.exports = function(config) {
  config.set({
    frameworks: ["jasmine", "karma-typescript"],
    files: ["spec/**/*.ts", "src/**/*.ts"],
    preprocessors: {
      "**/*.ts": ["karma-typescript"]
    },
    reporters: ["progress", "karma-typescript"],
    browsers: process.env.KARMA_BROWSER
      ? process.env.KARMA_BROWSER.split(",")
      : ["ChromeHeadless", "FirefoxHeadless"]
  });
};
