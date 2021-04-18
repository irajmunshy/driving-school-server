const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()


const app = express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xrnpv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
})


client.connect(err => {
    const servicesCollection = client.db("drivingSchool").collection("services");
    const reviewsCollection = client.db("drivingSchool").collection("reviews");
    const bookingsCollection = client.db("drivingSchool").collection("bookings");
    const adminsCollection = client.db("drivingSchool").collection("admins");
    // const UserInfoCollection = client.db("drivingSchool").collection("UserInfo");

    // post method with AddService.js
    app.post('/AddService', (req, res) => {
        const newService = req.body;
        servicesCollection.insertOne(newService)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    // get method with manageService.js
    app.get('/manageServices', (req, res) => {
        servicesCollection.find({})
        .toArray((err, document) => {
            res.send(document);
        })
    })

    // get method with services.js
    app.get('/services', (req, res) => {
        servicesCollection.find({})
        .toArray((err, document) => {
            res.send(document);
        })
    })

    // delete method with ManageService.js
    app.delete('/serviceDelete/:id', (req, res) => {
        servicesCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0);
        })
    })

    // post method with review.js
    app.post('/AddReview', (req, res) => {
        const newReview = req.body;
        reviewsCollection.insertOne(newReview)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    // get method with testimonials.js
    app.get('/reviews', (req, res) => {
        reviewsCollection.find({})
        .toArray((err, document) => {
            res.send(document);
        })
    })

    // post method with services.js
    app.post("/booking",  (req, res) => {
        const newBooking = req.body;
        bookingsCollection.insertOne(newBooking)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    // get method with book.js
    app.get('/booking/:id', (req, res) => {
        bookingsCollection.find({_id: req.params.id})
        .toArray((err, document) => {
            res.send(document[0]);
        })
    })

    // Patch method with book.js
    app.patch('/bookingUpdate/:id', (req, res) => {
        bookingsCollection.updateOne(
            {_id: req.params.id},
            { $set: {
                    payWith: req.body.payWith,
                    status: req.body.status
                }
            }
        )
        .then(result => {
           console.log(result);
        })
    })

    // get method with serviceList.js
    app.get('/serviceList', (req, res) => {
        bookingsCollection.find({email: req.query.email})
        .toArray((err, document) => {
            res.send(document);
        })
    })

    // get method with orders.js
    app.get('/orders', (req, res) => {
        bookingsCollection.find({})
        .toArray((err, document) => {
            res.send(document);
        })
    })

    // post method with moreAdmin
    app.post('/AddAdmin', (req, res) => {
        const newAdmin = req.body;
        adminsCollection.insertOne(newAdmin)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    // post method with home.js
    app.post('/findAdmin', (req, res) => {
        const email = req.body.email;
        adminsCollection.find({email: email})
        .toArray((err, document) => {
            res.send(document.length > 0);
        })
    })

    // post method with login.js
    // app.post('/addUserInfo', (req, res) => {
    //     const userInfo = req.body;
    //     UserInfoCollection.insertOne(userInfo)
    //     .then(result => {
    //         res.send(result.insertedCount);
    //     })
    // })

    // get method with login.js
    // app.post('/getUserInfo', (req, res) => {
    //     UserInfoCollection.find(userInfo)
    //     .then(result => {
    //         res.send(result.insertedCount);
    //     })
    // })

  //  client.close();
});


app.listen(process.env.PORT || 5000);