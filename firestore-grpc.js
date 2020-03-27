const { Firestore } = require('@google-cloud/firestore')
const grpc = require('@grpc/grpc-js')

console.log('using gRPC via @google-cloud/firestore')
const db = new Firestore({ grpc })
const CronJobs = db.collection('cron-jobs')

exports.get = async function get(id) {
  return CronJobs.doc(id).get()
}
