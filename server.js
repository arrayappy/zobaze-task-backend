const express = require("express");
const app = express();
const cors = require("cors");
const bp = require("body-parser");
const fetch = require("node-fetch");
require('dotenv').config();

app.use(cors());
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(require("morgan")("dev"));

const AIRTABLEAPI = process.env.AIRTABLEAPI
const AIRTABLEBASEID = process.env.AIRTABLEBASEID
const AIRTABLETABLENAME = "itemsTable"; 

const port = process.env.PORT || 8000;

// Get All Items
app.get("/view", (req, res) => {
  fetch(
    `https://api.airtable.com/v0/${AIRTABLEBASEID}/${AIRTABLETABLENAME}`,
    {
      headers: { Authorization: `Bearer ${AIRTABLEAPI}` },
    }
  )
    .then((res) => res.json())
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});


// Add Item
app.post("/add", (req, res) => {

  var datain = req.body;
  
  var payload = {
    records: [
      {
        fields: datain,
      },
    ],
  };

  fetch(`https://api.airtable.com/v0/${AIRTABLEBASEID}/${AIRTABLETABLENAME}`, {
    method: "post",
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${AIRTABLEAPI}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Update Item
app.post("/update", (req, res) => {

  var datain = req.body;
  var updatedItem = {
    NAME: datain.updatedItem.NAME,
    CATEGORY: datain.updatedItem.CATEGORY,
    SELLING_PRICE: datain.updatedItem.SELLING_PRICE,
    COST_PRICE: datain.updatedItem.COST_PRICE,
    BARCODE: datain.updatedItem.BARCODE,
    STOCK_REMAINING: datain.updatedItem.STOCK_REMAINING,
  }
  var payload = {
    records: [
      {
        id: datain.id,
        fields: updatedItem,
      },
    ],
  };

  fetch(`https://api.airtable.com/v0/${AIRTABLEBASEID}/${AIRTABLETABLENAME}`, {
    method: "patch",
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${AIRTABLEAPI}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Delete Item
app.post("/delete", (req, res) => {
  fetch(
    `https://api.airtable.com/v0/${AIRTABLEBASEID}/${AIRTABLETABLENAME}/${req.body.id}`,
    {
      method: "delete",
      headers: {
        Authorization: `Bearer ${AIRTABLEAPI}`,
      },
    }
  )
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log("Server listening on " + port);
});