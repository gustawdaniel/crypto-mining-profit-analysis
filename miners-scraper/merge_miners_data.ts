import fs from 'fs'

const outDir = () => `${process.cwd()}/out`;

interface F2miner {
    fileName: string, // 'f2-1.html',
    name: string, // 'Antminer S9',
    manufacturer: string, // 'Bitmain',
    release_date: string, // '2016/07',
    hashrate: string, // '13 T',
    power_consumption: string, // '1300 W',
    algorithm: string, // 'SHA256d',
    coins: string[], // [ 'BTC', 'BCHN', 'BSV', 'DGB-SHA256D' ],
    image: string, // 'https://static.f2pool.com/assets/mining-machine/img/antminer_s9.jpg'
}

interface CCminer {
    image: string, // 'https://www.cryptocompare.com/media/1383573/geforce-gtx-1080ti.png?anchor=center&mode=crop&width=100&height=100',
    name: string, // 'nVidia Geforce GTX 1080 TI ZCash Mining GPU',
    link: string, // 'https://www.cryptocompare.com/mining/nvidia/nvidia-geforce-gtx-1080-ti-zcash-mining/',
    price: string, // '$ 700.00',
    hashrate: string, // '680.0 H/s',
    coin: string, // ' ZEC'
}


const main = async () => {
    const cc: CCminer[] = JSON.parse(fs.readFileSync(`${outDir()}/cc-all-miners.json`).toString());
    const f2: F2miner[] = JSON.parse(fs.readFileSync(`${outDir()}/f2-miners.json`).toString());

    const res = f2.filter(m => m.coins.includes('ETH')).map(m => {
        return {
            lookup: cc.filter(c => c.coin.trim() === "ETH").filter(c => new RegExp(m.name.replace(/\(.*\)/, '')
                .replace('8 cards', '')
                .trim(), "i")
                .test(c.name)),
            ...m
        }
    });

    console.log("FOUND", res.filter(r => r.lookup.length));

    return res;
}

main().then(console.dir).catch(console.error)