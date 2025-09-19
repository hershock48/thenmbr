"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings, 
  Mail, 
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'moderator' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
  permissions: string[]
  lastActive: string
  invitedBy: string
  createdAt: string
}

const ROLE_PERMISSIONS = {
  super_admin: {
    label: 'Super Admin',
    description: 'Full access to all features and settings',
    permissions: ['all'],
    color: 'bg-red-100 text-red-800'
  },
  admin: {
    label: 'Admin',
    description: 'Manage users, organizations, and content',
    permissions: ['view', 'edit', 'manage_users', 'manage_organizations', 'manage_content'],
    color: 'bg-blue-100 text-blue-800'
  },
  moderator: {
    label: 'Moderator',
    description: 'Moderate content and manage support',
    permissions: ['view', 'moderate_content', 'manage_support'],
    color: 'bg-yellow-100 text-yellow-800'
  },
  viewer: {
    label: 'Viewer',
    description: 'View-only access to analytics and reports',
    permissions: ['view'],
    color: 'bg-gray-100 text-gray-800'
  }
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Kevin Hershock',
    email: 'kevin@thenmbr.com',
    role: 'super_admin',
    status: 'active',
    permissions: ['all'],
    lastActive: '2024-01-20T10:30:00Z',
    invitedBy: 'System',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@thenmbr.com',
    role: 'admin',
    status: 'active',
    permissions: ['view', 'edit', 'manage_users', 'manage_organizations'],
    lastActive: '2024-01-20T09:15:00Z',
    invitedBy: 'kevin@thenmbr.com',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@thenmbr.com',
    role: 'moderator',
    status: 'active',
    permissions: ['view', 'moderate_content'],
    lastActive: '2024-01-19T14:20:00Z',
    invitedBy: 'kevin@thenmbr.com',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma@thenmbr.com',
    role: 'viewer',
    status: 'pending',
    permissions: ['view'],
    lastActive: '2024-01-18T16:45:00Z',
    invitedBy: 'sarah@thenmbr.com',
    createdAt: '2024-01-18T00:00:00Z'
  }
]

export default function AdminTeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'viewer' as keyof typeof ROLE_PERMISSIONS,
    name: ''
  })

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || member.role === filterRole
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleInviteMember = async () => {
    if (!inviteData.email || !inviteData.name) return

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteData.name,
      email: inviteData.email,
      role: inviteData.role,
      status: 'pending',
      permissions: ROLE_PERMISSIONS[inviteData.role].permissions,
      lastActive: new Date().toISOString(),
      invitedBy: 'kevin@thenmbr.com', // Current user
      createdAt: new Date().toISOString()
    }

    setTeamMembers(prev => [...prev, newMember])
    setInviteData({ email: '', role: 'viewer', name: '' })
    setShowInviteForm(false)
  }

  const handleUpdateRole = (memberId: string, newRole: keyof typeof ROLE_PERMISSIONS) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { 
            ...member, 
            role: newRole, 
            permissions: ROLE_PERMISSIONS[newRole].permissions 
          }
        : member
    ))
  }

  const handleUpdateStatus = (memberId: string, newStatus: 'active' | 'inactive') => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, status: newStatus }
        : member
    ))
  }

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground">Manage admin team members and permissions</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setShowInviteForm(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">
                {teamMembers.filter(m => m.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.filter(m => m.role === 'super_admin').length}
              </div>
              <p className="text-xs text-muted-foreground">Full access</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.filter(m => m.role === 'admin').length}
              </div>
              <p className="text-xs text-muted-foreground">Management access</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.filter(m => m.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Invite Form Modal */}
        {showInviteForm && (
          <Card>
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
              <CardDescription>Send an invitation to join the admin team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={inviteData.name}
                    onChange={(e) => setInviteData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteData.role} onValueChange={(value: any) => setInviteData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_PERMISSIONS).map(([key, role]) => (
                      <SelectItem key={key} value={key}>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-sm text-muted-foreground">{role.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleInviteMember} disabled={!inviteData.email || !inviteData.name}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
                <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Members Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage team member roles and permissions</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Member</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Active</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-foreground">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={ROLE_PERMISSIONS[member.role].color}>
                          {ROLE_PERMISSIONS[member.role].label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(member.lastActive).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Select 
                            value={member.role} 
                            onValueChange={(value: any) => handleUpdateRole(member.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(ROLE_PERMISSIONS).map(([key, role]) => (
                                <SelectItem key={key} value={key}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleUpdateStatus(member.id, member.status === 'active' ? 'inactive' : 'active')}
                          >
                            {member.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
