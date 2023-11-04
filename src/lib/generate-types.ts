const { config } = require('dotenv');
const { exec } = require('child_process');

config();

const command = `npx supabase gen types typescript --project-id "${process.env.SUPABASE_PROJECT_ID}" --schema public > ./lib/database.types.ts`;

exec(command, (error: Error | null, stdout: string, stderr: string) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
});