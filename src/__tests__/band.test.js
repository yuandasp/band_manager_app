const supertest = require("supertest");
const app = require("../index");
const { db, query } = require("../database/index");

describe("band", () => {
  afterEach(async () => {
    await query("DELETE FROM bands");
    await query("DELETE FROM personnels");
  });

  describe("get list of all bands route", () => {
    describe("if the list of bands does not exist", () => {
      it("should return 200, empty array, message", async () => {
        const response = await supertest(app).get("/band");
        expect(200);
        expect(response._body.data).toHaveLength(0);
        expect(response._body.message).toEqual("No data");
      });
    });

    describe("given the list of all bands if bands exist", () => {
      it("should return 200, array of data, message", async () => {
        const bandName = "Yes Band";
        const personnelMax = 2;

        const responseCreateBand = await query(
          `INSERT INTO bands VALUES(null, ${db.escape(
            bandName
          )}, ${personnelMax});`
        );

        const response = await supertest(app).get("/band");
        expect(200);
        expect(response._body.data[0]).toEqual({
          band_id: responseCreateBand.insertId,
          name: bandName,
          max_personnel: personnelMax,
        });
        expect(response._body.data).toHaveLength(1);
        expect(response._body.message).toEqual("Success get all bands!");
      });
    });
  });

  describe("get details of a band route", () => {
    describe("if details bands does not exist", () => {
      it("should return 400 and message", async () => {
        const band_id = null;

        const response = await supertest(app).get(`/band/${band_id}`);
        expect(400);
        expect(response._body.message).toEqual("Band not found!");
      });
    });

    describe("given the details band if the band does exist", () => {
      it("should return 200, band info, and members length is 0", async () => {
        const bandName = "Yes Band";
        const personnelMax = 1;

        const responseCreateBand = await query(
          `INSERT INTO bands VALUES(null, ${db.escape(
            bandName
          )}, ${personnelMax});`
        );
        const response = await supertest(app).get(
          `/band/${responseCreateBand.insertId}`
        );

        expect(200);
        expect(response._body.data.name).toEqual(bandName);
        expect(response._body.data.members).toHaveLength(0);
      });

      it("should return 200, band info, and members length is 1", async () => {
        const bandName = "No Band";
        const personnelMax = 1;
        const personnelName = "Bibi";
        const position = "Vocalist";

        const responseCreateBand = await query(
          `INSERT INTO bands VALUES(null, ${db.escape(
            bandName
          )}, ${personnelMax});`
        );

        const responseCreatePersonnel = await query(
          `INSERT INTO personnels VALUES(null, ${
            responseCreateBand.insertId
          }, ${db.escape(personnelName)}, ${db.escape(position)});`
        );

        const response = await supertest(app).get(
          `/band/${responseCreateBand.insertId}`
        );

        expect(200);
        expect(response._body.data.name).toEqual(bandName);
        expect(response._body.data.members).toHaveLength(1);
        expect(response._body.data.members).toContainEqual({
          name: personnelName,
          position: position,
        });
      });
    });
  });

  describe("create a new band route", () => {
    describe("if name of the band does not exist", () => {
      it("should return 400 and message", async () => {
        const bandName = "";
        const personnelMax = 2;

        const response = await supertest(app)
          .post("/band")
          .send({ name: bandName, max_personnel: personnelMax });
        expect(400);
        expect(response._body.message).toEqual("Band name is required!");
      });
    });

    describe("if max personnel is null", () => {
      it("should return 400 and message", async () => {
        const bandName = "Cey Band";
        const personnelMax = null;

        const response = await supertest(app)
          .post("/band")
          .send({ name: bandName, max_personnel: personnelMax });
        expect(400);
        expect(response._body.message).toEqual(
          "Maximum of personnel is required!"
        );
      });
    });

    describe("if max personnel is 0", () => {
      it("should return 400 and message", async () => {
        const bandName = "Cey Band";
        const personnelMax = 0;

        const response = await supertest(app)
          .post("/band")
          .send({ name: bandName, max_personnel: personnelMax });
        expect(400);
        expect(response._body.message).toEqual(
          "Maximum of personnel is required!"
        );
      });
    });

    describe("if band name is already exist", () => {
      it("should return 400 and message", async () => {
        const bandName = "Cey Band";
        const personnelMax = 5;

        const createNewBand = await query(
          `INSERT INTO bands VALUES(null, ${db.escape(
            bandName
          )}, ${personnelMax});`
        );

        const response = await supertest(app)
          .post("/band")
          .send({ name: bandName, max_personnel: personnelMax });
        expect(400);
        expect(response._body.message).toEqual("Band name already exist!");
      });
    });

    describe("if a new band success created", () => {
      it("should return 200 and message", async () => {
        const bandName = "Cey Band";
        const personnelMax = 5;

        const response = await supertest(app)
          .post("/band")
          .send({ name: bandName, max_personnel: personnelMax });
        expect(200);
        expect(response._body.message).toEqual("Success create new band!");
      });
    });
  });

  describe("update info of a band route", () => {
    describe("if band_id is invalid", () => {
      it("should return 400 and message", async () => {
        const band_id = null;

        const response = await supertest(app).put(`/band/${band_id}`);
        expect(400);
        expect(response._body.message).toEqual("No band is found!");
      });
    });

    describe("if band name is already exist", () => {
      it("should return 400 and message", async () => {
        const bandName = "Cey Band";
        const personnelMax = 5;

        const createNewBand = await query(
          `INSERT INTO bands VALUES(null, ${db.escape(
            bandName
          )}, ${personnelMax});`
        );

        const bandId = createNewBand.insertId;

        const response = await supertest(app)
          .put(`/band/${bandId}`)
          .send({ name: bandName });
        expect(400);
        expect(response._body.message).toEqual("Band name already exist!");
      });
    });

    describe("if band name is success updated", () => {
      it("should return 200 and message", async () => {
        const bandName = "Cey Band";
        const personnelMax = 5;
        const newBandName = "Cey 2 Band";

        const createNewBand = await query(
          `INSERT INTO bands VALUES(null, ${db.escape(
            bandName
          )}, ${personnelMax});`
        );
        const bandId = createNewBand.insertId;

        const response = await supertest(app)
          .put(`/band/${bandId}`)
          .send({ name: newBandName });
        expect(200);
        expect(response._body.message).toEqual("Update band info is success!");
      });
    });

    describe("if max personnel of the band is success updated", () => {
      it("should return 200 and message", async () => {
        const bandName = "Cey Band";
        const personnelMax = 5;

        const createNewBand = await query(
          `INSERT INTO bands VALUES(null, ${db.escape(
            bandName
          )}, ${personnelMax});`
        );
        const bandId = createNewBand.insertId;

        const response = await supertest(app)
          .put(`/band/${bandId}`)
          .send({ max_personnel: personnelMax });
        expect(200);
        expect(response._body.message).toEqual("Update band info is success!");
      });
    });
  });

  describe("add personnel into a band route", () => {
    describe("if personnel already joined a band", () => {
      it("should return 400 and message", async () => {
        const bandName = "D'Band";
        const personnelMax = 1;
        const personnelName = "Bibi";
        const position = "Vocalist";

        const responseCreateBand = await query(
          `INSERT INTO bands VALUES(null, ${db.escape(
            bandName
          )}, ${personnelMax});`
        );

        const responseCreatePersonnel = await query(
          `INSERT INTO personnels VALUES(null, ${
            responseCreateBand.insertId
          }, ${db.escape(personnelName)}, ${db.escape(position)});`
        );

        const response = await supertest(app).patch("/band/personnel").send({
          band_id: responseCreateBand.insertId,
          personnel_id: responseCreatePersonnel.insertId,
        });
        expect(400);
        expect(response._body.message).toEqual(
          "This personnel has already joined a band!"
        );
      });
    });

    describe("if band hits maximum personnel", () => {
      it("should return 400 and message", async () => {
        const bandName = "D'Band";
        const personnelMax = 1;
        const personnelName1 = "Bibi";
        const position1 = "Vocalist";
        const personnelName2 = "Bubu";
        const position2 = "Gitarist";

        const responseCreateBand = await query(
          `INSERT INTO bands VALUES(null, ${db.escape(
            bandName
          )}, ${personnelMax});`
        );

        const responseCreatePersonnel1 = await query(
          `INSERT INTO personnels VALUES(null, ${
            responseCreateBand.insertId
          }, ${db.escape(personnelName1)}, ${db.escape(position1)});`
        );

        const responseCreatePersonnel2 = await query(
          `INSERT INTO personnels VALUES(null, null, ${db.escape(
            personnelName2
          )}, ${db.escape(position2)});`
        );

        const response = await supertest(app).patch("/band/personnel").send({
          band_id: responseCreateBand.insertId,
          personnel_id: responseCreatePersonnel2.insertId,
        });
        expect(400);
        expect(response._body.message).toEqual(
          "This band already hits maximum of personnels!"
        );
      });
    });

    describe("if personnel success joined a band", () => {
      it("should return 200 and message", async () => {
        const bandName = "D'Band";
        const personnelMax = 1;
        const personnelName = "Bibi";
        const position = "Vocalist";

        const responseCreateBand = await query(
          `INSERT INTO bands VALUES(null, ${db.escape(
            bandName
          )}, ${personnelMax});`
        );

        const responseCreatePersonnel = await query(
          `INSERT INTO personnels VALUES(null, null, ${db.escape(
            personnelName
          )}, ${db.escape(position)});`
        );

        const response = await supertest(app).patch("/band/personnel").send({
          band_id: responseCreateBand.insertId,
          personnel_id: responseCreatePersonnel.insertId,
        });
        expect(200);
        expect(response._body.message).toEqual(
          "Success add personnel into the band!"
        );
      });
    });
  });
});
