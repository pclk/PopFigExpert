// lib/elasticsearch.ts
import { Client } from '@elastic/elasticsearch'
import fs from 'fs'

const client = new Client({
  node: process.env.ELASTICSEARCH_URL ?? "https://localhost:9200",
  auth: {
    username: process.env.ELASTICSEARCH_USER ?? 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD ?? '',
  },
  tls: {
    ca: fs.readFileSync('./cert/http_ca.crt'),
    rejectUnauthorized: false,
  },
})

client.ping()
  .then(() => console.log('Elasticsearch client connected'))
  .catch((error) => {
    console.error('Elasticsearch client connection error:', error, `${process.env.ELASTICSEARCH_USER}:${process.env.ELASTICSEARCH_PASSWORD}`)
  })

export default client