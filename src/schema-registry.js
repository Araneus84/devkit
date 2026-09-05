/* One normalized contract for reference modules, structured profiles, recipes and editor assistance. */
const DK_SCHEMA_VERSION=1,DK_SCHEMAS=Object.create(null),DK_SCHEMA_ALIASES=Object.create(null);
const DK_SCHEMA_ASSIST_CATALOG={
 bash:['echo ""','printf \'%s\\n\' ""','name=""','if [[ -n "${name}" ]]; then','for item in "${items[@]}"; do','while [[ -n "${value}" ]]; do','function name() {','return 0','set -euo pipefail'],
 powershell:['Write-Output ""','$name = ""','if ($name) {','foreach ($item in $items) {','while ($value) {','function Invoke-Task {','try {','return 0'],
 python:['import os','from pathlib import Path','def main():','if condition:','for item in items:','while condition:','try:','with open("path") as handle:','return None','print("")'],
 terraform:['terraform {','required_providers {','provider "" {','variable "" {','locals {','resource "" "" {','data "" "" {','module "" {','output "" {'],
 sql:['SELECT  FROM ;','WITH name AS (','INSERT INTO  () VALUES ();','UPDATE  SET  WHERE ;','DELETE FROM  WHERE ;','CREATE TABLE  ();','WHERE ','GROUP BY ','ORDER BY ','LIMIT 10;'],
 dockerfile:['FROM alpine:3.22','ARG NAME=""','WORKDIR /app','COPY . /app','RUN ','ENV NAME=""','EXPOSE 8080','USER app','ENTRYPOINT []','CMD []','HEALTHCHECK CMD '],
 json:['"name": ""','"enabled": true','"items": []','"config": {}','true','false','null'],
 yaml:['name: ""','hosts: ""','vars:','tasks:','handlers:','- name: ""','enabled: true','items: []'],
 github:['name: ""','on:','permissions:','env:','jobs:','runs-on: ubuntu-latest','needs:','steps:','- name: ""','uses: actions/checkout@v4','run: '],
 gitlab:['stages:','variables:','default:','image:','stage: test','needs:','script:','rules:','artifacts:','cache:','- echo ""'],
 jenkins:['pipeline {','agent any','options {','environment {','stages {','stage(\'\') {','steps {','sh \'\'','post {','always {'],
 ansible:['- name: ""','name: ""','hosts: ""','gather_facts: false','become: true','vars:','tasks:','handlers:','ansible.builtin.ping: {}','ansible.builtin.package:','ansible.builtin.service:','ansible.builtin.copy:','ansible.builtin.template:','ansible.builtin.command:','ansible.builtin.shell:'],
 command:[]
};
const DK_SCHEMA_EDITOR={
 bash:{mode:'text/x-sh',indentUnit:2},powershell:{mode:'application/x-powershell',indentUnit:4},python:{mode:'python',indentUnit:4},terraform:{mode:'text/x-sh',indentUnit:2,structured:true},sql:{mode:'text/x-sql',indentUnit:2},dockerfile:{mode:'dockerfile',indentUnit:2},docker:{mode:'dockerfile',indentUnit:2,assistId:'dockerfile'},json:{mode:{name:'javascript',json:true},indentUnit:2,structured:true},yaml:{mode:'yaml',indentUnit:2,structured:true},ansible:{mode:'yaml',indentUnit:2,structured:true},github:{mode:'yaml',indentUnit:2,structured:true},'github-actions':{mode:'yaml',indentUnit:2,structured:true,assistId:'github'},gitlab:{mode:'yaml',indentUnit:2,structured:true},'gitlab-ci':{mode:'yaml',indentUnit:2,structured:true,assistId:'gitlab'},jenkins:{mode:'groovy',indentUnit:2},cicd:{mode:'yaml',indentUnit:2},command:{mode:null,indentUnit:2}
};
const DK_SCHEMA_PROFILE_SHEETS={dockerfile:'docker','github-actions':'cicd','gitlab-ci':'cicd',jenkins:'cicd',yaml:'linux',json:'linux'};
function dkSchemaEditorDefaults(id){const value=DK_SCHEMA_EDITOR[id]||{mode:null,indentUnit:2};return {assistId:value.assistId||id,mode:value.mode??null,indentUnit:value.indentUnit||2,structured:!!value.structured};}
function dkSchemaRegister(definition){
 if(!definition||definition.schemaVersion!==DK_SCHEMA_VERSION||!/^[a-z0-9][a-z0-9-]*$/.test(definition.id))throw Error('Invalid DevKit schema definition.');
 if(DK_SCHEMAS[definition.id])throw Error('Duplicate DevKit schema: '+definition.id);
 const schema={kind:'reference',title:definition.id,description:'',sheet:null,profile:null,recipes:[],builders:[],aliases:[],...definition};
 schema.editor={...dkSchemaEditorDefaults(schema.id),...(schema.editor||{})};schema.assist={id:schema.editor.assistId,catalog:[...(definition.assist?.catalog||DK_SCHEMA_ASSIST_CATALOG[schema.editor.assistId]||[])]};
 DK_SCHEMAS[schema.id]=schema;for(const alias of schema.aliases){if(DK_SCHEMA_ALIASES[alias]||DK_SCHEMAS[alias])throw Error('Duplicate DevKit schema alias: '+alias);DK_SCHEMA_ALIASES[alias]=schema.id;}return schema;
}
function dkSchemaGet(id){return DK_SCHEMAS[id]||DK_SCHEMAS[DK_SCHEMA_ALIASES[id]]||null;}
function dkSchemaProfile(id){return dkSchemaGet(id)?.profile||null;}
function dkSchemaEditorId(item){if(item?.el?.id==='ab-preview')return'ansible';if(item?.el?.id==='sx-command-preview')return'command';if(item?.el?.id==='dk-preview')return dkActive?.sheet||'command';return ddState?.profile||'command';}
function dkSchemaForEditor(item){return dkSchemaGet(dkSchemaEditorId(item))||dkSchemaGet('command');}
function dkSchemaAudit(){
 const errors=[];
 for(const schema of Object.values(DK_SCHEMAS)){
  if(!schema.title||!schema.editor||!Array.isArray(schema.assist.catalog))errors.push(schema.id+': incomplete schema metadata');
  if(schema.profile){const p=schema.profile;if(!p.root||!p.types||typeof p.generate!=='function'||typeof p.seed!=='function')errors.push(schema.id+': incomplete structured profile');else{for(const type of p.root.accept)if(!p.types[type])errors.push(schema.id+': unknown root block '+type);for(const [type,def] of Object.entries(p.types)){if(!def.fields||!def.slots)errors.push(schema.id+': incomplete block '+type);for(const slot of Object.values(def.slots||{}))for(const child of slot.accept||[])if(!p.types[child])errors.push(schema.id+': '+type+' accepts unknown block '+child);}}}
  for(const id of schema.recipes)if(!DK_RECIPES[id])errors.push(schema.id+': missing recipe '+id);
  for(const key of schema.builders)if(!BUILDERS[key])errors.push(schema.id+': missing builder '+key);
 }
 for(const key of Object.keys(SHEETS))if(!DK_SCHEMAS[key])errors.push(key+': sheet has no schema');
 for(const id of Object.keys(DD_PROFILES))if(!Object.values(DK_SCHEMAS).some(schema=>schema.profile===DD_PROFILES[id]))errors.push(id+': profile has no schema');
 return errors;
}
function dkSchemaBootstrap(){
 const recipesBySheet=Object.create(null),buildersBySheet=Object.create(null);for(const recipe of Object.values(DK_RECIPES))(recipesBySheet[recipe.sheet]??=[]).push(recipe.id);for(const key of Object.keys(BUILDERS))(buildersBySheet[key.split('::')[0]]??=[]).push(key);
 for(const [id,sheet] of Object.entries(SHEETS))dkSchemaRegister({schemaVersion:DK_SCHEMA_VERSION,id,title:sheet.name,description:sheet.subtitle||'',sheet,recipes:recipesBySheet[id]||[],builders:buildersBySheet[id]||[],editor:dkSchemaEditorDefaults(id)});
 for(const [id,profile] of Object.entries(DD_PROFILES)){const existing=DK_SCHEMAS[id],sheetId=DK_SCHEMA_PROFILE_SHEETS[id]||id,sheet=SHEETS[sheetId]||null,editor=dkSchemaEditorDefaults(id),definition={schemaVersion:DK_SCHEMA_VERSION,id,kind:'document',title:profile.title,description:profile.description,sheet,profile,recipes:recipesBySheet[sheetId]||[],builders:buildersBySheet[sheetId]||[],aliases:editor.assistId!==id&&!DK_SCHEMAS[editor.assistId]?[editor.assistId]:[],editor,io:{generate:profile.generate,seed:profile.seed,parse:(text,previous=[])=>sxParse(profile,text,previous)},blocks:{root:profile.root,types:profile.types}};if(existing){Object.assign(existing,definition);existing.assist={id:existing.editor.assistId,catalog:[...(DK_SCHEMA_ASSIST_CATALOG[existing.editor.assistId]||[])]};for(const alias of definition.aliases)DK_SCHEMA_ALIASES[alias]=id;}else dkSchemaRegister(definition);}
 if(!DK_SCHEMAS.ansible)dkSchemaRegister({schemaVersion:DK_SCHEMA_VERSION,id:'ansible',title:'Ansible',description:SHEETS.ansible?.subtitle||'',sheet:SHEETS.ansible||null,recipes:recipesBySheet.ansible||[],builders:buildersBySheet.ansible||[],editor:dkSchemaEditorDefaults('ansible')});
 dkSchemaRegister({schemaVersion:DK_SCHEMA_VERSION,id:'command',title:'Command builder',description:'Build a command from structured arguments and flags.',editor:dkSchemaEditorDefaults('command')});
}
dkSchemaBootstrap();
