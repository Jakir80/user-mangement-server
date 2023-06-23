const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t81ez4s.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const userCollection = client.db('UserManagement').collection('users')

        app.post('/adduser', async (req, res) => {
            const query = req.body;
            const result = await userCollection.insertOne(query)
            res.send(result)
        })

        app.get('/alluser', async (req, res) => {
            const query = req.body;
            const result = await userCollection.find(query).toArray()
            res.send(result)
        })
        //get update data


        app.get("/update/:id", async (req, res) => {
            const id = req.params.id;
            const update = { _id: new ObjectId(id)}
            const result = await userCollection.findOne(update)
            res.send(result)
        })
        //update user info
        app.put("/updateUser/:id", async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateduserinfo = {
                $set: {
                    name: body.name,
                    email: body.email,
                    phone: body.phone
                },
            };
            const result = await userCollection.updateOne(filter, updateduserinfo);
            res.send(result);
        });
        // delete user
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
          })


    } finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('skdh is running market is Running')
})
app.listen(port, () => {
    console.log(`skdh Market is running on  port ${port}`)
})