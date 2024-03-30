// lib/elasticsearch.ts
import { Client } from '@elastic/elasticsearch'
import fs from 'fs'

const client = new Client({
  node: "https://8f1b-115-66-136-151.ngrok-free.app/",
  auth: {
    username: process.env.ELASTICSEARCH_USER ?? '',
    password: process.env.ELASTICSEARCH_PASSWORD ?? '',
  },
  // caFingerprint: process.env.CA_FINGERPRINT,
  // caFingerprint: '1F:DE:84:E2:F4:CF:02:DB:EC:74:55:7A:2B:A0:D5:B0:68:F1:14:13:CD:8B:12:2A:76:67:50:C8:E2:C3:39:27',
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