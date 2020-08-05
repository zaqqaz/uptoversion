import { execSync } from 'child_process';
import fs from "fs";
import { Octokit } from "@octokit/rest";

enum PackageManager {
    Npm = 'npm',
    Yarn = 'yarn',
}

const randomString = (length: number) => [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('');

function execSyncFromProjectFolder(cmd: string) {
    execSync(`cd ./${root} && ${cmd}`);
}

function checkoutRepo(repoName: string) {
    const cmd = `git clone git@github.com:${repoName}.git ${root}`
    execSync(cmd);
}

function createBranch(branchName: string) {
    [
        `git checkout -b ${branchName}`
    ].forEach(execSyncFromProjectFolder);
}

function updatedDependency(
    packageManager: PackageManager = PackageManager.Npm,
    packageName: string,
    version: string
) {
    if (packageManager === PackageManager.Npm) {
        execSyncFromProjectFolder(`npm i ${packageName}@${version}`);
    } else {
        execSyncFromProjectFolder(`yarn add ${packageName}@${version}`);
    }
}

function commit(packageName: string, version: string) {
    [
        `git add .`,
        `git commit -m "Update ${packageName} to v.${version}"`
    ].forEach(execSyncFromProjectFolder);
}

async function createPR(
    branchName: string,
    packageName: string,
    version: string,
    repoName: string,
    baseBranch: string = "master"
) {
    [
        `git push -u origin ${branchName}`,
    ].forEach(execSyncFromProjectFolder);

    const [owner, repo] = repoName.split('/')
    await octokit.pulls.create({
        owner,
        repo,
        title: `Update ${packageName} to v.${version}`,
        head: branchName,
        base: baseBranch,
    });
}

async function run() {
    const repoName = process.env.RepoName!;
    const packageName = process.env.PackageName!;
    const packageVersion = process.env.PackageVersion!;
    const baseBranch = process.env.BaseBranch;

    const hash = randomString(4);
    const branchName = `${packageName}@${packageVersion}-${hash}`;

    checkoutRepo(repoName);
    createBranch(branchName);
    updatedDependency(PackageManager.Npm, packageName, packageVersion);
    commit(packageName, packageVersion);
    await createPR(branchName, packageName, packageVersion, repoName, baseBranch);
}

const octokit = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`
});

const root = fs.mkdtempSync("tmp");

run()
    .then(() => {
        fs.rmdirSync(root, { recursive: true });
    })
    .catch(e => {
        console.error(e);
        fs.rmdirSync(root, { recursive: true });
    });

