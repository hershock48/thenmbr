"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Upload,
  Trash2
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react"

export default function SettingsPage() {
  const { user, org } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Form state management
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: ''
  })

  const [orgData, setOrgData] = useState({
    name: org?.name || '',
    website: org?.website || '',
    description: ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newSubscribers: true,
    donationAlerts: true,
    weeklyReports: false
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

  // Update form data and mark as changed
  const updateProfileData = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const updateOrgData = (field: string, value: string) => {
    setOrgData(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const updateNotificationSettings = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const updatePasswordData = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  // File upload functionality
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError("File size must be less than 2MB")
        return
      }
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file")
        return
      }
      
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setHasUnsavedChanges(true)
    }
  }

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      // Validate required fields
      if (!profileData.firstName || !profileData.lastName || !profileData.email) {
        setError("Please fill in all required fields")
        return
      }

      if (!validateEmail(profileData.email)) {
        setError("Please enter a valid email address")
        return
      }

      if (profileData.phone && !validatePhone(profileData.phone)) {
        setError("Please enter a valid phone number")
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess("Settings saved successfully!")
      setHasUnsavedChanges(false)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to save settings. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Password change functionality
  const handlePasswordChange = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      // Validate password fields
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setError("Please fill in all password fields")
        return
      }

      if (!validatePassword(passwordData.newPassword)) {
        setError("New password must be at least 8 characters long")
        return
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("New passwords do not match")
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess("Password changed successfully!")
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to change password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Data export functionality
  const handleDataExport = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create and download JSON file
      const data = {
        profile: profileData,
        organization: orgData,
        notifications: notificationSettings,
        exportedAt: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nmbr-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setSuccess("Data exported successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to export data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Account deletion functionality
  const handleAccountDeletion = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data."
    )
    
    if (confirmed) {
      const doubleConfirmed = window.confirm(
        "This is your final warning. Type 'DELETE' to confirm account deletion."
      )
      
      if (doubleConfirmed) {
        try {
          setIsLoading(true)
          setError("")
          
          // Step 1: Cancel active subscription first
          setSuccess("Step 1: Cancelling your subscription...")
          await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate subscription cancellation API call
          
          // Step 2: Process account deletion
          setSuccess("Step 2: Processing account deletion...")
          await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate account deletion API call
          
          // Step 3: Confirm completion
          setSuccess("Account deletion completed successfully. Your subscription has been cancelled and all data has been permanently deleted. You will receive a confirmation email.")
          setTimeout(() => setSuccess(""), 8000)
          
        } catch (err) {
          setError("Failed to delete account. Please contact support immediately to avoid continued billing.")
        } finally {
          setIsLoading(false)
        }
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <div className="w-4 h-4 text-red-500">⚠️</div>
          <span className="text-red-700 text-sm">{error}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setError("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </Button>
        </div>
      )}

      {/* Success Message */}
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
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and organization preferences</p>
        {hasUnsavedChanges && (
          <p className="text-sm text-orange-600">• You have unsaved changes</p>
        )}
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input 
                    id="firstName" 
                    value={profileData.firstName}
                    onChange={(e) => updateProfileData('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input 
                    id="lastName" 
                    value={profileData.lastName}
                    onChange={(e) => updateProfileData('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => updateProfileData('email', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={profileData.phone}
                  onChange={(e) => updateProfileData('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Settings */}
        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Organization Details
              </CardTitle>
              <CardDescription>
                Manage your organization's information and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name *</Label>
                <Input 
                  id="orgName" 
                  value={orgData.name}
                  onChange={(e) => updateOrgData('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgWebsite">Website</Label>
                <Input 
                  id="orgWebsite" 
                  value={orgData.website}
                  onChange={(e) => updateOrgData('website', e.target.value)}
                  placeholder="https://example.org" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgDescription">Description</Label>
                <Textarea 
                  id="orgDescription" 
                  value={orgData.description}
                  onChange={(e) => updateOrgData('description', e.target.value)}
                  placeholder="Tell us about your organization's mission and impact..."
                  className="min-h-20"
                />
              </div>
              <div className="space-y-2">
                <Label>Organization Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => updateNotificationSettings('emailNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>New Subscribers</Label>
                    <p className="text-sm text-gray-500">Get notified when someone subscribes to your stories</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.newSubscribers}
                    onCheckedChange={(checked) => updateNotificationSettings('newSubscribers', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Donation Alerts</Label>
                    <p className="text-sm text-gray-500">Receive notifications for new donations</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.donationAlerts}
                    onCheckedChange={(checked) => updateNotificationSettings('donationAlerts', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-gray-500">Get weekly performance summaries</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => updateNotificationSettings('weeklyReports', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Privacy
              </CardTitle>
              <CardDescription>
                Manage your account security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input 
                    type="password" 
                    value={passwordData.currentPassword}
                    onChange={(e) => updatePasswordData('currentPassword', e.target.value)}
                    placeholder="Enter current password" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => updatePasswordData('newPassword', e.target.value)}
                    placeholder="Enter new password" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => updatePasswordData('confirmPassword', e.target.value)}
                    placeholder="Confirm new password" 
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePasswordChange}
                  disabled={isLoading}
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Badge variant="secondary">Not Enabled</Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSuccess("2FA setup will be available soon!")}
                >
                  Enable 2FA
                </Button>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Data Export</Label>
                    <p className="text-sm text-gray-500">Download all your data</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDataExport}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Exporting...' : 'Export Data'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Delete Account</Label>
                    <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                    <p className="text-xs text-red-600 font-medium">⚠️ This will also cancel your active subscription immediately</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleAccountDeletion}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isLoading ? 'Deleting Account...' : 'Delete Account'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700">
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
