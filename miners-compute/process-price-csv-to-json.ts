import fs from 'fs';

const main = () => {
    const file = fs.readFileSync('./raw/2015-08-07_2021-01-06_ethereum_price.csv')
        .toString()
        .split('\n')
        .filter((e, i) => i > 0)
        .map(l => l.split(',').filter((e, i) => i <= 1).map(v => parseFloat(v.replace(/"/g, '').trim())))
        .map(l => ({day: Math.round(l[0] / (3600 * 24)), price: l[1]}))

    console.log(file);

    fs.writeFileSync('./data/price.json', JSON.stringify(file));
}

main();