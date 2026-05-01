const { getSupabase } = require("./_db");

function normalizeName(name) {
  const safe = String(name || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 20);
  return safe || "Pilot";
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (err) {
      return {};
    }
  }
  return req.body;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = parseBody(req);
  const playerName = normalizeName(body.playerName);
  const score = Number(body.score);
  if (!Number.isInteger(score) || score < 0 || score > 10000000) {
    return res.status(400).json({ error: "Invalid score" });
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("scores").insert({
      player_name: playerName,
      score
    });

    if (error) {
      return res.status(500).json({
        error: "Failed to save score",
        details: error.message || "Unknown Supabase insert error",
        code: error.code || null
      });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({
      error: "Server configuration error",
      details: err && err.message ? err.message : "Unknown server error"
    });
  }
};
