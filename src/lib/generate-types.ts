const { exec } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const { config } = require('dotenv');

config();
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID;
const command = `npx supabase gen types typescript --project-id "${SUPABASE_PROJECT_ID}" --schema public > ./lib/supabase.types.ts`;
const databaseTypesPath = resolve(__dirname, './supabase.types.ts');
const typesPath = resolve(__dirname, './database.types.ts');

const toSingular = (tableName: string) => {
  if (tableName.toLowerCase().endsWith('s')) {
    return tableName.slice(0, -1);
  }
  return tableName;
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

exec(command, (error: Error | null, stdout: string, stderr: string) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  // Read the content of the updated supabase.types.ts file
  const databaseTypesContent = readFileSync(databaseTypesPath, 'utf-8');
  
  // This regular expression is used to match and capture the table definitions
  // If this is suddenly broken it may be because supabase has changed how type generation works
  const tableRegex = /(\w+): {\s+Row: {([\s\S]*?)}\s+Insert: {([\s\S]*?)}\s+Update: {([\s\S]*?)}/g;

  let match;
  let typesToAppend = [];

  while ((match = tableRegex.exec(databaseTypesContent)) !== null) {
    const tableNameSingular = toSingular(match[1]);
    const typeName = capitalizeFirstLetter(tableNameSingular);
    
    // Row type
    const rowProperties = match[2].trim().split('\n').map(prop => `  ${prop.trim()}`).join('\n');
    typesToAppend.push(`export type ${typeName} = {\n${rowProperties}\n};`);

    // Insert type
    const insertProperties = match[3].trim().split('\n').map(prop => `  ${prop.trim()}`).join('\n');
    typesToAppend.push(`export type Insert${typeName} = {\n${insertProperties}\n};`);

    // Update type
    const updateProperties = match[4].trim().split('\n').map(prop => `  ${prop.trim()}`).join('\n');
    typesToAppend.push(`export type Update${typeName} = {\n${updateProperties}\n};`);
  }

  writeFileSync(typesPath, typesToAppend.join('\n\n') + '\n');
});
