// lib/elasticsearch.ts
import { Client } from '@elastic/elasticsearch'
import  fs from 'fs';

const client = new Client({
  node: process.env.ELASTICSEARCH_URL ?? "",
  auth: {
    username: process.env.ELASTICSEARCH_USER ?? 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD ?? '',
  },
  tls: {
    ca: fs.readFileSync('./cert/http_ca.crt') ?? "",
    rejectUnauthorized: false,
  },
})

export default client