import axios from "axios";
import Debug from 'debug';
import fs from 'fs';
const debug = Debug("app");

class Scraper {
    index: number;

    constructor() {
        this.index = 1;
    }

    get f2Url(): string {
        return `https://www.f2pool.com/miner?id=${this.index}`
    }

    async getUrl() {
        try {
            const {data, status} = await axios.get(this.f2Url)
            // debug(data)
            fs.writeFileSync(`${process.cwd()}/.tmp/f2-${this.index}.html`, data)
            debug("SUCCESS", this.index, status);
        } catch (e) {
            debug(e);
        }
    }

    async getAll() {
        while (true) {
            await this.getUrl();
            this.index++;
        }
    }
}

const scraper = new Scraper();

debug(scraper.f2Url);

scraper.getAll().then(() => debug("SUCCESS"))
    .catch(debug);

//