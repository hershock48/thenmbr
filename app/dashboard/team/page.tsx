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

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'pending' | 'inactive'
  joinedAt: string
  lastActive: string
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-15T00:00:00Z',
    lastActive: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'editor',
    status: 'active',
    joinedAt: '2024-01-10T00:00:00Z',
    lastActive: '2024-01-19T14:20:00Z'
  }
]

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
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                <li>• Manage team members</li>
                <li>• Billing and subscription</li>
                <li>• Organization settings</li>
                <li>• Create and edit content</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Editor</h3>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Create and edit stories</li>
                <li>• Manage newsletters</li>
                <li>• View analytics</li>
                <li>• Cannot manage team</li>
                <li>• Cannot access billing</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold">Viewer</h3>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• View stories and content</li>
                <li>• View analytics</li>
                <li>• Cannot create or edit</li>
                <li>• Cannot manage team</li>
                <li>• Read-only access</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
