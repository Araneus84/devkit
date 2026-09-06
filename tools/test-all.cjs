const {spawnSync}=require('node:child_process'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),resultsDir=path.join(root,'test-results');fs.rmSync(resultsDir,{recursive:true,force:true});fs.mkdirSync(resultsDir,{recursive:true});
const help={
 'ansible-live-sync.cjs':'Fix Ansible parsing, completion repair, focus, or undo behavior.',
 'browser-deep.cjs':'Fix deep-editor rendering, drag/drop, history, imports, downloads, or responsive preview.',
 'cicd-browser.cjs':'Fix the GitHub Actions, GitLab CI, or Jenkins interactive builders.',
 'cicd-graph-browser.cjs':'Fix visual pipeline nodes, dependency editing, graph validation, map navigation, or responsive layout.',
 'cicd.cjs':'Fix CI/CD generation or structural validation.',
 'code-editor-browser.cjs':'Fix editor geometry, input, Vim, syntax coloring, or editor mounting.',
 'compact-editor.cjs':'Fix blank starts, starter actions, compact layout, or completion visibility.',
 'deep.cjs':'Fix a deep-editor data model or generated syntax.',
 'diagnostics-browser.cjs':'Fix inline syntax/schema diagnostics, secret detection, repair actions, source ranges, or safe project variables.',
 'editor-assist-browser.cjs':'Fix Tab completion, suggestions, or Enter indentation for the named language.',
 'editor-modes-browser.cjs':'Fix Guided, Standard or Expert layout, persistence, backup portability, shared-document safety, or editor coverage.',
 'interactions-browser.cjs':'Fix pointer/keyboard block controls or invalid-source recovery.',
 'ops-browser.cjs':'Fix Python operations, module search, or generated dependencies.',
 'python-browser.cjs':'Fix Python code/block sync, parsing, imports, or responsive UI.',
 'python-ops.cjs':'Fix a Python operation definition or generated example.',
 'python-roundtrip.cjs':'Fix Python parse/generate round trips.',
 'python.cjs':'Fix the Python model, package operations, or syntax detection.',
 'project-archive-browser.cjs':'Fix project ZIP portability, snapshot history, line diffs, migration, or safe restore.',
 'project-workspace-browser.cjs':'Fix project storage, templates, file trees, tabs, imports, exports, or editor integration.',
 'recipes.cjs':'Fix recipe registration, generated file syntax, or offline assets.',
 'recipe-packs.cjs':'Fix the JSON-only recipe-pack contract, template interpreter, limits, quoting, IDs, or malicious-input rejection.',
 'recipe-packs-browser.cjs':'Fix recipe-pack storage, import, management, search/schema integration, backup validation, inert rendering, or responsive offline behavior.',
 'roundtrip-adapters.cjs':'Fix fresh-source reconstruction for the reported language.',
 'roundtrip-browser.cjs':'Fix live code/block reconstruction, history, or draft reload.',
 'schema-registry-browser.cjs':'Fix schema registration, normalized module metadata, or registry-backed editor behavior.',
 'security-browser.cjs':'Fix unsafe rendering, parser limits, backup validation, privacy, or network isolation.',
 'source-sync-browser.cjs':'Fix two-way source/block synchronization for the reported editor.',
 'unified-search-browser.cjs':'Fix fuzzy intent ranking, unified index coverage, result actions, filters, keyboard navigation, safe rendering, mobile layout, or offline behavior.',
 'uploads.cjs':'Fix file selection/drop, byte preservation, fallback, recovery, or download.',
 'yaml-cst-browser.cjs':'Fix comment-preserving YAML integration across deep, CI/CD, Ansible, project, modular, or standalone editors.',
 'yaml-cst-roundtrip.cjs':'Fix the YAML CST reconciliation engine, comments, anchors, aliases, quote styles, ordering, or parser limits.',
 'workspace-browser.cjs':'Fix saved drafts, reset/undo, filename validation, or Vim persistence.'
};
const filter=process.env.DEVKIT_TEST_FILTER,tests=fs.readdirSync(path.join(root,'tests')).filter(name=>name.endsWith('.cjs')&&(!filter||name.includes(filter))).sort(),runs=[{name:'portable build',command:process.execPath,args:['tools/build.cjs'],fix:'Fix the manifest, source bundle order, or standalone build.'},...tests.map(name=>({name,command:process.execPath,args:[path.join('tests',name)],fix:help[name]||'Inspect this test log and repair the failing behavior.'}))],report=[];
for(const run of runs){process.stdout.write(`\n== ${run.name} ==\n`);const started=Date.now(),result=spawnSync(run.command,run.args,{cwd:root,env:process.env,encoding:'utf8',maxBuffer:16*1024*1024}),output=(result.stdout||'')+(result.stderr||'');process.stdout.write(output);const ok=result.status===0;report.push({...run,ok,seconds:((Date.now()-started)/1000).toFixed(1),output});fs.writeFileSync(path.join(resultsDir,run.name.replace(/[^a-z0-9.-]+/gi,'-')+'.log'),output);if(!ok)process.stdout.write(`::error title=${run.name} failed::${run.fix}\n`);}
const failed=report.filter(x=>!x.ok),summary=['# DevKit QA '+(failed.length?'failed':'passed'),'','| Check | Result | Time |','| --- | --- | ---: |',...report.map(x=>`| ${x.name} | ${x.ok?'✅ Passed':'❌ Failed'} | ${x.seconds}s |`)];if(failed.length){summary.push('','## What failed and what to fix');for(const item of failed){const excerpt=item.output.trim().split(/\r?\n/).slice(-18).join('\n');summary.push('',`### ${item.name}`,'',item.fix,'','```text',excerpt,'```');}}else summary.push('','All build, model, interaction, round-trip, upload, security, responsive-layout, syntax-coloring, completion, and Vim checks passed.');const markdown=summary.join('\n')+'\n';fs.writeFileSync(path.join(resultsDir,'qa-report.md'),markdown);if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,markdown);console.log(`\n${report.length-failed.length}/${report.length} checks passed. Report: test-results/qa-report.md`);if(failed.length)process.exitCode=1;
