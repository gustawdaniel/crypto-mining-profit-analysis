import miners from './data/pl-miners.json'
import electricityPrice from './data/electricity-price.json'
import difficultyDict from './data/difficulty.json';
import prices from './data/price.json'
import fs from "fs";

interface Account {
    usd: number,
    eth: number
    miner: Miner | undefined,
    alt: number
}

const account: Account = {
    usd: 0,
    eth: 0,
    miner: undefined,
    alt: 0
}

const dayToSec = 24 * 3600;

const date = (day: number): Date => {
    return new Date(day * dayToSec * 1000);
}

const getBestMiner = (day: number): Miner | undefined => {
    const possibleMiners = miners.filter(m => m.date < day);
    if (!possibleMiners.length) return undefined;
    return possibleMiners.reduce((p, n) => {
        return p.hashrate / p.power > n.hashrate / n.power ? p : n;
    })
}

interface Miner {
    "name": string,
    "manufacturer": string,
    "date": number,
    "price": number,
    "hashrate": number,
    "power": number
}

const buyAlt = (day: number, price_usd: number) => {
    account.alt += price_usd / price(day);
}

const buyMiner = (miner: Miner) => {
    console.log(miner);
    account.usd -= miner.price;
    account.miner = miner;
}

const buyElectricity = (day: number, miners: Miner[]) => {
    const before = account.usd;
    const usdToPln = 3.7
    const year = date(day).getFullYear();
    const plnPrice = electricityPrice.find(e => e.year === year);
    if (!plnPrice) throw new Error('ELECTRICITY PRICE NOT DEFINED');
    miners.forEach(miner => {
        const cost = plnPrice.price_pln / usdToPln * 24 * miner.power / 1000;
        account.usd -= cost
        buyAlt(day, cost);
    })
    return account.usd - before
}

const prizeFunction = (day: number): number => {
    const bizantium = 17456, constantinopol = 17955;
    return day < bizantium ? 5 : day < constantinopol ? 3 : 2;
}

const difficulty = (day: number): number => {
    if (difficultyDict.hasOwnProperty(day)) {
        //@ts-ignore
        return difficultyDict[day]
    } else {
        throw new Error('difficultyDict NOT DEFINED');
    }
}

const receiveETH = (day: number, miners: Miner[]) => {
    const before = account.eth;
    miners.forEach(m => {
        const minedHash = m.hashrate * dayToSec / 1e12; // [TH]
        const minedPrize = minedHash / (difficulty(day))
        account.eth += minedPrize * prizeFunction(day);
    })
    return account.eth - before;
}

const price = (day: number): number => {
    const currentLog = prices.find(p => p.day === day);
    if (!currentLog) throw new Error(`NO PRICE FOR DAY ${day} - ${date(day).toLocaleDateString()}`);
    return currentLog.price || 0;
}

const log = [];

for (let day = 16654; day < 18627; day++) {
    if (getBestMiner(day) && !account.miner) {
        const miner = getBestMiner(day) as Miner
        buyMiner(miner);
        buyAlt(day, miner.price)
    }

    const today = {
        el: 0,
        mined: 0
    }

    if (account.miner) {
        today.el = buyElectricity(day, [account.miner])
        today.mined = receiveETH(day, [account.miner]) * price(day);
    }
    // if (day > 16654 + 1200) process.exit();

    console.log(
        date(day), day, getBestMiner(day) ? 'Y' : 'N', account.usd, account.eth, price(day) * account.eth,
        price(day) * account.alt,
        today.el.toFixed(2),
        today.mined.toFixed(2),
        (today.mined + today.el).toFixed(2)
    )

    log.push([date(day), day, getBestMiner(day) ? 'Y' : 'N', account.usd, account.eth, price(day) * account.eth,
        price(day) * account.alt,
        today.el.toFixed(2),
        today.mined.toFixed(2),
        (today.mined + today.el).toFixed(2)].join(','));
}

fs.writeFileSync('./out/out.csv', log.join('\n'));