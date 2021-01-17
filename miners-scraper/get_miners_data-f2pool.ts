import fs from 'fs';

const jsdom = require("jsdom");
const {JSDOM} = jsdom;

const baseDir = () => {
    return `${process.cwd()}/.tmp`
}

const getFiles = () => {
    return fs.readdirSync(baseDir())
}

const selectors = (document: any) => {
    return {
        name: document.querySelector('.main-info .info-section h2').textContent,
        manufacturer: document.querySelector('.main-info .info-section .info .info-item:first-child span:last-child').textContent,
        release_date: document.querySelector('.main-info .info-section .info>div:nth-of-type(2) .info-item:nth-of-type(1) span:last-of-type').textContent,
        hashrate: document.querySelector('.main-info .info-section .info .info-item:nth-child(2) span:last-child').textContent.trim(),
        power_consumption: document.querySelector('.main-info .info-section .info>div:nth-of-type(2) .info-item:nth-of-type(2) span:last-of-type').textContent,
        algorithm: document.querySelector('.main-info .info-section .info>div:nth-of-type(4) span:last-of-type').textContent,
        coins: [...document.querySelectorAll('.main-info .info-section .support-currency span')].map(span => span.textContent),
        image: document.querySelector('.main-info .img-container').style.backgroundImage.replace(/^url\(/, '').replace(/\)$/, '')
    }
}

const processFile = (name: string) => {
    const html = fs.readFileSync(`${baseDir()}/${name}`).toString();
    const dom = new JSDOM(html);

    return {
        fileName: name,
        ...selectors(dom.window.document)
    }

    // dom.window.document.querySelector("p").textContent

    // return html
}

const main = async () => {
    const files = getFiles();

    const f2Miners = files.map(processFile)

    fs.writeFileSync(`${process.cwd()}/out/f2-miners.json`, JSON.stringify(f2Miners));

    return f2Miners;
}

main().then(console.dir).catch(console.error)