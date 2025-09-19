import { createClient } from "@supabase/supabase-js"
import fs from "fs"

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

console.log("[v0] Starting database setup...")

try {
  // Read and execute the main table creation script
  const createTablesSQL = fs.readFileSync("scripts/01-create-tables.sql", "utf8")

  console.log("[v0] Creating tables...")
  const { data, error } = await supabase.rpc("exec_sql", { sql: createTablesSQL })

  if (error) {
    console.error("[v0] Error creating tables:", error)
  } else {
    console.log("[v0] Tables created successfully!")
  }
} catch (err) {
  console.error("[v0] Database setup failed:", err)
}
