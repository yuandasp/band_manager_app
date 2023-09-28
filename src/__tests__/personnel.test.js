const supertest = require("supertest");
const app = require("../index");
const { db, query } = require("../database/index");

describe("band", () => {
  afterEach(async () => {
    await query("DELETE FROM bands");
    await query("DELETE FROM personnels");
  });

  describe("create a new personnel route", () => {
    describe("if name of the personnel does not exist", () => {
      it("should return 400 and message", async () => {
        const personnelName = "";
        const position = "Guitarist";

        const response = await supertest(app)
          .post("/personnel")
          .send({ name: personnelName, position: position });
        expect(400);
        expect(response._body.message).toEqual("Name is required!");
      });
    });

    describe("if position of the personnel does not exist", () => {
      it("should return 400 and message", async () => {
        const personnelName = "Jaehwan";
        const position = "";

        const response = await supertest(app)
          .post("/personnel")
          .send({ name: personnelName, position: position });
        expect(400);
        expect(response._body.message).toEqual("Position is required!");
      });
    });

    describe("if a new personnel success created", () => {
      it("should return 200 and message", async () => {
        const personnelName = "Jaehwan";
        const position = "Guitarist";

        const response = await supertest(app)
          .post("/personnel")
          .send({ name: personnelName, position: position });
        expect(200);
        expect(response._body.message).toEqual("Success create new personnel!");
      });
    });
  });
});
