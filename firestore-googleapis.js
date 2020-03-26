'use strict'

const { google } = require('googleapis')

console.log('using REST via googleapis')
const firestore = google.firestore('v1')
const adaptor = require('./adaptor')

let _auth
async function getAuth() {
  if (!_auth) {
    _auth = google.auth.getClient({
      scopes: [
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/datastore'
      ]
    })
  }

  return _auth
}

// https://cloud.google.com/firestore/docs/reference/rest/v1/Value
const decodeDoc = (doc) => {
  const parts = doc.name.split('/')
  const id = parts[parts.length - 1]

  return {
    id,
    data: () => adaptor.getSnapshotData(doc.fields)
  }
}

exports.get = async function get(id) {
  const name = `projects/${process.env.GCLOUD_PROJECT}/databases/(default)/documents/cron-jobs/${id}`
  const auth = await getAuth()

  const res = await firestore.projects.databases.documents.get({
    name,
    auth
  })

  return decodeDoc(res.data)
}
