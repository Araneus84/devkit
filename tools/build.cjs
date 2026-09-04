/* No build dependencies: node tools/build.cjs */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');let html=fs.readFileSync(path.join(root,'index.html'),'utf8');const manifest=JSON.parse(fs.readFileSync(path.join(root,'app-manifest.json'),'utf8'));
for(const file of manifest.javascript){const content=fs.readFileSync(path.join(root,file),'utf8');new vm.Script(content,{filename:file});html=html.replace(`<script defer src="${file}"></script>`,()=>'<script>\n'+content.replace(/<\/script/gi,'<\\/script')+'\n</script>');}
for(const file of manifest.styles){const content=fs.readFileSync(path.join(root,file),'utf8');html=html.replace(`<link rel="stylesheet" href="${file}">`,()=>'<style>\n'+content+'\n</style>');}
if(/<(script|link)[^>]+(?:src|href)="(?:src|styles|vendor)\//.test(html))throw Error('Unbundled asset remains.');
// Keep complete license notices in the standalone distribution, too.
const notices=['LICENSE','NOTICE','vendor/LICENSE.js-yaml.txt','vendor/LICENSE.lezer.txt'].map(file=>file+'\n\n'+fs.readFileSync(path.join(root,file),'utf8')).join('\n\n');
html=html.replace('</body>',()=>'<template id="dk-license-notices">'+notices.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</template>\n</body>');
fs.mkdirSync(path.join(root,'dist'),{recursive:true});fs.writeFileSync(path.join(root,'dist','devkit.html'),html);console.log('Built dist/devkit.html ('+Buffer.byteLength(html)+' bytes)');
