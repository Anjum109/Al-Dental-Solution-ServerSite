const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID, ObjectId } = require('bson');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware codes
app.use(cors());
app.use(express.json());


// mongo db code 
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jjbnacp.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('alDentalSolution').collection('services');
        const reviewCollection = client.db('alDentalSolution').collection('reviews');

        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);

        });

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);

        });
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
        // review api 

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { service: id };

            const cursor = reviewCollection.find(query, { sort: { time: -1 } })

            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const allReviewsShow = await cursor.toArray();
            res.send(allReviewsShow);
        })

        //  for all reviews.
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { service: id };
            const cursor = reviewCollection.find(query).sort({ _id: -1 })
            const result = await cursor.toArray();
            res.send(result);
        })



        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
        // insert services 
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })


    }
    finally {

    }
}
run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Al Dental Solution is running')
});

app.listen(port, () => {
    console.log(`Al DEntal Solution running on ${port}`);
})