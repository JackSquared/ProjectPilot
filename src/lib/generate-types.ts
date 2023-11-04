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
  const tableRegex = /(\w+): {\s+Row: {([\s\S]*?)}\s+Insert:/g;

  let match;
  let typesToAppend = [];
  
  while ((match = tableRegex.exec(databaseTypesContent)) !== null) {
    const tableNameSingular = toSingular(match[1]);
    const typeName = capitalizeFirstLetter(tableNameSingular);
    const properties = match[2].trim().split('\n').map(prop => `  ${prop.trim()}`).join('\n');
    typesToAppend.push(`export type ${typeName} = {\n${properties}\n};`);
  }

  // Write the new content to types.ts
  writeFileSync(typesPath, typesToAppend.join('\n\n') + '\n');
});
