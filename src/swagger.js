const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "API 명세서",
    description: "Test APIs with Express",
  },
  host: ["localhost:4000", "https://my-practice-server.herokuapp.com"],
  schemes: ["http"],
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
