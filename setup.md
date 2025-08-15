# Assumptions
- You are using macOS
- You are familiar with changing directories and running commands from a Terminal window

# Prerequisites
- Admin access to your machine
- A Google account
- An admin to grant access to the chirpradiodev project in Google Cloud Platform for that Google account 
- A username and password for DJDB & NextUp in the chirpradiodev project
- A copy of esdump.zip from an admin

# Install Docker Desktop
Download Docker Desktop from https://www.docker.com/get-started, then install and run it. If you already have Docker Desktop installed, make sure you are upgraded to the latest version.

After it's installed and running, from the Settings menu (the gear icon in header) you should: 
- check "Use Docker Compose V2"

You can optionally choose to:
- check "Start Docker Desktop when you log in"
- uncheck "Open Docker Dashboard at startup"

Save your settings changes by clicking the "Apply & Restart" button at the bottom.

You can close the dashboard window and still see Docker Desktop is running in the menu bar at the top of your screen.

# Install [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm)
[The Node runtime on Google App Engine](https://cloud.google.com/appengine/docs/standard/nodejs/runtime) is automatically updated to the latest minor and major versions of Node.  Node Version Manager allows you to more easily switch between the versions of Node you can run locally to handle those changes. If you already have the latest stable version of Node installed and prefer not to use nvm, you can skip these steps.

Install nvm with the following command:
`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`

You can confirm it was installed with:
`command -v nvm`

If it wasn't installed successfully, consult the [nvm troubleshooting guide](https://github.com/nvm-sh/nvm#troubleshooting-on-macos).

Once installed successfully, install the latest version of Node (as of the time of writing these docs) with the following command:
`nvm install 20.11.0`

# Install redoc-cli
This library is used to compile the API documentation. Install it with the following command:
`npm install redoc-cli -g`

# Install [Homebrew](https://brew.sh)
Homebrew simplifies the process of installing packages like Git and the Google Cloud SDK. Install it with the following command: 
`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

You'll be asked to enter the administrator password for your machine to continue.

# Install Git
If you don't already have Git installed, use Homebrew to install Git by running:
`brew install git`
    
## Install [Google Cloud SDK](https://cloud.google.com/sdk/gcloud)
The back end requires the Google Cloud SDK to access Google Cloud Platform services. Install it by running:
`brew install --cask google-cloud-sdk`

Once installation has finished, initialize the SDK with the following command:
`gcloud init`

This will open a browser window where you can sign in to your Google account and grant access to the SDK.

Back in the Terminal window, choose "chirpradiodev" as the default Cloud project and "n" when asked to set a  default Compute Engine region

So you don't have to sign in every time you run the application locally, you can run the following command to log in once more and save your credentials as the default:
`gcloud auth application-default login`

# Set up the application
Clone the NextUp repository in whatever folder you wish:
`git clone https://github.com/chirpradio/nextup.git`

Then create a copy of the environment variables file:
```
cd nextup
cp .env.example .env
```

If you need to set the location of the Google config files, you can update the CONFIG_LOCATION variable in the .env file.

## Set up the API

### Install the npm packages
```
cd app
npm install
```

### Build the API documentation
This generates a static HTML version of the API documentation from the YAML specification.
```
cd routes/api
redoc-cli build specification.yaml
```


### Start the API 
Get back to the /nextup directory
`cd ../../..`

And start the Docker container for the API
`docker compose --profile api up`

The first time you run this command it will download the Docker images, then start running the API. Once you see the following message, it's running and you're ready to continue.
```
app  | NextUp API listening on 1071
```

Keep this Terminal window open and the process running.

## Set up Elasticsearch
Open a new Terminal window, make sure you're in the /nextup directory and run:
`docker compose --profile es up`

This will generate a bunch of log messages, eventually stopping on something like
```
nextup-kibana-1  | {"type":"log","@timestamp":"2021-12-31T22:02:03Z","tags":["listening","info"],"pid":1,"message":"Server running at http://0:5601"}
nextup-kibana-1  | {"type":"log","@timestamp":"2021-12-31T22:02:03Z","tags":["status","plugin:spaces@7.2.0","info"],"pid":1,"state":"green","message":"Status changed from yellow to green - Ready","prevState":"yellow","prevMsg":"Waiting for Elasticsearch"}
```
Once you see those and the messages stop you're ready to continue. Keep this Terminal window open and the process running.

### Create the indexes
Open a new Terminal window and from the /nextup/elasticsearch/indexes directory, run the following four commands:
```
curl -X PUT "localhost:9200/album?pretty" -H "Content-Type: application/json" -d @album.index.json
curl -X PUT "localhost:9200/artist?pretty" -H "Content-Type: application/json" -d @artist.index.json
curl -X PUT "localhost:9200/document?pretty" -H "Content-Type: application/json" -d @document.index.json
curl -X PUT "localhost:9200/track?pretty" -H "Content-Type: application/json" -d @track.index.json
```

### Import the data
The [Elasticdump](https://github.com/elasticsearch-dump/elasticsearch-dump) library makes importing the data a little easier. Install it with the following command:
`npm install elasticdump -g`

Download the esdump.zip file shared with you, unzip it, and change to that directory. From that directory run the following command to import all the data:
`for FILE in *.json; do elasticdump --input=$FILE --output=http://localhost:9200; done`

Note: this import process will take over an hour to complete.

## Set up the front end
Open a new Terminal window. From the /nextup/client directory, run the following commands:
```
npm install
npm run dev
```

This runs some updates, generates some CSS warnings you can ignore, and starts serving the front end locally.

Once it's done, navigate to http://localhost:5173/ in your browser and log in. Changing JavaScript and Vue files in the /client directory will automatically reload the app in your browser.

# Test your NextUp installation

After setting up all app components and confirming that they can run in their own terminal, there is also an option to launch all with a single command from the project root:

```
npm install
npm run dev:all
```
_Note: Any processes still running as outlined in the preceding steps must be stopped to before using the all-in-one command_

If you can log in successfully, see some albums, and successfully run a search, your installation is complete!
