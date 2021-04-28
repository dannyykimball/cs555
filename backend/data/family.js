const mongoCollections = require("../config/mongoCollections");
const familyData = mongoCollections.family;
const { ObjectId } = require("mongodb");

module.exports = {
  async getAllFamily() {
    const familyCollection = await familyData();
    return familyCollection.find({}).toArray();
  },
  async getFamilyById(id) {
    if (!id) throw "You must provide a family id to search for";

    const objId = ObjectId(id);
    const familyCollection = await familyData();
    const family = await familyCollection.findOne({ _id: objId });
    if (family === null) throw "No family member with this id";

    return family;
  },
  async addFamily(data) {
    const familyCollection = await familyData();
    const insertInfo = await familyCollection.insertOne(data);
    if (insertInfo.insertedCount === 0) throw "Could not add family";
    const newId = insertInfo.insertedId;
    return await this.getFamilyById(newId);
  },
  async clear() {
    const familyCollection = await familyData();
    return familyCollection.deleteMany({});
  },
};
