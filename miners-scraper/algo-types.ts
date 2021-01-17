import fs from "fs";

const main = async () => {
    const asics = JSON.parse(fs.readFileSync(process.cwd() + '/out/asic-dex-miners-full.json').toString())

    const algorithms = new Set();
    const coin_types = new Set();
    const manufacturers = new Set();

    asics.forEach((a:any) => {
        manufacturers.add(a.Asic.Manufacturer)
        a.Algo.forEach((a:any) => {
            algorithms.add(a.Algo)
            coin_types.add(a.Coinstype)
        })
    });

    // return algorithms;
    // return coin_types;
    return manufacturers;
}

main().then(r => console.dir(r, {depth: null})).catch(console.error);