const { query } = require("express");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://yourBook:ALvSCbgrQZZH46Q1@cluster0.hjhvnge.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// .skip(35)
async function run() {
  const AllUsers = client.db("YourBook").collection("Users");
  const AllPost = client.db("YourBook").collection("AllPost");
  const AllLike = client.db("YourBook").collection("Like");
  try {
    app.post("/user", async (req, res) => {
      const query = req.body;
      const result = await AllUsers.insertOne(query);
      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const query = { email: req.params.email };
      const result = await AllUsers.findOne(query);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const query = {};
      const result = await AllUsers.find(query).toArray();
      res.send(result);
    });

    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const update = req.body;
      const updatedDoc = {
        $set: {
          fastName: update.fastName,
          lastName: update.lastName,
          birthday: update.birthday,
          gender: update.gender,
          img: update.img,
        },
      };
      const result = await AllUsers.updateOne(query, updatedDoc);
      res.send(result);
      console.log(result);
    });

    app.post("/post", async (req, res) => {
      const query = req.body;
      query.date = new Date();
      const result = await AllPost.insertOne(query);
      res.send(result);
    });
    app.put("/like/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const update = req.body;
      const updatedDoc = {
        $set: {
          like: update,
        },
      };
      const result = await AllPost.updateOne(query, updatedDoc);
      res.send(result);
    });
    app.put("/post/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const allLike = await AllPost.findOne(query);
      const data = req.body;
      const update = [...allLike.like];
      update.push(data);
      const updatedDoc = {
        $set: {
          like: update,
        },
      };
      const result = await AllPost.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.delete("/post/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await AllPost.deleteOne(query);
      res.send(result);
    });

    app.get("/post", async (req, res) => {
      const query = {};
      const result = await AllPost.find(query).toArray();
      res.send(result);
    });

    app.put("/comment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const allLike = await AllPost.findOne(query);
      const data = req.body;
      let update = [...allLike.comments];
      update.push(data);
      const updatedDoc = {
        $set: {
          comments: update,
        },
      };
      const result = await AllPost.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.get("/post/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      console.log(query);
      const result = await AllPost.find(query).toArray();
      res.send(result);
    });
  } catch {
    (error) => console.log(error);
  }
}

run();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
