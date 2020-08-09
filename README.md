# Prerequisites
- [Google Cloud SDK](https://cloud.google.com/sdk/install)
- Access to a Google App Engine project with a copy of the CHIRP DJDB Datastore
- [Google datastore emulator](https://cloud.google.com/datastore/docs/tools/datastore-emulator) for integration testing

# Testing

## Running the integration tests

Start the [datastore emulator](https://cloud.google.com/datastore/docs/tools/datastore-emulator) in another Terminal tab:

`gcloud beta emulators datastore start`

Then run the tests:

```
cd app
npm run test
```
