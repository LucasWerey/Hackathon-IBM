# Hackathon of 3 days with IBM

![IBM Cloud Badge](https://img.shields.io/badge/IBM%20Cloud-1261FE?logo=ibmcloud&logoColor=fff&style=flat)
![Svelte Badge](https://img.shields.io/badge/Svelte-FF3E00?logo=svelte&logoColor=fff&style=flat)

> The purpose of this repository is to create a tool to transcribe audio files using IBM IA.

> TODO : Summarize the transcription 

### Clone to local

```bash
git clone https://github.com/LucasWerey/Hackathon-IBM.git
```

### Run ServerSide

The serverside calls the IBM API and create local API to communicate with the client side

#### Generate key

You will need to create .env file and add inside your API_KEY
<br>
You can generate the api key from here : https://cloud.ibm.com/catalog/services/speech-to-text

```bash
cd ServerSide
touch .env
```

To run the server :

```bash
cd ServerSide
node index.js
```

### Run ClientSide

To run the .ts files you need to run :

```bash
cd ClientSide
yarn vite dev
```
