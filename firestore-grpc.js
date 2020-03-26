const { Firestore } = require('@google-cloud/firestore')

const db = new Firestore()
const CronJobs = db.collection('cron-jobs')

exports.get = async function get(id) {
  return CronJobs.doc(id).get()
}
