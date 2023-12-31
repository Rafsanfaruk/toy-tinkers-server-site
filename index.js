const express = require('express');
const cors =require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port =process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


app.get('/',(req, res)=>{
    res.send('Toy Tinkerers is Running')
})


// mongodb code  start


const uri = `mongodb+srv://${process.env.TOY_USER}:${process.env.TOY_PASS}@cluster0.luzjykj.mongodb.net/?retryWrites=true&w=majority`;

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

   const toyCollection =client.db('toyTinkerers').collection('allToys');
   const addToyCollection =client.db('toyTinkerers').collection('addToys');

// 
   
// 
   app.get('/allToys',async(req,res)=>{
    const cursor =toyCollection.find();
    const result = await cursor.toArray();
    res.send(result);
   })


   app.get('/category',async(req,res)=>{
    const cursor =toyCollection.find();
    const result = await cursor.toArray();
    res.send(result);
   })


   app.get('/allToys/:id',async(req,res)=>{
     const id =req.params.id;
     const query ={ _id: new ObjectId(id)}
     const result  = await toyCollection.findOne(query);
     res.send(result);
   })

// add Toy



app.get('/addToys', async (req, res) => {
  try {
    const { email } = req.query;
    const query = email ? { email } : {};
    const result = await addToyCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to retrieve toys' });
  }
});


app.post('/addToys', async (req, res) => {
  try {
    const addedToys = req.body;
    console.log(addedToys);
    const result = await addToyCollection.insertOne({ ...addedToys, _id: undefined });
    res.status(201).json({ success: true, message: 'Toy added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to add toy' });
  }
});

// app.get('/addToys/:id',async(req,res)=>{
//   const id = req.params.id;
//   const query ={_id : new ObjectId(id)}
//   const result =await addToyCollection.findOne(query);
//   res.send(result);
// })
// update
app.get('/addToys/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await addToyCollection.findOne(query);
  res.send(result);
});

app.put('/addToys/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const updatedData = req.body; // Assuming the updated toy data is sent in the request body

  // Update the toy data in the database
  const result = await addToyCollection.updateOne(query, { $set: updatedData });

  if (result.modifiedCount > 0) {
    res.send({ message: 'Toy updated successfully' });
  } else {
    res.status(404).send({ error: 'Toy not found' });
  }
});


app.delete('/addToys/:id',async(req,res)=>{
  const id = req.params.id;
  const query ={_id: new ObjectId(id)};
  const result =await addToyCollection.deleteOne(query);
  res.send(result)
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



// mongodb code  end


app.listen(port, ()=>{
    console.log(`toy tinkerers server is running on port ${port}`);
})