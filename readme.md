# GCP gRPC vs REST Test

> Simple benchmarks reproducing slow initial queries for Google APIs using Node.js gRPC vs REST

## Problem Intro

We're experiencing extremely slow initial query times (10s+) with all Google Cloud APIs using the latest Node.js SDKs **locally** and on **serverless**. This initial query lapse is unacceptable when our business logic is run in serverless environments as well as locally every time our development server is hot reloaded resulting in a very, very poor experience for our end users.

This problem is compounded even more when our business logic uses multiple Google APIs, each of which redundantly have the same 10s+ initialization times leading to some end user queries taking 30s+ in some not uncommon scenarios. **:cringe:**

For a single GCP API, using gRPC, the initial query time is consistently always **10-11s** and subsequent query times of around **80-150ms** (via the official `@google-cloud` SDKs).

For the same GCP API, using REST, the initial query time varies from 3s (rare) to an anverage of 300-600ms and then subsequent query times of around **150ms** (via the official / generic `googleapis` REST SDK).

A few basic things:

- The database we're querying only has one collection and 4 documents. Super simple so it's not a scale issue.
- The database we're querying is located in US central and we're querying from New York. So it's not a geographical latency issue.
- The size of the documents and amount of data being transferred is very small (less than 1k bytes total). So it's not a throughput issue.

Specifically, we're seeing this with `@google-cloud/firestore` and `@google-cloud/logging`, but it likely affects all Node.js Google SDKs using `google-gax` and `@grpc/grpc-js`. Possibly other languages, but let's keep this focused.

The same pattern repros when our code is run in production from AWS Lambda, but it's a simpler repro case to just show the problem locally.

## Setup

You'll need to setup a basic Google Firestore database, insert a few test documents, and change the database name (right now it's set to `cron-jobs`) and document IDs in the source to match your setup.

You'll also need to setup valid `GOOGLE_APPLICATION_CREDENTIALS` and `GOOGLE_PROJECT_ID` in `.env`.

Super simple setup following a normal quick start type scenario.

## Benchmarks

All benchmarks below are run locally on a 2018 Macbook Pro using Node.js `v13.8.0` and yarn `1.22.0`.

You can run `benchmark-single-get.js` or `benchmark-multiple-get.js` and swap one line in the `require` statements to switch between REST and gRPC.

### Benchmark Single GET - REST

```
DaubZexsvlUE7beXCOEd: 318.587ms
{
  tags: [],
  description: '',
  url: 'https://saasify.sh',
  timezone: 'America/New_York',
  httpMethod: 'GET',
  schedule: '* * * * *',
  state: 'enabled',
  name: 'test0',
  httpHeaders: {},
  userId: '5e7ae88a3720c1003cebcd0b'
}
main: 321.53ms
```

Benchmark times range from **300-600ms**.

### Benchmark Single GET - gRPC

```
DaubZexsvlUE7beXCOEd: 10.542s
{
  description: '',
  url: 'https://saasify.sh',
  timezone: 'America/New_York',
  state: 'enabled',
  schedule: '* * * * *',
  httpMethod: 'GET',
  name: 'test0',
  httpHeaders: {},
  userId: '5e7ae88a3720c1003cebcd0b',
  tags: []
}
main: 10.544s
```

Benchmark times are very consistently **10-11s**. :cringe:

### Benchmark Multiple GET - REST

```
DaubZexsvlUE7beXCOEd: 310.355ms
{
  description: '',
  url: 'https://saasify.sh',
  timezone: 'America/New_York',
  httpMethod: 'GET',
  state: 'enabled',
  schedule: '* * * * *',
  userId: '5e7ae88a3720c1003cebcd0b',
  httpHeaders: {},
  name: 'test0',
  tags: []
}
M5G2MBgoPUv4Ur1K7Zu0: 154.531ms
{
  description: '',
  url: 'https://saasify.sh',
  timezone: 'America/New_York',
  state: 'enabled',
  schedule: '* * * * *',
  httpMethod: 'GET',
  userId: '5e7aa4e477a4d81ed8eecd4d',
  httpHeaders: {},
  name: 'simple cron test',
  tags: []
}
OK7ZMTiLCNCbbcf4euWe: 148.263ms
{
  tags: [],
  description: '',
  url: 'https://puppet-master.sh/',
  timezone: 'America/New_York',
  httpMethod: 'GET',
  schedule: '*/5 * * * *',
  state: 'enabled',
  userId: '5e7aa4e477a4d81ed8eecd4d',
  httpHeaders: {},
  name: 'simple cron test 2'
}
ncQYovHShkRWfIyVKZSy: 202.167ms
{
  description: '',
  url: 'https://ssfy.sh/dev/hello-world?name=test2',
  timezone: 'America/New_York',
  httpMethod: 'GET',
  state: 'enabled',
  schedule: '* * * * *',
  userId: '5e766a8359bf49e6a55ce9ac',
  httpHeaders: {},
  name: 'test2',
  tags: []
}
main: 819.168ms
```

Benchmark overall times range from **800-1200ms**.

### Benchmark Multiple GET - gRPC

```
DaubZexsvlUE7beXCOEd: 10.557s
{
  timezone: 'America/New_York',
  state: 'enabled',
  schedule: '* * * * *',
  httpMethod: 'GET',
  name: 'test0',
  httpHeaders: {},
  userId: '5e7ae88a3720c1003cebcd0b',
  tags: [],
  description: '',
  url: 'https://saasify.sh'
}
M5G2MBgoPUv4Ur1K7Zu0: 78.568ms
{
  url: 'https://saasify.sh',
  timezone: 'America/New_York',
  state: 'enabled',
  schedule: '* * * * *',
  httpMethod: 'GET',
  name: 'simple cron test',
  httpHeaders: {},
  userId: '5e7aa4e477a4d81ed8eecd4d',
  tags: [],
  description: ''
}
OK7ZMTiLCNCbbcf4euWe: 78.721ms
{
  description: '',
  url: 'https://puppet-master.sh/',
  timezone: 'America/New_York',
  state: 'enabled',
  schedule: '*/5 * * * *',
  httpMethod: 'GET',
  name: 'simple cron test 2',
  httpHeaders: {},
  userId: '5e7aa4e477a4d81ed8eecd4d',
  tags: []
}
ncQYovHShkRWfIyVKZSy: 89.362ms
{
  description: '',
  url: 'https://ssfy.sh/dev/hello-world?name=test2',
  timezone: 'America/New_York',
  state: 'enabled',
  schedule: '* * * * *',
  httpMethod: 'GET',
  name: 'test2',
  httpHeaders: {},
  userId: '5e766a8359bf49e6a55ce9ac',
  tags: []
}
main: 10.808s
```

Benchmark overall times range from **10-12s**. :cringe:

## Takeaways

I would happily tradeoff slightly faster query times for **consistent query times** 10 times out of 10. The REST version especially when deployed to **serverless** is significantly more consistent and reasonable than the gRPC version with it not being uncommon for our end users to wait 10-30s for initial results which is absolutely unacceptable.

**This problem is compounded significantly by our serverless business logic using multiple Google APIs to handle requests (like Firestore + Logs), each of which having the same redundant slow initialization issue.**

This is a serious performance issue and there have been some similar reports, but it's hard to believe that this hasn't been acknowledged as a fundamental weakness of Google Cloud, at least with the happy path on Node.js using their official gRPC-based SDKs.

Our options at this point are:

1. Switch all of our business logic and future applications away from Google Cloud
2. switch all of our business logic to use REST versions of GCP APIs which would be really awkward to maintain and work with and is likely a non-starter
3. Resolve this core issue and move on to more important things

@Google we've done our part in breaking down as simple and clear of a repro example as possible. Please help us and other customers choose option #3.

## License

MIT © [Saasify](https://saasify.sh)
