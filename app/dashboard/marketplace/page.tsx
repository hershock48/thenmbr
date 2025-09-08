"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShoppingCart, 
  Heart, 
  Palette, 
  Hash, 
  Image, 
  Plus, 
  Minus, 
  CheckCircle,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ArrowRight
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface BraceletDesign {
  id: string
  name: string
  description: string
  basePrice: number
  colors: string[]
  image: string
  popular: boolean
}

interface Customization {
  quantity: number
  color: string
  numbers: string[]
  logoOption: 'number-only' | 'logo-number' | 'custom-text'
  customText?: string
  logoFile?: File
}

const braceletDesigns: BraceletDesign[] = [
  {
    id: 'classic-silicone',
    name: 'Classic Silicone',
    description: 'Soft, durable silicone bracelet perfect for everyday wear',
    basePrice: 2.99,
    colors: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#000000', '#FFFFFF'],
    image: '/placeholder.jpg',
    popular: true
  },
  {
    id: 'premium-leather',
    name: 'Premium Leather',
    description: 'High-quality leather band with engraved numbers',
    basePrice: 8.99,
    colors: ['#8B4513', '#654321', '#D2691E', '#A0522D', '#000000'],
    image: '/placeholder.jpg',
    popular: false
  },
  {
    id: 'stainless-steel',
    name: 'Stainless Steel',
    description: 'Durable metal bracelet with laser-engraved numbers',
    basePrice: 12.99,
    colors: ['#C0C0C0', '#FFD700', '#CD7F32', '#000000'],
    image: '/placeholder.jpg',
    popular: true
  },
  {
    id: 'wooden-beads',
    name: 'Wooden Beads',
    description: 'Eco-friendly wooden beads with carved numbers',
    basePrice: 6.99,
    colors: ['#8B4513', '#D2691E', '#DEB887', '#F4A460'],
    image: '/placeholder.jpg',
    popular: false
  }
]

const logoOptions = [
  { value: 'number-only', label: 'Number Only', description: 'Just the engraved number' },
  { value: 'logo-number', label: 'Logo + Number', description: 'Your logo with the number' },
  { value: 'custom-text', label: 'Custom Text', description: 'Custom text with number' }
]

export default function MarketplacePage() {
  const { org } = useAuth()
  const [selectedDesign, setSelectedDesign] = useState<BraceletDesign | null>(null)
  const [customization, setCustomization] = useState<Customization>({
    quantity: 1,
    color: '',
    numbers: [''],
    logoOption: 'number-only'
  })
  const [cart, setCart] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)
  const [currentStep, setCurrentStep] = useState<'designs' | 'customize' | 'cart'>('designs')
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [success, setSuccess] = useState("")
  const [showCheckout, setShowCheckout] = useState(false)

  const handleDesignSelect = (design: BraceletDesign) => {
    setSelectedDesign(design)
    setCustomization(prev => ({
      ...prev,
      color: design.colors[0] || ''
    }))
    // Automatically advance to customization step
    setCurrentStep('customize')
  }

  const handleQuantityChange = (change: number) => {
    setCustomization(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + change)
    }))
  }

  const handleNumberChange = (index: number, value: string) => {
    setCustomization(prev => ({
      ...prev,
      numbers: prev.numbers.map((num, i) => i === index ? value : num)
    }))
  }

  const addNumberField = () => {
    setCustomization(prev => ({
      ...prev,
      numbers: [...prev.numbers, '']
    }))
  }

  const removeNumberField = (index: number) => {
    if (customization.numbers.length > 1) {
      setCustomization(prev => ({
        ...prev,
        numbers: prev.numbers.filter((_, i) => i !== index)
      }))
    }
  }

  const addToCart = () => {
    if (!selectedDesign) return

    // Validate before adding to cart
    if (!validateCustomization()) {
      return
    }

    const item = {
      id: `${selectedDesign.id}-${Date.now()}`,
      design: selectedDesign,
      customization: { ...customization },
      totalPrice: selectedDesign.basePrice * customization.quantity
    }

    setCart(prev => [...prev, item])
    setShowCart(true)
    setErrors({}) // Clear any previous errors
    setSuccess("Item added to cart successfully!")
    setTimeout(() => setSuccess(""), 3000)
    // Automatically advance to cart step
    setCurrentStep('cart')
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0)
  }

  // Form validation
  const validateCustomization = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!customization.color) {
      newErrors.color = 'Please select a color'
    }
    
    if (customization.numbers.filter(n => n.trim()).length === 0) {
      newErrors.numbers = 'Please enter at least one number'
    }
    
    if (customization.logoOption === 'custom-text' && !customization.customText?.trim()) {
      newErrors.customText = 'Please enter custom text'
    }
    
    if (customization.customText && customization.customText.length > 20) {
      newErrors.customText = 'Custom text must be 20 characters or less'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Cart management functions
  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
    if (cart.length === 1) {
      setCurrentStep('designs')
    }
  }

  const updateCartItem = (itemId: string, updates: Partial<Customization>) => {
    setCart(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            customization: { ...item.customization, ...updates },
            totalPrice: item.design.basePrice * (updates.quantity || item.customization.quantity)
          }
        : item
    ))
  }

  // Checkout process
  const handleCheckout = async () => {
    if (cart.length === 0) return
    
    setIsProcessing(true)
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuccess(`Order placed successfully! ${cart.length} item(s) will be processed.`)
      setCart([])
      setCurrentStep('designs')
      setSelectedDesign(null)
      setCustomization({
        quantity: 1,
        color: '',
        numbers: [''],
        logoOption: 'number-only'
      })
      
      setTimeout(() => setSuccess(""), 5000)
    } catch (error) {
      setErrors({ checkout: 'Checkout failed. Please try again.' })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Error and Success Messages */}
      {Object.keys(errors).length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 text-red-500">⚠️</div>
            <div className="text-red-700 text-sm">
              {Object.values(errors).map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setErrors({})}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </Button>
          </div>
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <div className="w-4 h-4 text-green-500">✅</div>
          <span className="text-green-700 text-sm">{success}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSuccess("")}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            ×
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-8 rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">NMBR Marketplace</h1>
          <p className="text-lg text-cyan-100 max-w-3xl mx-auto">
            Create custom numbered bracelets that connect your supporters to the people they help. 
            Each bracelet tells a story and makes a real impact.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as any)} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="designs">Choose Design</TabsTrigger>
            <TabsTrigger value="customize" disabled={!selectedDesign}>Customize</TabsTrigger>
            <TabsTrigger value="cart">Cart ({cart.length})</TabsTrigger>
          </TabsList>

          {/* Design Selection */}
          <TabsContent value="designs" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Bracelet Design</h2>
              <p className="text-muted-foreground text-lg">
                Select the perfect style for your organization's numbered bracelets
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {braceletDesigns.map((design) => (
                <Card 
                  key={design.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    selectedDesign?.id === design.id 
                      ? 'ring-2 ring-cyan-500 border-cyan-200' 
                      : 'hover:border-cyan-200'
                  }`}
                  onClick={() => handleDesignSelect(design)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-xl flex items-center justify-center">
                        <Heart className="w-8 h-8 text-cyan-600" />
                      </div>
                      {design.popular && (
                        <Badge className="bg-orange-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{design.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {design.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {design.colors.slice(0, 4).map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border-2 border-gray-200"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        {design.colors.length > 4 && (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center text-xs">
                            +{design.colors.length - 4}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-foreground">
                          ${design.basePrice}
                        </span>
                        <span className="text-sm text-muted-foreground">each</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Continue Button */}
            {selectedDesign && (
              <div className="text-center mt-8">
                <Button 
                  onClick={() => setCurrentStep('customize')}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                >
                  Continue to Customization
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Customization */}
          <TabsContent value="customize" className="space-y-6">
            {selectedDesign && (
              <>
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('designs')}
                      className="mr-4"
                    >
                      ← Back to Designs
                    </Button>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-foreground mb-2">Customize Your Bracelets</h2>
                      <p className="text-muted-foreground text-lg">
                        Personalize your {selectedDesign.name} bracelets
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Customization Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Customization Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Quantity */}
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={customization.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            id="quantity"
                            type="number"
                            value={customization.quantity}
                            onChange={(e) => setCustomization(prev => ({
                              ...prev,
                              quantity: Math.max(1, parseInt(e.target.value) || 1)
                            }))}
                            className="w-20 text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Color Selection */}
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {selectedDesign.colors.map((color, index) => (
                            <button
                              key={index}
                              className={`w-12 h-12 rounded-lg border-2 transition-all ${
                                customization.color === color
                                  ? 'border-cyan-500 ring-2 ring-cyan-200'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                setCustomization(prev => ({ ...prev, color }))
                                if (errors.color) {
                                  setErrors(prev => ({ ...prev, color: '' }))
                                }
                              }}
                            />
                          ))}
                        </div>
                        {errors.color && (
                          <p className="text-sm text-red-600">{errors.color}</p>
                        )}
                      </div>

                      {/* Logo Option */}
                      <div className="space-y-2">
                        <Label>Engraving Option</Label>
                        <Select
                          value={customization.logoOption}
                          onValueChange={(value: any) => setCustomization(prev => ({
                            ...prev,
                            logoOption: value
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {logoOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-sm text-muted-foreground">{option.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Custom Text */}
                      {customization.logoOption === 'custom-text' && (
                        <div className="space-y-2">
                          <Label htmlFor="customText">Custom Text</Label>
                          <Input
                            id="customText"
                            placeholder="Enter custom text..."
                            value={customization.customText || ''}
                            onChange={(e) => {
                              setCustomization(prev => ({
                                ...prev,
                                customText: e.target.value
                              }))
                              if (errors.customText) {
                                setErrors(prev => ({ ...prev, customText: '' }))
                              }
                            }}
                            maxLength={20}
                          />
                          <p className="text-xs text-muted-foreground">
                            {customization.customText?.length || 0}/20 characters
                          </p>
                          {errors.customText && (
                            <p className="text-sm text-red-600">{errors.customText}</p>
                          )}
                        </div>
                      )}

                      {/* Numbers */}
                      <div className="space-y-2">
                        <Label>Numbers to Engrave</Label>
                        <div className="space-y-2">
                          {customization.numbers.map((number, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Input
                                placeholder={`Number ${index + 1}`}
                                value={number}
                                onChange={(e) => {
                                  handleNumberChange(index, e.target.value)
                                  if (errors.numbers) {
                                    setErrors(prev => ({ ...prev, numbers: '' }))
                                  }
                                }}
                                className="flex-1"
                              />
                              {customization.numbers.length > 1 && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeNumberField(index)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={addNumberField}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Another Number
                          </Button>
                        </div>
                        {errors.numbers && (
                          <p className="text-sm text-red-600">{errors.numbers}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preview & Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Hash className="w-5 h-5" />
                        Preview & Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Preview */}
                      <div className="text-center">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                          <Heart className="w-16 h-16 text-cyan-600" />
                        </div>
                        <p className="text-sm text-muted-foreground">Preview coming soon</p>
                      </div>

                      {/* Summary */}
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Design:</span>
                          <span className="font-medium">{selectedDesign.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Color:</span>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: customization.color }}
                            />
                            <span className="font-medium">Selected</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>Quantity:</span>
                          <span className="font-medium">{customization.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Numbers:</span>
                          <span className="font-medium">{customization.numbers.filter(n => n).length}</span>
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span>${(selectedDesign.basePrice * customization.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={addToCart}
                        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Cart */}
          <TabsContent value="cart" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Your Cart</h2>
              <p className="text-muted-foreground text-lg">
                Review your order before checkout
              </p>
            </div>

            {cart.length === 0 ? (
              <Card className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground">Start by selecting a bracelet design</p>
              </Card>
            ) : (
              <div className="space-y-6">
                {cart.map((item, index) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-xl flex items-center justify-center">
                            <Heart className="w-8 h-8 text-cyan-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.design.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.customization.quantity} × ${item.design.basePrice}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Color: {item.customization.color}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">${item.totalPrice.toFixed(2)}</div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Button 
                        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                        onClick={handleCheckout}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Truck className="w-4 h-4 mr-2" />
                            Proceed to Checkout
                          </>
                        )}
                      </Button>
                      <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-1" />
                          Secure Checkout
                        </div>
                        <div className="flex items-center">
                          <RotateCcw className="w-4 h-4 mr-1" />
                          30-day Returns
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
