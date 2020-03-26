'use strict'

require('dotenv').config()

// comment / uncomment these two lines to switch between REST and gRPC
// const firestore = require('./firestore-googleapis')
const firestore = require('./firestore-grpc')

const ids = [
  'DaubZexsvlUE7beXCOEd',
  'M5G2MBgoPUv4Ur1K7Zu0',
  'OK7ZMTiLCNCbbcf4euWe',
  'ncQYovHShkRWfIyVKZSy'
]

async function get(id) {
  console.time(id)
  const doc = await firestore.get(id)
  const data = doc.data()
  console.timeEnd(id)
  return data
}

async function main() {
  console.time('main')

  for (const id of ids) {
    const data = await get(id)
    console.log(data)
  }

  console.timeEnd('main')
}

main()
  .then((res) => {
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
