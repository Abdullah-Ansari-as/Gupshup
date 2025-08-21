const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
const app = express();

const PORT = 3000;
app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome from backend")
})

app.post("/api/send-whatsapp", async (req, res) => {
  try {
    const { destination, message } = req.body;

    const response = await axios.post(
      "https://api.gupshup.io/wa/api/v1/msg",
      new URLSearchParams({
        channel: "whatsapp",
        source: "917834811114", 
        destination,
        message,
        'src.name': process.env.GUPSHUP_APP_NAME
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          apikey: process.env.GUPSHUP_API_KEY,
        },
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// webhook endpoint to receive replies
app.post("/api/webhook", (req, res) => {
  console.log("Incoming webhook:", req.body);
  res.sendStatus(200);
});


app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`)
});