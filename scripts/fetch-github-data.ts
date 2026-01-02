import {
  ensureDataDir,
  fetchGitHubRepo,
  saveRepoData,
  updateIndex,
} from '../src/lib/github';

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error(
      '使用方法: pnpm tsx scripts/fetch-github-data.ts <owner> <repo>',
    );
    process.exit(1);
  }

  const [owner, repo] = args;
  const repoKey = `${owner}/${repo}`;

  console.log(`正在获取 ${repoKey} 的信息...`);

  ensureDataDir();

  try {
    const repoData = await fetchGitHubRepo(owner, repo);
    saveRepoData(owner, repo, repoData);
    updateIndex(repoKey);
    console.log(`成功获取 ${repoKey} 的信息`);
  } catch (error) {
    console.error(
      `错误: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error(
      `错误: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  });
