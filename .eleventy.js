module.exports = function(eleventyConfig) {
    // This will copy your assets folder to the output folder
    eleventyConfig.addPassthroughCopy("assets");
  
    return {
      dir: {
        input: ".",
        includes: "_includes",
        output: "_site",
      }
    };
  };