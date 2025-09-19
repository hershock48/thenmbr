import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function seedDatabase() {
  console.log("[v0] Starting database seeding...")

  try {
    // Create sample organizations
    const { data: orgs, error: orgError } = await supabase
      .from("organizations")
      .insert([
        {
          name: "Hope Foundation",
          description: "Supporting communities in need",
          website: "https://hopefoundation.org",
          logo_url: "/hope-foundation-logo.jpg",
          is_active: true,
        },
        {
          name: "Green Earth Initiative",
          description: "Environmental conservation and sustainability",
          website: "https://greenearthinitiative.org",
          logo_url: "/green-earth-logo.jpg",
          is_active: true,
        },
      ])
      .select()

    if (orgError) throw orgError
    console.log("[v0] Organizations created:", orgs.length)

    // Create sample users
    const { data: users, error: userError } = await supabase
      .from("users")
      .insert([
        {
          email: "admin@thenmbr.com",
          full_name: "NMBR Admin",
          role: "super_admin",
        },
        {
          email: "hope@hopefoundation.org",
          full_name: "Hope Foundation Admin",
          role: "org_admin",
          organization_id: orgs[0].id,
        },
      ])
      .select()

    if (userError) throw userError
    console.log("[v0] Users created:", users.length)

    // Create sample NMBRs
    const { data: nmbrs, error: nmbrError } = await supabase
      .from("nmbrs")
      .insert([
        {
          code: "HOPE001",
          organization_id: orgs[0].id,
          is_active: true,
          metadata: { campaign: "Winter Relief 2024" },
        },
        {
          code: "GREEN001",
          organization_id: orgs[1].id,
          is_active: true,
          metadata: { campaign: "Tree Planting Initiative" },
        },
      ])
      .select()

    if (nmbrError) throw nmbrError
    console.log("[v0] NMBRs created:", nmbrs.length)

    // Create sample subscribers
    const { data: subscribers, error: subError } = await supabase
      .from("subscribers")
      .insert([
        {
          email: "supporter1@example.com",
          full_name: "John Supporter",
          organization_id: orgs[0].id,
        },
        {
          email: "supporter2@example.com",
          full_name: "Jane Green",
          organization_id: orgs[1].id,
        },
      ])
      .select()

    if (subError) throw subError
    console.log("[v0] Subscribers created:", subscribers.length)

    console.log("[v0] ✅ Database seeding completed successfully!")
    console.log("[v0] Sample data created:")
    console.log("[v0] - Organizations:", orgs.length)
    console.log("[v0] - Users:", users.length)
    console.log("[v0] - NMBRs:", nmbrs.length)
    console.log("[v0] - Subscribers:", subscribers.length)
  } catch (error) {
    console.error("[v0] ❌ Seeding failed:", error.message)
  }
}

seedDatabase()
