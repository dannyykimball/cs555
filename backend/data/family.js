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
  async addFamily(familyHashmap) {
    const familyCollection = await familyData();

    let newId;
    for (const [key, value] of familyHashmap.entries()) {
      let insertInfo = await familyCollection.insertOne(value);
      if (insertInfo.insertedCount === 0) throw "Could not add family";
      newId = insertInfo.insertedId;
    }

    // return await this.getFamilyById(newId);
  },
  async clear() {
    const familyCollection = await familyData();
    return familyCollection.deleteMany({});
  },
};
