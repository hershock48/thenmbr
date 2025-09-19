import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger } from "@/components/ui/select"
import { Search, Filter, ShoppingCart, Heart, Truck, Shield, Package } from "lucide-react"

export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-muted rounded-lg" />
                <div>
                  <div className="h-6 w-32 bg-muted rounded mb-1" />
                  <div className="h-4 w-12 bg-muted rounded" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" disabled>
                <Heart className="w-4 h-4 mr-2" />
                Wishlist
              </Button>
              <Button size="sm" disabled>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="h-9 w-96 bg-muted rounded mx-auto mb-4" />
          <div className="h-6 w-[600px] bg-muted rounded mx-auto" />
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search products..." disabled className="pl-10" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Select disabled>
                <SelectTrigger className="w-48">
                  <div className="h-4 w-20 bg-muted rounded" />
                </SelectTrigger>
              </Select>

              <Button variant="outline" size="sm" disabled>
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="group">
                <CardHeader className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-muted-foreground/20">
                        <div className="w-12 h-3 bg-muted rounded" />
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <div className="h-6 w-full bg-muted rounded mb-2" />
                      <div className="h-4 w-3/4 bg-muted rounded" />
                    </div>

                    {/* Story Card */}
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-muted rounded-full" />
                        <div className="h-4 w-24 bg-muted rounded" />
                      </div>
                      <div className="h-3 w-full bg-muted rounded mb-1" />
                      <div className="h-3 w-2/3 bg-muted rounded mb-2" />
                      <div className="h-6 w-20 bg-muted rounded" />
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-16 bg-muted rounded" />
                      <div className="flex items-center gap-1">
                        <div className="h-8 w-8 bg-muted rounded" />
                        <div className="h-4 w-6 bg-muted rounded" />
                        <div className="h-8 w-8 bg-muted rounded" />
                      </div>
                    </div>

                    <div className="h-10 w-full bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Truck className="w-8 h-8 text-muted-foreground" />
              <div className="h-5 w-24 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="w-8 h-8 text-muted-foreground" />
              <div className="h-5 w-28 bg-muted rounded" />
              <div className="h-4 w-36 bg-muted rounded" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Package className="w-8 h-8 text-muted-foreground" />
              <div className="h-5 w-32 bg-muted rounded" />
              <div className="h-4 w-40 bg-muted rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-muted rounded" />
              <div className="h-4 w-48 bg-muted rounded" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
