import request from "supertest";
import {app} from "../src/app";
import tokenData from "../token.json";

describe("Book API",()=>{
    beforeAll(async ()=>{
        await new Promise((resolve)=>setTimeout(resolve,1000));
    })
    it("POST /admin/addBooks should add a Book",async()=>{
        const response=await request(app)
        .post("/admin/addBooks")
        .send({
            bookCode:"Book-1", 
            title:"It ends with us", 
            publishedYear:2020,
            price:200,
            authors:"pqr",
        });
 
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("id");
        expect(response.body.data).toHaveProperty("description");
        expect(response.body.data).toHaveProperty("externalId");



    });

    describe("GET /user/Books should return all books",()=>{
        it("should return books", async ()=>{
            const response= await request(app).get("/user/books")

            expect(response.status).toBe(200);
            console.log(response.body.data[0]);
            expect(response.body).toHaveProperty("data");
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0)
            expect(response.body.data[0]).toHaveProperty("id");
            expect(response.body.data[0]).toHaveProperty("bookCode");
            expect(response.body.data[0]).toHaveProperty("description");
            expect(response.body.data[0]).toHaveProperty("externalId");
            expect(response.body.data[0]).toHaveProperty("title");
            expect(response.body.data[0]).toHaveProperty("authors");

        });
    });
    })