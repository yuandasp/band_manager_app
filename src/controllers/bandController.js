const { db, query } = require("../database");

module.exports = {
  getAllBands: async (req, res) => {
    try {
      const getAllBands = await query(`SELECT * FROM bands;`);

      if (getAllBands.length === 0) {
        return res.status(200).send({ message: "No data", data: getAllBands });
      }

      return res
        .status(200)
        .send({ message: "Success get all bands!", data: getAllBands });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  getDetailsBand: async (req, res) => {
    try {
      const { band_id } = req.params;

      let getPersonnel = await query(
        `SELECT name, position FROM personnels WHERE band_id=${band_id};`
      );

      let getBand = await query(
        `SELECT * FROM bands WHERE band_id=${band_id};`
      );

      if (getBand.length === 0) {
        return res.status(400).send({ message: "Band not found!" });
      }

      const getDetailsBand = { name: getBand[0].name, members: getPersonnel };

      return res.status(200).send({
        message: "Success get details of the band!",
        data: getDetailsBand,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  createNewBand: async (req, res) => {
    try {
      const { name, max_personnel } = req.body;

      if (!name) {
        return res.status(400).send({ message: "Band name is required!" });
      }
      if (!max_personnel) {
        return res
          .status(400)
          .send({ message: "Maximum of personnel is required!" });
      }

      const isBandNameAlreadyExist = await query(
        `SELECT * FROM bands WHERE name=${db.escape(name)};`
      );

      if (isBandNameAlreadyExist.length > 0) {
        return res.status(400).send({ message: "Band name already exist!" });
      }

      const createNewBand = await query(
        `INSERT INTO bands VALUES(null, ${db.escape(name)}, ${max_personnel});`
      );

      return res.status(200).send({ message: "Success create new band!" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  updateBandInfo: async (req, res) => {
    try {
      const { name, max_personnel } = req.body;
      const { band_id } = req.params;

      const isBandExist = await query(
        `SELECT * FROM bands WHERE band_id=${band_id}`
      );
      if (isBandExist.length === 0) {
        return res.status(400).send({ message: "No band is found!" });
      }

      const isBandNameAlreadyExist = await query(
        `SELECT * FROM bands WHERE name=${db.escape(name)};`
      );
      if (isBandNameAlreadyExist.length > 0) {
        return res.status(400).send({ message: "Band name already exist!" });
      }

      let updateBandInfoQuery = "UPDATE bands SET";

      if (name) {
        updateBandInfoQuery += ` name=${db.escape(name)},`;
      }
      if (max_personnel) {
        updateBandInfoQuery += ` max_personnel=${db.escape(max_personnel)},`;
      }

      updateBandInfoQuery =
        updateBandInfoQuery.slice(0, updateBandInfoQuery.length - 1) +
        ` WHERE band_id = ${band_id};`;

      await query(updateBandInfoQuery);
      return res.status(200).send({ message: "Update band info is success!" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  addPersonnelToBand: async (req, res) => {
    try {
      const { band_id, personnel_id } = req.body;

      const getPersonnel = await query(
        `SELECT * FROM personnels WHERE personnel_id=${personnel_id};`
      );

      if (getPersonnel[0].band_id !== null) {
        return res
          .status(400)
          .send({ message: "This personnel has already joined a band!" });
      }

      const getmax_personnel = await query(
        `SELECT * FROM bands WHERE band_id=${band_id};`
      );
      const currentNumbersOfPersonnels = await query(
        `SELECT COUNT(*) as count FROM personnels WHERE band_id=${band_id};`
      );

      if (
        currentNumbersOfPersonnels[0].count >= getmax_personnel[0].max_personnel
      ) {
        return res
          .status(400)
          .send({ message: "This band already hits maximum of personnels!" });
      }

      const addPersonnelBand = await query(
        `UPDATE personnels SET band_id=${band_id} WHERE personnel_id=${personnel_id};`
      );

      return res
        .status(200)
        .send({ message: "Success add personnel into the band!" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
