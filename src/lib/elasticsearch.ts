// "use server";
// // lib/elasticsearch.ts
// import { Client } from 'elasticsearch-browser';

// const client = new Client({
//   node: process.env.ELASTICSEARCH_URL ?? "",
//   auth: {
//     username: process.env.ELASTICSEARCH_USER ?? "elastic",
//     password: process.env.ELASTICSEARCH_PASSWORD ?? "",
//   },
//   tls: {
//     ca: `-----BEGIN CERTIFICATE-----
//     MIIFWjCCA0KgAwIBAgIVAL2F/tJ0VqgZQRGPr91i38TLkVzbMA0GCSqGSIb3DQEB
//     CwUAMDwxOjA4BgNVBAMTMUVsYXN0aWNzZWFyY2ggc2VjdXJpdHkgYXV0by1jb25m
//     aWd1cmF0aW9uIEhUVFAgQ0EwHhcNMjQwMzE0MDYyNDQ0WhcNMjcwMzE0MDYyNDQ0
//     WjA8MTowOAYDVQQDEzFFbGFzdGljc2VhcmNoIHNlY3VyaXR5IGF1dG8tY29uZmln
//     dXJhdGlvbiBIVFRQIENBMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA
//     zr5fqlWT48ddwYyxaK4tpPHkWPcKnv16nKDWD2DYLEU+LuWFK/VYoOUPlOxlMccq
//     smE/bE5bcrsPUcIxa6sf5t7QLthRp9KapTgHvcgFZNPmLq7gDPthDPMxoArPDKwR
//     3noJMSs6z0cfZyhKPK3ImNeCR7Ab81Y9x8EyhmN4DiQF0mVtz8v2Exu3ugwGOPFI
//     8xkOB7nXKRRiSWXdOdN2kx2UJez9JXuYmBZmur7OWlLDcuBlRZkwKpTQWYpbAYft
//     aNwYbUL7gLdfRCbGOlzLd0GqaoPKAbY/4uPBNaxgBLNjM11ibJ1zvWFspni4AB8z
//     +tXVPDwIc9RUV/iXnfJtCusTz51+EiqzEcoc+yNbUYIG2rSzaTMfVB0BvBjE7vyE
//     5Ox6YEqIddrn8JqF7trEHODu+U/jZkSQiKdcz4Q5XjXmMT32fW14LbOgCK6Ff5c7
//     6t7voGrxKZvLdWiI9R2HGfvLT7v2n1A3yg+SaFOawTPjh7GGRZI1w5UOf1tKpAQY
//     crs2NDQfY6n6z7/5W8rt5MjqS8CHDKkvxGUJ3cqUqVtfWwzXupBFf0B3IN+lLVnV
//     2XmMOUtXnY8R9apjcp6rsNJXUlXo4m4wLLOdQCLigoDWn+zb4/cF+9eiuPMe68Dw
//     6GB4O546FQkHEsW9N0KQfmWpuDjeawioJ9H/3ajHpScCAwEAAaNTMFEwHQYDVR0O
//     BBYEFI8A2HShUsH3oFF43kpAdkbQe0U4MB8GA1UdIwQYMBaAFI8A2HShUsH3oFF4
//     3kpAdkbQe0U4MA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggIBAHXK
//     z7PWJgoPf9E2loiZM3ASY4TnKwMfRfT5d7PSiUiuWWtNKM/KT/6GSI+RzuQfa9yM
//     WFm6Nuw3u6ZOOVN9tbTOImdWyJXHCf0CFagkGBVKeuL54/5s47QsAefI9stjSeEs
//     Ja5OAQl8hOlxTRI7ilp3ypZGB5TK3un1FKS/Ms5HKzTOTgynU4+hcIsUT+0fxt0v
//     dyvn2P18zsvnjoHS5iqASletIhQA9+voBxOaYLuPajXzof+uBTDYNltJ1XjaA5X8
//     NHq/EEmCtwMH8R3PNuWT/wYAEQSS9hhlVHo2cgGrvwldALko7JbW21IDkXelKZLE
//     ng+9QxWkddb+kXsUMhy4fSZxPs5ekm+kPQmWpLtY79KEqP6ZO/xH7wyy914Z6kB7
//     qGSeFPZg0oMHkZ4ogfpvE6pAdjqvU9EXLneBB+XV8VnGLXfT+TwCfzs+T5EncDwC
//     oJ0NL2Bque5X5ZT8+4mjjGm/T7EJok8goD9oADZUu7xNxDWKfa0FepGZO2kBJ1MP
//     /9EPbAh00H2IJqlR0qUfybZlN9Ybdg+YvPXP6W1uYF5K8w3Brbgi95EooPW5rWzw
//     oN+JeE5gkT2tk1k4GwgWGVvyl3UYq8Uc3nWTKXs1ZM9ZKJpy6fCO7bY5viOq/Wth
//     CsdL5hahi/FDSYrPHbcwfSg0wPAdqgLjTuOjfBya
//     -----END CERTIFICATE-----
//     `,
//     rejectUnauthorized: false,
//   },
// });

// export default client;