// .eleventy.js

const pluginTOC = require('eleventy-plugin-toc');
const pluginDate = require("eleventy-plugin-date");
const markdownIt = require("markdown-it");

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
  
  eleventyConfig.addFilter("where", function(array, key, value) {
    return array.filter(item => {
      // Handle nested keys like "data.author"
      const keys = key.split('.');
      let current = item;
      for (const k of keys) {
        if (current === undefined) return false;
        current = current[k];
      }
      return current === value;
    });
  });

  eleventyConfig.addFilter("split", function(string, separator) {
    return string.split(separator);
  });

  const md = new markdownIt({
    html: true,
  });

  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content);
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};