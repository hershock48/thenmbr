import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log("[v0] Starting database setup...")

  try {
    // Test connection first
    const { data, error } = await supabase.from("organizations").select("count").limit(1)

    if (error && error.code === "42P01") {
      console.log("[v0] Tables do not exist, creating them...")

      // Read and execute the SQL file
      const fs = await import("fs")
      const path = await import("path")

      const sqlPath = path.join(process.cwd(), "scripts", "01-create-tables.sql")
      const sqlContent = fs.readFileSync(sqlPath, "utf8")

      // Execute the SQL
      const { error: createError } = await supabase.rpc("exec_sql", { sql: sqlContent })

      if (createError) {
        console.error("[v0] Error creating tables:", createError)
        return false
      }

      console.log("[v0] Database tables created successfully!")
      return true
    } else if (error) {
      console.error("[v0] Database connection error:", error)
      return false
    } else {
      console.log("[v0] Database tables already exist!")
      return true
    }
  } catch (err) {
    console.error("[v0] Setup error:", err)
    return false
  }
}

setupDatabase().then((success) => {
  if (success) {
    console.log("[v0] Database setup completed successfully!")
  } else {
    console.log("[v0] Database setup failed!")
    process.exit(1)
  }
})
