import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Vauntico backend is running");
});

// Verify Paystack payment and update Supabase
app.post("/api/verify-payment", async (req, res) => {
  const { reference, email } = req.body;
  if (!reference || !email) {
    return res.status(400).json({ error: "Missing reference or email" });
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );
    const data = await response.json();

    if (data.status && data.data.status === "success") {
      const { error } = await supabase.from("users").upsert({
        email,
        has_creator_pass: true,
        plan: data.data.plan || "ascension-seeker",
      });

      if (error) throw error;

      return res.json({ success: true, hasCreatorPass: true });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Payment not verified" });
    }
  } catch (err) {
    console.error("Paystack verification error:", err);
    return res.status(500).json({ error: "Server error verifying payment" });
  }
});

// Check user subscription status
app.get("/api/user-status", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Missing email" });

  const { data, error } = await supabase
    .from("users")
    .select("has_creator_pass, plan")
    .eq("email", email)
    .single();

  if (error || !data) return res.json({ hasCreatorPass: false });
  return res.json({ hasCreatorPass: data.has_creator_pass, plan: data.plan });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));