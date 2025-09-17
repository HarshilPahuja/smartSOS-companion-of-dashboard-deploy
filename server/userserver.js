// userserver.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import supabase from "./supabaseClient.js"; //  your client

const app = express();
const PORT = 4001;

// Middleware
app.use(cors({ origin: "http://localhost:8080" })); // your frontend port
app.use(express.json());

// POST route to insert into danger_zones
app.post("/api/add-demo", async (req, res) => {
  try {
    const { lat, lang, radius, message } = req.body;

    // Debug log
    console.log("Received danger zone:", req.body);

    // Insert into Supabase
    const { data, error } = await supabase
      .from("sos")
      .insert([{ lat, lang, radius, message }]); // insert row

    if (error) {
      console.error("❌ Supabase error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/danger-zones', async (req, res) => {
  try {
    // Fetch data from Supabase table
    const { data, error } = await supabase
      .from('danger_zones') // Replace with your actual table name
      .select('id, lat, lang, radius, message');

    if (error) {
      console.error('❌ Supabase error:', error.message);
      return res.status(500).json({ error: 'Failed to fetch danger zones' });
    }

    // Send JSON response to the frontend
    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Server error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
