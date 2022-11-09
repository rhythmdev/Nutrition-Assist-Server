const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//** middleware */
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hjmkubl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try{
      const serviceCollection = client.db("nutrition-assist").collection("services");

        //** get all services */
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        })
    }
    finally{

    }
}
run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Nutrition Assist server is running')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    });