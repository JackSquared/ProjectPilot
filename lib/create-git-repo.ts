import {Sandbox} from '@e2b/code-interpreter';

export const createGitRepo = async () => {
  const sandbox = await Sandbox.create({
    template: 'base',
    onStdout: (output) => console.log('sandbox', output.line),
    onStderr: (output) => console.log('sandbox', output.line),
  });
  const code = await sandbox.process.start({
    cmd: 'mkdir code-execute',
  });

  await code.wait();

  const cd = await sandbox.process.start({
    cmd: 'cd ./code-execute',
  });

  await cd.wait();

  const touch = await sandbox.process.start({
    cmd: 'touch hello.py',
  });

  await touch.wait();

  const gitInit = await sandbox.process.start({
    cmd: 'git init',
  });

  await gitInit.wait();

  const setGitConfig = await sandbox.process.start({
    cmd: 'git config --global user.email "jackdewinter1@gmail.com" && git config --global user.name "projectpilot"',
  });

  await setGitConfig.wait();

  const gitSetRemote = await sandbox.process.start({
    cmd: 'git branch -M main && git remote add origin https://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@github.com/dewinterjack/coderepo.git',
  });

  await gitSetRemote.wait();

  const gitAdd = await sandbox.process.start({
    cmd: 'git add . && git commit -m "Initial commit" && git push -u origin main',
  });

  await gitAdd.wait();

  await sandbox.close();
};
