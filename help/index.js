const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItToc = require('markdown-it-toc-done-right');
const readdir = require('recursive-readdir');
const copy = require('recursive-copy');
const fs = require('fs');
const sass = require('node-sass');
 
const baseDir = 'help_src';
const destDir = 'build';
const customSassPath = process.env.HERMETIC_CUSTOM_SASS_PATH;

const slugify = (s) => encodeURIComponent(
  String(s).trim().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
);

const md = markdownIt({
  html: true,
  xhtmlOut: true,
  typographer: true
}).use(markdownItAnchor, { slugify })
.use(markdownItToc, { slugify });

const main = async() => {
  await copy(baseDir, destDir, {
    overwrite: true,
    filter: path => !path.endsWith('.md'),
  });
  await copy('help_template', destDir, {
    overwrite: true,
    filter: path => (!path.endsWith('template.html'))
      && (!path.endsWith('.scss')),
  });
  const files = await readdir(baseDir);
  const markdownFiles = files
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(`${baseDir}/`, ''))
    .sort((a, b) => {
      let aNum = Number.parseFloat(a.split(". ")[0]);
      let bNum = Number.parseFloat(b.split(". ")[0]);
      aNum = isNaN(aNum) ? 999.0 : aNum;
      bNum = isNaN(bNum) ? 999.0 : bNum;
      return aNum - bNum;
    });
  const fileContents = markdownFiles
    .map(f => fs.readFileSync(`${baseDir}/${f}`, { encoding: 'utf-8' }));
  const allMarkdown = `\${toc}\n${fileContents.join('\n\n')}`;
  const htmlContent = md.render(allMarkdown);
  const templateHtml = fs.readFileSync('help_template/template.html', { encoding: 'utf-8' });
  const html = templateHtml.replace('{replace}', htmlContent);
  fs.writeFileSync('build/index.html', html);
  const scssContent = fs.readFileSync('help_template/styles.scss', { encoding: 'utf-8' });
  const includePaths = ['help_template'];
  if (customSassPath) {
    includePaths.splice(0, 0, customSassPath);
  }
  const cssContent = sass.renderSync({
    data: scssContent,
    includePaths,
  });
  fs.writeFileSync('build/styles.css', cssContent.css);
};

main();




