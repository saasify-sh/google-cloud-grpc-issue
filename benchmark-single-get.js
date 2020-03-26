'use strict'

require('dotenv').config()

// comment / uncomment these two lines to switch between REST and gRPC
// const firestore = require('./firestore-googleapis')
const firestore = require('./firestore-grpc')

async function get(id) {
  console.time(id)
  const doc = await firestore.get(id)
  const data = doc.data()
  console.timeEnd(id)
  return data
}

async function main() {
  console.time('main')

  const data = await get('DaubZexsvlUE7beXCOEd')
  console.log(data)

  console.timeEnd('main')
  return data
}

main()
  .then((res) => {
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
