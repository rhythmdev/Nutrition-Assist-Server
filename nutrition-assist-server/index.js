const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
      const reviewCollection = client.db("nutrition-assist").collection("reviews");

        //** get all services */
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const limitedServices = await cursor.limit(3).sort({time: 1}).toArray();
            const allServices = await serviceCollection.find().toArray();
            res.send({limitedServices, allServices});
          

           
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const services = await serviceCollection.findOne(query);
            res.send(services);
        })

         //** add a review */
         app.post('/addReview', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        })

        //** get all reviews */
        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
            
        })
       
    

        // //** add a service */
        // app.post('/addService', async (req, res) => {
        //     const service = req.body;
        //     const result = await serviceCollection.insertOne(service);
        //     res.json(result);
        // })

       

        // //** delete a service */
        // app.delete('/deleteService/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = {_id: ObjectId(id)};
        //     const result = await serviceCollection.deleteOne(query);
        //     res.json(result);
        // })

        // //** update a service */
        // app.patch('/updateService/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = {_id: ObjectId(id)};
        //     const updatedService = req.body;
        //     const result = await serviceCollection.updateOne(query, {$set: updatedService});
        //     res.json(result);
        // })




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