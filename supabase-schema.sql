create table if not exists scores (
  id bigserial primary key,
  player_name text not null check (char_length(player_name) between 1 and 20),
  score integer not null check (score >= 0 and score <= 10000000),
  created_at timestamptz not null default now()
);

create index if not exists scores_score_idx on scores (score desc, created_at asc);
