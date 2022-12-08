/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import express from "express";
import bodyParser from "body-parser";
import DemoApp from "./app";
import basicAuth from "./utils/basicauth";

const router = express.Router();
const app = express();

// Setup middleware
app.use(basicAuth);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
router.post("/setup", (req, res) => {
  const demo = new DemoApp();

  demo.setup().then((result) => {
    let code = 200;
    let message = "";

    demo.shutdown();

    if (result) {
      code = 200;
      message = "App setup completed.";
    } else {
      code = 400;
      message = "Setup previously completed";
    }

    res.statusCode = code;
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify({ message }));
  });
});

router.post("/upload_resume", (req, res) => {
  const demo = new DemoApp();

  /* NOTE: In reality, we should be obtaining the requestion client's IP address 
           from req.ip.
           However, it's likely this Demo App is run from the same "localhost" machine,
           and the fact that in Demo usage the IP address won't really trigger
           an Embargo sanctioned check, we are mocking up the request is coming from 
           the IP address that is set in header['ClientIPAddress'] field.
  */
  const clientIp = req.headers.clientipaddress;

  demo.uploadResume(req.user, clientIp, req.body).then(([code, message]) => {
    demo.shutdown();

    res.statusCode = code;
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify({ message }));
  });
});

router.get("/employee/:email", (req, res) => {
  const demo = new DemoApp();

  demo.fetchEmployeeRecord(req.user, req.params.email).then(({ code, emp }) => {
    demo.shutdown();

    res.statusCode = code;
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify({ emp }));
  });
});

router.post("/update_employee", (req, res) => {
  const demo = new DemoApp();

  demo.updateEmployee(req.user, req.body).then(([code, message]) => {
    demo.shutdown();

    res.statusCode = code;
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify({ message }));
  });
});

app.use("/", router);

app.listen(8080, () => {
  console.log("Server started at http://localhost:8080");
});
