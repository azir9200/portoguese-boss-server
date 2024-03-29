const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//  MIDDLEWARE
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xq1u8gq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db("portoDb").collection("menu");
    const reviewCollection = client.db("portoDb").collection("review");
    const cartCollection = client.db("portoDb").collection("cart");


    //menu data collection
    app.get('/menu', async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    })

    //review data
    app.get('/review', async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    })

    //carts Collection  

    app.get('carts', async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('doctor is sleeping!')
})

app.listen(port, () => {
  console.log(`sleeping is good for health ${port}`)
})