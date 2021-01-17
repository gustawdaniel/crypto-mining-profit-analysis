URL:

https://www.notion.so/preciselab/Wycena-Rentowno-ci-Koparek-03cd05a648864a56be6c8e43612552b6

### f2pool Selectors

Name

document.querySelector('.main-info .info-section h2').innerText

Manufacturer

document.querySelector('.main-info .info-section .info .info-item:first-child span:last-child').innerText

Release Date

document.querySelector('.main-info .info-section .info>div:nth-of-type(2) .info-item:nth-of-type(1) span:last-of-type').innerText

Hashrate

document.querySelector('.main-info .info-section .info .info-item:nth-child(2) span:last-child').innerText

Power Cosumption

document.querySelector('.main-info .info-section .info>div:nth-of-type(2) .info-item:nth-of-type(2) span:last-of-type').innerText

Alghoritm

document.querySelector('.main-info .info-section .info>div:nth-of-type(4) span:last-of-type').innerText

Coins

[...document.querySelectorAll('.main-info .info-section .support-currency span')].map(span => span.innerText)

Image

document.querySelector('.main-info .img-container').style.backgroundImage.replace(/^url\("/,'').replace(/"\)$/,'')

### Cryptocompare Selectors

https://www.cryptocompare.com/mining/#/equipment

Single Miner

```
[...document.querySelectorAll('[scroll-controller-object]>div.item-list')].filter((e,i) => i === 0).map(div => {
return {
    image: div.querySelector('.product-header .thumb img').src,
    name: div.querySelector('.product-header>.content .item-title>a').innerText,
    link: div.querySelector('.product-header>.content .item-title>a').href,
    price: div.querySelector('.product-header>.content .price .product-value').innerText,
    hashrate: div.querySelector('.product-header>.content .hash-rate .product-value').innerText,
    coin: div.querySelector('.product-header>.content .coin .product-value').innerText,
}
})[0]
```

Get All JSON data

```
JSON.stringify([...document.querySelectorAll('[scroll-controller-object]>div.item-list')].map(div => {
return {
    image: div.querySelector('.product-header .thumb img').src,
    name: div.querySelector('.product-header>.content .item-title>a').innerText,
    link: div.querySelector('.product-header>.content .item-title>a').href,
    price: div.querySelector('.product-header>.content .price .product-value').innerText,
    hashrate: div.querySelector('.product-header>.content .hash-rate .product-value').innerText,
    coin: div.querySelector('.product-header>.content .coin .product-value').innerText,
}
}))
```

### Get Data From ASIC DEX

```
[...document.querySelectorAll('#miner-table tr')].map(row => {
return {
  link: row.querySelector('td:nth-child(2) a').href,
  name: row.querySelector('td:nth-child(2) a .td-manufacturer-model').innerText,
  manufacturer: row.querySelector('td:nth-child(2) a .td-manufacturer-name').innerText,
  release_date: row.querySelector('td:nth-child(3) span').innerText,
noise: row.querySelector('td:nth-child(4)').innerText,
hashrate: row.querySelector('td:nth-child(5)').innerText,
power_consumption: row.querySelector('td:nth-child(6)').innerText,
algo: row.querySelector('td:nth-child(7)').innerText,
}
})
```

Jest UNKNOWN:

Ale:

```
http https://asic-dex.com/wp-content/themes/master-blog/asicminer.php\?q\=table | jq > out/asic-dex-miners-full.json
```

pozwala pobrać potrzebne dane