"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Plus, 
  Mail, 
  MoreHorizontal, 
  UserPlus,
  Crown,
  Shield,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import { useSubscription } from "@/contexts/SubscriptionContext"
import { TeamRolesPrompt } from "@/components/ui/tier-upgrade-prompt"
import { useOrganization } from "@/contexts/OrganizationContext"

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'pending' | 'inactive'
  joinedAt: string
  lastActive: string
}

// Start with empty team - will populate as users invite team members
const mockTeamMembers: TeamMember[] = []

const roleIcons = {
  admin: Crown,
  editor: Edit,
  viewer: Eye
}

const roleColors = {
  admin: 'bg-red-100 text-red-800',
  editor: 'bg-blue-100 text-blue-800',
  viewer: 'bg-gray-100 text-gray-800'
}

export default function TeamPage() {
  const { tier, canAddSeat, getRemainingSeats, incrementSeatUsage } = useSubscription()
  const { terminology } = useOrganization()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer'
  })

  const handleAddMember = () => {
    if (!canAddSeat()) {
      return // Show upgrade prompt
    }

    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      status: 'pending',
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }

    setTeamMembers([...teamMembers, member])
    incrementSeatUsage()
    setNewMember({ name: '', email: '', role: 'viewer' })
    setIsAddingMember(false)
  }

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId))
  }

  const getRoleIcon = (role: string) => {
    const IconComponent = roleIcons[role as keyof typeof roleIcons]
    return <IconComponent className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">Manage your team members and their permissions</p>
        </div>
        {canAddSeat() ? (
          <Button onClick={() => setIsAddingMember(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        ) : (
          <TeamRolesPrompt />
        )}
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">
                  {teamMembers.filter(m => m.status === 'active').length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Remaining Seats</p>
                <p className="text-2xl font-bold">
                  {getRemainingSeats() === -1 ? 'Unlimited' : getRemainingSeats()}
                </p>
              </div>
              <Crown className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Member Form */}
      {isAddingMember && (
        <Card>
          <CardHeader>
            <CardTitle>Add Team Member</CardTitle>
            <CardDescription>Invite a new team member to your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={newMember.role}
                onValueChange={(value: 'admin' | 'editor' | 'viewer') => 
                  setNewMember({ ...newMember, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Admin - Full access
                    </div>
                  </SelectItem>
                  <SelectItem value="editor">
                    <div className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Editor - Create and edit content
                    </div>
                  </SelectItem>
                  <SelectItem value="viewer">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Viewer - Read-only access
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddMember} disabled={!newMember.name || !newMember.email}>
                <UserPlus className="w-4 h-4 mr-2" />
                Send Invitation
              </Button>
              <Button variant="outline" onClick={() => setIsAddingMember(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team members and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          {teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Build Your Team
              </h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                Invite team members to help manage your {terminology.stories.toLowerCase()}, 
                newsletters, and donor relationships. Collaborate effectively with role-based permissions.
              </p>

              {/* Quick Start Guide */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
                <h4 className="text-lg font-semibold text-foreground mb-4">How Team Management Works</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Invite Team Members</h5>
                      <p className="text-sm text-muted-foreground">Send email invitations to colleagues and volunteers.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Assign Roles</h5>
                      <p className="text-sm text-muted-foreground">Set appropriate permissions for each team member.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Collaborate</h5>
                      <p className="text-sm text-muted-foreground">Work together on stories, newsletters, and donor outreach.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setIsAddingMember(true)}
                  className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Invite Your First Team Member
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6"
                  onClick={() => window.open('/help/team-management', '_blank')}
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{member.name}</h3>
                        <Badge className={roleColors[member.role]}>
                          <div className="flex items-center gap-1">
                            {getRoleIcon(member.role)}
                            {member.role}
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Understand what each role can do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold">Admin</h3>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Full access to all features</li>
                <li>• Manage team members and roles</li>
                <li>• Billing and subscription management</li>
                <li>• Organization settings and branding</li>
                <li>• Create and edit {terminology.stories.toLowerCase()}</li>
                <li>• Send newsletters and communications</li>
                <li>• View all analytics and reports</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Editor</h3>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Create and edit {terminology.stories.toLowerCase()}</li>
                <li>• Send newsletters and updates</li>
                <li>• Manage donor communications</li>
                <li>• View analytics and reports</li>
                <li>• Cannot manage team or billing</li>
                <li>• Cannot change organization settings</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold">Viewer</h3>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• View {terminology.stories.toLowerCase()} and content</li>
                <li>• View analytics and reports</li>
                <li>• Read donor communications</li>
                <li>• Cannot create or edit content</li>
                <li>• Cannot manage team or settings</li>
                <li>• Read-only access for volunteers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
