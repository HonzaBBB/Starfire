const { getSupabase } = require("./_db");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsedLimit = Number(req.query.limit || 10);
  const limit = Number.isFinite(parsedLimit) ? Math.max(1, Math.min(20, Math.floor(parsedLimit))) : 10;

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("scores")
      .select("player_name, score, created_at")
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      return res.status(500).json({ error: "Failed to fetch leaderboard" });
    }

    const items = (data || []).map((row) => ({
      playerName: row.player_name,
      score: row.score,
      createdAt: row.created_at
    }));

    return res.status(200).json({ items });
  } catch (err) {
    return res.status(500).json({ error: "Server configuration error" });
  }
};
