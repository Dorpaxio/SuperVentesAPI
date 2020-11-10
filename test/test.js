const request = require("supertest");
const app = require("../index");

describe('PRODUITS', () => {
    describe("GET /produits", () => {
        it("Récupère une liste vide de produits.", (done) => {
            request(app).get("/v1/produits").expect(200, [], done);
        })
    });
});
