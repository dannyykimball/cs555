const MongoClient = require("mongodb").MongoClient;
const settings = require("./settings");
const mongoConfig = settings.mongoConfig;

const uri =
  "mongodb+srv://admin:admin@ged-project.wehud.mongodb.net/cs555?retryWrites=true&w=majority";

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    _db = await _connection.db(mongoConfig.database);
    console.log("MongoDB database connection established successfully");
  }

  return _db;
};
