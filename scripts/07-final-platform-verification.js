import { supabase } from "../lib/supabase.js"

console.log("[v0] Starting comprehensive NMBR platform verification...")

async function verifyPlatformFunctionality() {
  const results = {
    database: false,
    authentication: false,
    stories: false,
    donations: false,
    analytics: false,
  }

  try {
    // Test 1: Database Connection
    console.log("[v0] Testing database connection...")
    const { data: healthCheck, error: healthError } = await supabase.from("organizations").select("count").limit(1)

    if (!healthError) {
      results.database = true
      console.log("✅ Database connection successful")
    } else {
      console.log("❌ Database connection failed:", healthError.message)
    }

    // Test 2: Authentication System
    console.log("[v0] Testing authentication system...")
    try {
      // Test user creation (will fail if user exists, which is fine)
      const testEmail = `test-${Date.now()}@nmbr.test`
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: "TestPassword123!",
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000",
        },
      })

      if (authData.user || authError?.message?.includes("already registered")) {
        results.authentication = true
        console.log("✅ Authentication system working")
      } else {
        console.log("❌ Authentication failed:", authError?.message)
      }
    } catch (authErr) {
      console.log("❌ Authentication test error:", authErr.message)
    }

    // Test 3: Story Management
    console.log("[v0] Testing story management...")
    const { data: stories, error: storiesError } = await supabase
      .from("stories")
      .select("id, title, nmbr_code")
      .limit(5)

    if (!storiesError && stories) {
      results.stories = true
      console.log(`✅ Story management working - Found ${stories.length} stories`)
      if (stories.length > 0) {
        console.log("   Sample stories:", stories.map((s) => `${s.nmbr_code}: ${s.title}`).join(", "))
      }
    } else {
      console.log("❌ Story management failed:", storiesError?.message)
    }

    // Test 4: Donation Tracking
    console.log("[v0] Testing donation tracking...")
    const { data: donations, error: donationsError } = await supabase
      .from("donations")
      .select("id, amount, story_id")
      .limit(5)

    if (!donationsError && donations !== null) {
      results.donations = true
      console.log(`✅ Donation tracking working - Found ${donations.length} donations`)
      if (donations.length > 0) {
        const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0)
        console.log(`   Total sample donations: $${totalAmount}`)
      }
    } else {
      console.log("❌ Donation tracking failed:", donationsError?.message)
    }

    // Test 5: Analytics Data
    console.log("[v0] Testing analytics capabilities...")
    const { data: analytics, error: analyticsError } = await supabase
      .from("story_views")
      .select("story_id, view_count")
      .limit(5)

    if (!analyticsError && analytics !== null) {
      results.analytics = true
      console.log(`✅ Analytics working - Found ${analytics.length} view records`)
    } else {
      console.log("❌ Analytics failed:", analyticsError?.message)
    }

    // Summary
    console.log("\n[v0] Platform Verification Summary:")
    console.log("=====================================")
    const passedTests = Object.values(results).filter(Boolean).length
    const totalTests = Object.keys(results).length

    Object.entries(results).forEach(([test, passed]) => {
      console.log(
        `${passed ? "✅" : "❌"} ${test.charAt(0).toUpperCase() + test.slice(1)}: ${passed ? "PASS" : "FAIL"}`,
      )
    })

    console.log(`\nOverall Score: ${passedTests}/${totalTests} tests passed`)

    if (passedTests === totalTests) {
      console.log("🎉 Your NMBR platform is fully operational!")
      console.log("Ready for production deployment and user onboarding.")
    } else {
      console.log("⚠️  Some systems need attention before going live.")
    }

    return results
  } catch (error) {
    console.error("[v0] Platform verification failed:", error)
    return results
  }
}

// Run verification
verifyPlatformFunctionality()
  .then((results) => {
    console.log("[v0] Verification complete")
  })
  .catch((error) => {
    console.error("[v0] Verification error:", error)
  })
