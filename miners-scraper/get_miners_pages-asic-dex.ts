import axios from "axios";
import Debug from 'debug';
import fs from 'fs';

const debug = Debug("app");

class Scraper {
    async getUrl(link: string) {
        const {data, status} = await axios.get(link)
        const key = link.split('/').pop()
        fs.writeFileSync(`${process.cwd()}/.tmp/ad-${key}.html`, data)
        return {key, status};
    }

    async getAll() {
        const miners = JSON.parse(fs.readFileSync(`${process.cwd()}/out/ad-preview.json`).toString())

        for (let index = 0; index < miners.length; index++) {
            try {
                const {key, status} = await this.getUrl(miners[index].link);
                debug("SUCCESS", index, key, status);
            } catch (e) {
                debug(e);
            }
        }

        return miners;
    }
}

const scraper = new Scraper();

scraper.getAll().then(debug).catch(debug);
