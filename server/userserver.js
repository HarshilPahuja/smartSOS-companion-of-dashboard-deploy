// userserver.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import supabase from "./supabaseClient.js"; //  your client

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: "*" }));
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

// POST route to insert reports into crowdsource table
app.post("/api/reports", async (req, res) => {
  try {
    const { lat, lang, dsc, img } = req.body;
    let imgUrl = null;

    if (img) {
      const base64Data = img.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const fileName = `reports/${uuidv4()}.png`;

      // Upload image
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("reports")
        .upload(fileName, buffer, { contentType: "image/png" });

      if (uploadError) {
        console.error("❌ Supabase Storage error:", uploadError.message);
        return res.status(500).json({ error: uploadError.message });
      }

      console.log("✅ Uploaded image:", uploadData);

      // Get public URL
      const { data: publicUrlData, error: urlError } = supabase.storage
        .from("reports")
        .getPublicUrl(fileName);

      if (urlError) {
        console.error("❌ Supabase URL error:", urlError.message);
        return res.status(500).json({ error: urlError.message });
      }

      imgUrl = publicUrlData.publicUrl; // <-- This is what goes into your table
    }

    // Insert into crowdsource table
    const { data: insertData, error: insertError } = await supabase
      .from("crowdsource")
      .insert([{ lat, lang, dsc, img: imgUrl }]);

    if (insertError) {
      console.error("❌ Supabase insert error:", insertError.message);
      return res.status(500).json({ error: insertError.message });
    }

    res.status(201).json({ success: true, data: insertData });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
