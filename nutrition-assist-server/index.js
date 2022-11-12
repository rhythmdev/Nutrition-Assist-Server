const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

//** middleware */
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hjmkubl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client
      .db("nutrition-assist")
      .collection("services");
    const reviewCollection = client
      .db("nutrition-assist")
      .collection("reviews");

    //** get all services */
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const limitedServices = await cursor.limit(3).sort({ time: 1 }).toArray();
      const allServices = await serviceCollection.find().sort({time: -1}).toArray();
      res.send({ limitedServices, allServices });
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const services = await serviceCollection.findOne(query);
      res.send(services);
    });

    //** add a review */
    app.post("/addReview", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });

    //** get all reviews  by service id*/
    app.get("/reviews", async (req, res) => {
      let query = {};

      if (req.query.serviceId) {
        query = { serviceId: req.query.serviceId };
      }

      const cursor = reviewCollection.find(query).sort({date: -1});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.get("/reviews/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const reviews = await reviewCollection.findOne(query);
      res.send(reviews);
      
    })


    //** get all reviews by user email */
    app.get("/myReviews", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //** delete a review */
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.json(result);
    });

    //** update a review */
    app.patch("/editReview/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const newValues = { $set: req.body };
      const result = await reviewCollection.updateOne(query, newValues);
      res.json(result);
    });

    //** add a service */
    app.post('/addService', async (req, res) => {
        const service = req.body;
        const result = await serviceCollection.insertOne(service);
        res.json(result);
    })

   
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Nutrition Assist server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
