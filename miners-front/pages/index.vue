<template>
  <div>
    <h1>WITH PRICE</h1>

    <v-data-table
      :headers="headers"
      :items="rowsPrice"
      :items-per-page="-1"
      class="elevation-1"
    >
      <template v-slot:item.release_date="{ item }">
        <span>{{ item.release_date.split('/').reverse().join('-') }}</span>
      </template>
      <template v-slot:item.prices="{ item }">
        <span>{{ item.prices[0].price }} $ ({{ item.prices[0].date | date }})</span>
      </template>
      <template v-slot:item.hashrate="{ item }">
        <span>{{ item.algorithm.hashrate }} H/s</span>
      </template>
      <template v-slot:item.power="{ item }">
        <span>{{ item.algorithm.power_consumption }} W</span>
      </template>
      <template v-slot:item.efficiency="{ item }">
        <span>{{ (item.algorithm.hashrate / item.algorithm.power_consumption).toFixed(2)}} H/(Ws)|
          {{ (item.algorithm.hashrate / (item.algorithm.power_consumption * item.prices[0].price)).toFixed(2) }} H/(Ws$)</span>
      </template>
    </v-data-table>

    <h1>WITH OUT PRICE</h1>

    <v-data-table
      :headers="headers"
      :items="rowsNoPrice"
      :items-per-page="-1"
      class="elevation-1"
    >
      <template v-slot:item.release_date="{ item }">
        <span>{{ item.release_date.split('/').reverse().join('-') }}</span>
      </template>
<!--      <template v-slot:item.prices="{ item }">-->
<!--        <pre>{{ item.prices }}</pre>-->
<!--      </template>-->
      <template v-slot:item.hashrate="{ item }">
        <span>{{ item.algorithm.hashrate }} H/s</span>
      </template>
      <template v-slot:item.power="{ item }">
        <span>{{ item.algorithm.power_consumption }} W</span>
      </template>
      <template v-slot:item.efficiency="{ item }">
        <span>{{ (item.algorithm.hashrate / item.algorithm.power_consumption).toFixed(2)}} H/(Ws)</span>
      </template>
    </v-data-table>

    <h1>JSON OUT</h1>

    <pre>{{minersLogs}}</pre>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import miners from '../../miners-scraper/out/pl-miners.json'

export default Vue.extend({
  name: 'index',
  filters: {
    date(timestamp: number) {
      return new Intl.DateTimeFormat('pl-PL', {day: '2-digit', month: '2-digit', year: 'numeric'}).format(new Date(timestamp * 1000));
      // return new Date(timestamp * 1000).toLocaleDateString()
    }
  },
  computed: {
    headers() {
      return [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Manufacturer",
          value: "manufacturer",
        },
        {
          text: "Release",
          value: "release_date",
        },
        {
          text: "Price",
          value: "prices",
        },
        {
          text: "Hashrate",
          value: "hashrate",
        },
        {
          text: "Power",
          value: "power",
        },
        {
          text: "Efficiency",
          value: "efficiency",
        },
      ]
    },
    rows():any[] {
      console.log(miners);
      return miners
        .filter((m:any) => m.algorithms.some((a:any) => a.coin === 'Ethereum'))
        .map((m:any) => ({
          ...m,
          algorithm: m.algorithms.find((a:any) => a.coin === 'Ethereum')
        }))
    },
    rowsPrice():any[] {
      return this.rows.filter((m:any) => m.prices.length);
    },
    rowsNoPrice():any[] {
      return this.rows.filter((m:any) => !m.prices.length);
    },
    minersLogs() {
      return this.rowsPrice.map(p => ({
        name: p.name,
        manufacturer: p.manufacturer,
        date: Math.round(p.prices[0].date / (24*3600)),
        price: p.prices[0].price,
        hashrate: p.algorithm.hashrate,
        power: p.algorithm.power_consumption
      }));
    }
  }
})
</script>
