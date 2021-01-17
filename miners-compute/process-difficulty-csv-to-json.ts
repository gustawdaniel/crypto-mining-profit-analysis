import fs from 'fs';

const main = () => {
    const file = fs.readFileSync('./raw/export-BlockDifficulty.csv')
        .toString()
        .split('\n')
        .filter((e, i) => i > 0)
        .map(l => l.split(',').filter((e, i) => i > 0).map(v => parseFloat(v.replace(/"/g, '').trim()))).reduce((p: any, n: any) => {
            return {
                ...p,
                [n[0] / (3600 * 24)]: n[1]
            }
        }, {});

    delete file.NaN

    console.log(file);

    fs.writeFileSync('./data/difficulty.json', JSON.stringify(file));
}

main();