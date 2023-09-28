const { db, query } = require("../database");

module.exports = {
  createNewPersonnel: async (req, res) => {
    try {
      const { name, position } = req.body;

      if (!name) {
        return res.status(400).send({ message: "Name is required!" });
      }
      if (!position) {
        return res.status(400).send({ message: "Position is required!" });
      }

      const createNewPersonnel = await query(
        `INSERT INTO personnels VALUES(null, null, ${db.escape(
          name
        )}, ${db.escape(position)});`
      );

      return res.status(200).send({ message: "Success create new personnel!" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
