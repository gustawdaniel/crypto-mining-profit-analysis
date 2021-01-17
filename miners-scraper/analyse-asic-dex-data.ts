import fs from 'fs';

interface DEXminer {
    Asic: {
        ID: '100',
        Manufacturer: 'Bitfily',
        Model: 'Snow Panther B1+',
        ReleaseDate: '08/2018',
        Noise: '75',
        Price: '0',
        TimeStamp: '2019-06-21 16:39:30'
    },
    Algo: [
        {
            MinerID: '100',
            Algo: 'SHA-256',
            Hashrate: '24.5',
            Hashtype: 'Th/s',
            Power: '2100',
            Coins: '0.000190432',
            Coinstype: 'Bitcoin'
        }
    ]
}

enum Manufacturer {
    'Bitmain' = 'Bitmain',
    'Baikal' = 'Baikal',
    'Canaan' = 'Canaan',
    'PinIdea' = 'PinIdea',
    'Innosilicon' = 'Innosilicon',
    'iBeLink' = 'iBeLink',
    'Pantech' = 'Pantech',
    'Bitfury' = 'Bitfury',
    'MicroBT' = 'MicroBT',
    'Bitfily' = 'Bitfily',
    'BW' = 'BW',
    'Ebang' = 'Ebang',
    'PandaMiner' = 'PandaMiner',
    'Halong Mining' = 'Halong Mining',
    'ASICminer' = 'ASICminer',
    'FFMiner' = 'FFMiner',
    'Obelisk' = 'Obelisk',
    'Aladdin Miner' = 'Aladdin Miner',
    'FusionSilicon' = 'FusionSilicon',
    'Spondoolies' = 'Spondoolies',
    'Dayun' = 'Dayun',
    'GMO miner' = 'GMO miner',
    'StrongU' = 'StrongU',
    'Holic' = 'Holic'

}

enum CoinType {
    'Bitcoin' = 'Bitcoin',
    'Dash' = 'Dash',
    'DeepOnion' = 'DeepOnion',
    'BERNcash' = 'BERNcash',
    'Kobocoin' = 'Kobocoin',
    'Quark' = 'Quark',
    'DigiByte' = 'DigiByte',
    'Litecoin' = 'Litecoin',
    'Myriadcoin' = 'Myriadcoin',
    'Skeincoin' = 'Skeincoin',
    'Electra' = 'Electra',
    'SIBCoin' = 'SIBCoin',
    'Groestlcoin' = 'Groestlcoin',
    'Ethereum' = 'Ethereum',
    'Decred' = 'Decred',
    'Photon' = 'Photon',
    'SiaClassic' = 'SiaClassic',
    'Lbry-Credits' = 'Lbry-Credits',
    'Pascalcoin' = 'Pascalcoin',
    'Dero' = 'Dero',
    'Aeon' = 'Aeon',
    'Zcash' = 'Zcash',
    'Bytom' = 'Bytom',
    'SiaCoin' = 'SiaCoin',
    'Monacoin' = 'Monacoin',
    'Grin' = 'Grin'
}

enum Algorithm {
    'SHA-256' = 'SHA-256',
    'X11' = 'X11',
    'X13' = 'X13',
    'X14' = 'X14',
    'X15' = 'X15',
    'Quark' = 'Quark',
    'Qubit' = 'Qubit',
    'Scrypt' = 'Scrypt',
    'Myriad-Groestl' = 'Myriad-Groestl',
    'Skein' = 'Skein',
    'Nist5' = 'Nist5',
    'X11Gost' = 'X11Gost',
    'Groestl' = 'Groestl',
    'Ethash' = 'Ethash',
    'Blake256R14' = 'Blake256R14',
    'Blake256R8' = 'Blake256R8',
    'Blake2B' = 'Blake2B',
    'Lbry' = 'Lbry',
    'Pascal' = 'Pascal',
    'CryptoNight' = 'CryptoNight',
    'CryptoNight-Lite' = 'CryptoNight-Lite',
    'Equihash' = 'Equihash',
    'Cryptonight-V7' = 'Cryptonight-V7',
    'Tensority' = 'Tensority',
    'Blake2B-Sia' = 'Blake2B-Sia',
    'Lyra2REv2' = 'Lyra2REv2',
    'Cuckatoo31' = 'Cuckatoo31',
    'Cuckatoo32' = 'Cuckatoo32'
}

interface PLminer {
    name: string
    manufacturer: Manufacturer,
    release_date: string,
    noise: number, // dB
    algorithms: {
        coin: CoinType,
        algorithm: Algorithm,
        hashrate: number, // H/s
        power_consumption: number, // W
    }[],
    prices: {
        date: number, // sec from epoch
        price: number // usd
    }[],
    links: {
        url: string,
        access_time: string,
        comment: string
    }[],
    comment: string
}

const powerOf = (unit: string) => {
    const units = [
        {unit: 'H/s', power: 0},
        {unit: 'kH/s', power: 3},
        {unit: 'MH/s', power: 6},
        {unit: 'GH/s', power: 9},
        {unit: 'TH/s', power: 12},
    ];

    const normalizedUnit = unit
        .replace('sol', 'h')
        .replace('GPS', 'h/s')
        .trim();

    const selected = units.find(u => u.unit.toLowerCase() === normalizedUnit.toLowerCase());
    if (selected) return Math.pow(10, selected.power);
    throw new Error(`NO UNIT DEFINED: [${unit}]`);
}

const main = async (): Promise<PLminer[]> => {
    const asics = JSON.parse(fs.readFileSync(process.cwd() + '/out/asic-dex-miners-full.json').toString())

    const asicsN = asics.map((a: DEXminer): PLminer => {
        const rd = a.Asic.ReleaseDate;

        const prices = [];
        if (Number.parseFloat(a.Asic.Price)) {
            prices.push({
                date: Date.UTC(parseInt(rd.split('/')[1]), parseInt(rd.split('/')[0]) - 1, 1) / 1000,
                price: Number.parseFloat(a.Asic.Price)
            })
        }

        return {
            name: a.Asic.Model.trim(),
            manufacturer: a.Asic.Manufacturer.trim() as Manufacturer,
            algorithms: a.Algo.map(alg => {
                return {
                    algorithm: alg.Algo as Algorithm,
                    coin: alg.Coinstype as CoinType,
                    hashrate: parseFloat(alg.Hashrate) * powerOf(alg.Hashtype),
                    power_consumption: parseFloat(alg.Power)
                }
            }),
            links: [{
                url: 'https://asic-dex.com/wp-content/themes/master-blog/asicminer.php\\?q\\=table',
                access_time: '2020-01-09',
                comment: 'ASIC DEX api'
            }],
            noise: Number.parseFloat(a.Asic.Noise),
            prices,
            release_date: rd,
            comment: ""
        }
    })

    // const withPrice = asics.filter((a:any) => Number.parseFloat(a.Asic.Price));

    // console.log("withPrice", withPrice.length)

    // const withETH = withPrice.filter((a:any) => a.Algo.some((alg:any) => alg.Coinstype === 'Ethereum'))

    // console.log("withETH", withETH.length)

    // return withETH

    fs.writeFileSync(process.cwd()+'/out/pl-miners.json', JSON.stringify(asicsN));

    return asicsN;
}

main().then(r => console.dir(r, {depth: null})).catch(console.error);