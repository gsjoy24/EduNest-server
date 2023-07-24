const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
const corsOptions = {
   origin: '*',
   credentials: true,
   optionSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

app.listen(port, () => console.log('listening on port', port));
app.get('/', (req, res) => {
   res.send('server is running');
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbdk5o7.mongodb.net/?retryWrites=true&w=majority`;

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
      const collegeCollection = client.db('EduNest').collection('colleges');

      // get all users
      app.get('/colleges', async (req, res) => {
         const result = await collegeCollection.find().toArray();
         res.send(result);
      });

      app.get('/colleges/:id', async (req, res) => {
         const id = req.params.id
         const query = { _id: new ObjectId(id) };
         const result = await collegeCollection.findOne(query)
         res.send(result);
      });


      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
   }
}
run().catch(console.dir);
