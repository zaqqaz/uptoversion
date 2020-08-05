import { execSync } from 'child_process';
import fs from "fs";

enum PackageManager {
    Npm = 'npm',
    Yarn = 'yarn',
}

const randomString = (length: number) => [ ...Array(length) ].map(() => (~~(Math.random() * 36)).toString(36)).join('');

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

function createPR(branchName: string, packageName: string, version: string) {
    [
        `git push -u origin ${branchName}`,
        `hub pull-request -h ${branchName} -m "Update ${packageName} to v.${version}"`
    ].forEach(execSyncFromProjectFolder);
}

function run() {
    const repoName = process.env.RepoName!;
    const packageName = process.env.PackageName!;
    const packageVersion = process.env.PackageVersion!;
    const hash = randomString(4);
    const branchName = `${packageName}@${packageVersion}-${hash}`;

    checkoutRepo(repoName);
    createBranch(branchName);
    updatedDependency(PackageManager.Npm, packageName, packageVersion);
    commit(packageName, packageVersion);
    createPR(branchName, packageName, packageVersion);
}

const root = fs.mkdtempSync("tmp");

try {
    run();
} catch (e) {
    console.error(e);
}

fs.rmdirSync(root, { recursive: true });
