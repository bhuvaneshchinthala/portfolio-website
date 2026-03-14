import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
const componentsDir = path.join(srcDir, 'components');

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

const allSrcFiles = getAllFiles(srcDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.astro'));
const componentFiles = allSrcFiles.filter(f => f.includes('/components/') && f.endsWith('.tsx'));

const results = [];

for (const compPath of componentFiles) {
    const baseName = path.basename(compPath, '.tsx');
    let used = false;

    for (const srcPath of allSrcFiles) {
        if (srcPath === compPath) continue; // Skip self

        const content = fs.readFileSync(srcPath, 'utf8');
        if (content.includes(baseName)) {
            used = true;
            break;
        }
    }

    if (!used) {
        results.push(compPath);
    }
}

console.log("Unused Components:");
results.forEach(r => console.log(r.replace(process.cwd(), '')));
