import {createClient} from '@/lib/supabase/server';
import CodeInterpreter, {Sandbox} from '@e2b/code-interpreter';
import {NextResponse} from 'next/server';

export async function GET() {
  //   const supabase = createClient();
  //   const {
  //     data: {session},
  //   } = await supabase.auth.getSession();
  //   console.log(session.provider_token);

  const sandbox = await Sandbox.create({
    template: 'base',
    onStdout: (output) => console.log('sandbox', output.line),
    onStderr: (output) => console.log('sandbox', output.line),
  });
  const code = await sandbox.process.start({
    cmd: 'mkdir code-execute',
  });

  await code.wait();

  console.log(code.output.stdout);

  const cd = await sandbox.process.start({
    cmd: 'cd ./code-execute',
  });

  await cd.wait();

  console.log(cd.output.stdout);

  const touch = await sandbox.process.start({
    cmd: 'touch hello.py',
  });

  await touch.wait();

  console.log(touch.output.stdout);

  const gitInit = await sandbox.process.start({
    cmd: 'git init',
  });

  await gitInit.wait();

  const ls = await sandbox.process.start({
    cmd: 'ls -la',
  });

  await ls.wait();

  console.log(ls.output.stdout);

  console.log(gitInit.output.stdout);

  const setGitConfig = await sandbox.process.start({
    cmd: 'git config --global user.email "jackdewinter1@gmail.com" && git config --global user.name "projectpilot"',
  });

  await setGitConfig.wait();

  console.log(setGitConfig.output.stdout);

  const gitSetRemote = await sandbox.process.start({
    cmd: 'git branch -M main && git remote add origin https://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@github.com/dewinterjack/code-execute.git',
  });

  await gitSetRemote.wait();

  console.log(gitSetRemote.output.stdout);

  const gitAdd = await sandbox.process.start({
    cmd: 'git add . && git commit -m "Initial commit" && git push -u origin main',
  });

  await gitAdd.wait();

  console.log(gitAdd.output.stdout);

  await sandbox.close();

  return NextResponse.json({result: 'success'});
}
