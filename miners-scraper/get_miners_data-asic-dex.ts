import fs from 'fs';
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

const baseDir = () => {
    return `${process.cwd()}/.tmp`
}

const getFiles = () => {
    return fs.readdirSync(baseDir()).filter(n => n.startsWith('ad-')).filter((e,i) => i===0);
}

const selectors = (document: any) => {
    return {
        release_price: document.querySelector('#roi-table-release-price').textContent,
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

    // fs.writeFileSync(`${process.cwd()}/out/f2-miners.json`, JSON.stringify(f2Miners));

    return f2Miners;
}

main().then(console.dir).catch(console.error)