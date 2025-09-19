// Test Supabase connection with manually added environment variables
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log("[v0] Testing Supabase connection...")
console.log("[v0] URL:", supabaseUrl ? "Set" : "Missing")
console.log("[v0] Key:", supabaseKey ? "Set" : "Missing")

if (!supabaseUrl || !supabaseKey) {
  console.error("[v0] Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

try {
  // Test connection by checking existing tables
  const { data, error } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_schema", "public")
    .limit(5)

  if (error) {
    console.error("[v0] Connection error:", error.message)
  } else {
    console.log("[v0] Connection successful!")
    console.log(
      "[v0] Existing tables:",
      data.map((t) => t.table_name),
    )
  }
} catch (err) {
  console.error("[v0] Connection failed:", err.message)
}
