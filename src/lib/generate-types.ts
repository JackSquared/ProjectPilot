const { exec } = require('child_process');
const { config } = require('dotenv');

config();
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID;
const command = `npx supabase gen types typescript --project-id "${SUPABASE_PROJECT_ID}" --schema public > ./lib/supabase.types.ts`;

exec(command, (error: Error | null, stdout: string, stderr: string) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
})
