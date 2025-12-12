import app from "./server.js";
import mongodb from "mongodb";
import ReviewsDAO from "./dao/reviewsDAO.js";
const MongoClient = mongodb.MongoClient;
const user = process.env["MONGO_USERNAME"];
const pwd = process.env["MONGO_PASSWORD"];
const uri = `mongodb+srv://${user}:${pwd}@cluster0.zm8jrvj.mongodb.net/?appName=Cluster0`;
const port = process.env.PORT || 3000;
MongoClient.connect(uri, {
  maxPoolSize: 50,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await ReviewsDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
