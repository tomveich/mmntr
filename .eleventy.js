// .eleventy.js

const pluginTOC = require('eleventy-plugin-toc');
const pluginDate = require("eleventy-plugin-date");

module.exports = function(eleventyConfig) {
  // Tell Eleventy to copy the assets folder
  eleventyConfig.addPassthroughCopy("assets");

  // Activate the Table of Contents plugin
  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h2', 'h3'],
    wrapper: 'div',
    wrapperClass: 'toc prose prose-sm bg-slate-100 dark:bg-slate-800 p-4 rounded-lg'
  });
  
  // Activate the Date plugin with our custom named formats
  eleventyConfig.addPlugin(pluginDate, {
    formats: {
      // Creates a filter named | displayDate
      displayDate: 'd. M. yyyy',
      // Creates a filter named | isoDate
      isoDate: 'yyyy-MM-dd'
    }
  });
  

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    htmlTemplateEngine: "njk"
  };
};