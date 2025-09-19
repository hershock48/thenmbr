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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import {
  Zap,
  Play,
  Pause,
  Settings,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  ArrowDown,
  Circle,
  Square,
  Diamond,
  Triangle,
  Hexagon,
  Star,
  Heart,
  Users,
  Mail,
  MessageSquare,
  Bell,
  Calendar,
  Target,
  DollarSign,
  BarChart3,
  TrendingUp,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  QrCode,
  Camera,
  Share2,
  Download,
  Upload,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  Filter,
  Search,
  Sort,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  X,
  PlusCircle,
  MinusCircle,
  Move,
  GripVertical,
  Workflow,
  GitBranch,
  GitCommit,
  GitMerge,
  Layers,
  Network,
  Cpu,
  Database,
  Server,
  Cloud,
  Lock,
  Unlock,
  Shield,
  Key,
  Fingerprint,
  Wifi,
  WifiOff,
  Signal,
  Battery,
  BatteryLow,
  Power,
  PowerOff
} from "lucide-react"
import { useOrganization } from "@/contexts/OrganizationContext"

interface AutomationWorkflow {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'draft' | 'error'
  category: 'donor-engagement' | 'fundraising' | 'analytics' | 'communication' | 'maintenance'
  trigger: {
    type: 'donation' | 'story-view' | 'email-open' | 'time-based' | 'manual' | 'webhook'
    condition: string
    value: any
  }
  actions: Array<{
    id: string
    type: 'send-email' | 'create-task' | 'update-field' | 'send-notification' | 'webhook-call' | 'wait'
    config: any
    delay?: number
  }>
  conditions: Array<{
    id: string
    field: string
    operator: 'equals' | 'contains' | 'greater-than' | 'less-than' | 'is-empty' | 'is-not-empty'
    value: any
  }>
  stats: {
    executions: number
    successRate: number
    lastRun: string
    nextRun?: string
  }
  createdAt: string
  updatedAt: string
}

interface AutomationTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: any
  complexity: 'simple' | 'intermediate' | 'advanced'
  estimatedTime: string
  features: string[]
  steps: string[]
}

export default function AutomationPage() {
  const { terminology } = useOrganization()
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<AutomationTemplate | null>(null)

  const workflows: AutomationWorkflow[] = [
    {
      id: '1',
      name: 'Welcome New Donors',
      description: 'Send welcome email and add to donor list when someone makes their first donation',
      status: 'active',
      category: 'donor-engagement',
      trigger: {
        type: 'donation',
        condition: 'first-time',
        value: true
      },
      actions: [
        {
          id: '1',
          type: 'send-email',
          config: {
            template: 'welcome-donor',
            subject: 'Welcome to our cause!',
            delay: 0
          }
        },
        {
          id: '2',
          type: 'update-field',
          config: {
            field: 'donor_status',
            value: 'active'
          }
        },
        {
          id: '3',
          type: 'create-task',
          config: {
            title: 'Follow up with new donor',
            assignee: 'team',
            dueDate: '+3 days'
          },
          delay: 86400 // 24 hours
        }
      ],
      conditions: [
        {
          id: '1',
          field: 'donation_amount',
          operator: 'greater-than',
          value: 0
        }
      ],
      stats: {
        executions: 156,
        successRate: 98.7,
        lastRun: '2024-03-15T10:30:00Z',
        nextRun: '2024-03-16T10:30:00Z'
      },
      createdAt: '2024-01-15',
      updatedAt: '2024-03-10'
    },
    {
      id: '2',
      name: 'Story Milestone Celebration',
      description: 'Send celebration email and social media post when story reaches 50% of goal',
      status: 'active',
      category: 'fundraising',
      trigger: {
        type: 'story-view',
        condition: 'milestone-reached',
        value: 50
      },
      actions: [
        {
          id: '1',
          type: 'send-email',
          config: {
            template: 'milestone-celebration',
            subject: 'We\'re halfway there!',
            delay: 0
          }
        },
        {
          id: '2',
          type: 'webhook-call',
          config: {
            url: 'https://api.social.com/post',
            method: 'POST',
            data: {
              message: 'Amazing progress on our story!',
              hashtags: ['#fundraising', '#impact']
            }
          }
        }
      ],
      conditions: [
        {
          id: '1',
          field: 'story_progress',
          operator: 'equals',
          value: 50
        }
      ],
      stats: {
        executions: 23,
        successRate: 95.7,
        lastRun: '2024-03-14T15:45:00Z',
        nextRun: '2024-03-17T15:45:00Z'
      },
      createdAt: '2024-02-01',
      updatedAt: '2024-03-05'
    },
    {
      id: '3',
      name: 'Weekly Analytics Report',
      description: 'Generate and send weekly analytics report to team every Monday',
      status: 'active',
      category: 'analytics',
      trigger: {
        type: 'time-based',
        condition: 'weekly',
        value: 'monday'
      },
      actions: [
        {
          id: '1',
          type: 'create-task',
          config: {
            title: 'Generate weekly report',
            assignee: 'system',
            dueDate: 'immediate'
          }
        },
        {
          id: '2',
          type: 'send-email',
          config: {
            template: 'weekly-report',
            subject: 'Weekly Analytics Report',
            recipients: 'team'
          }
        }
      ],
      conditions: [],
      stats: {
        executions: 12,
        successRate: 100,
        lastRun: '2024-03-11T09:00:00Z',
        nextRun: '2024-03-18T09:00:00Z'
      },
      createdAt: '2024-01-20',
      updatedAt: '2024-03-01'
    }
  ]

  const templates: AutomationTemplate[] = [
    {
      id: '1',
      name: 'Donor Onboarding',
      description: 'Complete donor onboarding sequence with welcome email, follow-up, and engagement tracking',
      category: 'donor-engagement',
      icon: Users,
      complexity: 'simple',
      estimatedTime: '5 minutes',
      features: [
        'Welcome email sequence',
        'Donor profile setup',
        'Engagement tracking',
        'Follow-up reminders'
      ],
      steps: [
        'Trigger: New donation received',
        'Send welcome email immediately',
        'Add to donor list',
        'Schedule follow-up in 3 days',
        'Track engagement metrics'
      ]
    },
    {
      id: '2',
      name: 'Fundraising Campaign',
      description: 'Automated fundraising campaign with milestone celebrations and donor updates',
      category: 'fundraising',
      icon: Target,
      complexity: 'intermediate',
      estimatedTime: '15 minutes',
      features: [
        'Milestone celebrations',
        'Progress updates',
        'Social media integration',
        'Donor segmentation'
      ],
      steps: [
        'Trigger: Story progress milestones',
        'Send celebration emails',
        'Post to social media',
        'Update donor segments',
        'Schedule next milestone check'
      ]
    },
    {
      id: '3',
      name: 'Advanced Analytics',
      description: 'Comprehensive analytics automation with reporting and insights',
      category: 'analytics',
      icon: BarChart3,
      complexity: 'advanced',
      estimatedTime: '30 minutes',
      features: [
        'Automated reporting',
        'Data visualization',
        'Insight generation',
        'Team notifications'
      ],
      steps: [
        'Trigger: Daily at 9 AM',
        'Collect analytics data',
        'Generate insights',
        'Create visualizations',
        'Send to team',
        'Archive reports'
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'donor-engagement': return <Users className="w-4 h-4" />
      case 'fundraising': return <Target className="w-4 h-4" />
      case 'analytics': return <BarChart3 className="w-4 h-4" />
      case 'communication': return <Mail className="w-4 h-4" />
      case 'maintenance': return <Settings className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'donation': return <DollarSign className="w-4 h-4" />
      case 'story-view': return <Eye className="w-4 h-4" />
      case 'email-open': return <Mail className="w-4 h-4" />
      case 'time-based': return <Clock className="w-4 h-4" />
      case 'manual': return <Play className="w-4 h-4" />
      case 'webhook': return <Webhook className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'send-email': return <Mail className="w-4 h-4" />
      case 'create-task': return <CheckCircle className="w-4 h-4" />
      case 'update-field': return <Edit className="w-4 h-4" />
      case 'send-notification': return <Bell className="w-4 h-4" />
      case 'webhook-call': return <Webhook className="w-4 h-4" />
      case 'wait': return <Clock className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automation Workflows</h1>
          <p className="text-muted-foreground">
            Automate your {terminology.fundraising.toLowerCase()} processes and save time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowTemplates(true)}>
            <Workflow className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button onClick={() => setShowCreateWorkflow(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{workflows.length}</div>
                <div className="text-sm text-muted-foreground">Active Workflows</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-sm text-muted-foreground">Total Executions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">98.2%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">24h</div>
                <div className="text-sm text-muted-foreground">Time Saved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-6">
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      {getCategoryIcon(workflow.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{workflow.name}</h3>
                        <Badge className={getStatusColor(workflow.status)}>
                          {workflow.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getCategoryIcon(workflow.category)}
                          <span className="ml-1 capitalize">{workflow.category.replace('-', ' ')}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{workflow.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Executions:</span>
                          <span className="font-semibold ml-1">{workflow.stats.executions}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Success Rate:</span>
                          <span className="font-semibold ml-1">{workflow.stats.successRate}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Run:</span>
                          <span className="font-semibold ml-1">
                            {new Date(workflow.stats.lastRun).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Actions:</span>
                          <span className="font-semibold ml-1">{workflow.actions.length}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setSelectedWorkflow(workflow)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <template.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getComplexityColor(template.complexity)}>
                        {template.complexity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.estimatedTime}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Features:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {template.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                        {template.features.length > 3 && (
                          <li className="text-xs text-muted-foreground">
                            +{template.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Execution Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Execution Logs</CardTitle>
              <CardDescription>Recent workflow executions and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { workflow: 'Welcome New Donors', status: 'success', time: '2 minutes ago', duration: '1.2s' },
                  { workflow: 'Story Milestone Celebration', status: 'success', time: '15 minutes ago', duration: '0.8s' },
                  { workflow: 'Weekly Analytics Report', status: 'success', time: '1 hour ago', duration: '3.4s' },
                  { workflow: 'Donor Follow-up', status: 'error', time: '2 hours ago', duration: '0.0s' },
                  { workflow: 'Social Media Post', status: 'success', time: '3 hours ago', duration: '2.1s' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      {log.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{log.workflow}</span>
                        <Badge className={log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {log.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {log.time} • Duration: {log.duration}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure automation preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Automation</Label>
                    <p className="text-sm text-muted-foreground">Allow workflows to run automatically</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified when workflows fail</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable detailed logging for troubleshooting</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rate Limits</CardTitle>
                <CardDescription>Configure execution limits and throttling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Max Executions per Hour</Label>
                  <Input type="number" defaultValue="100" />
                </div>
                <div>
                  <Label>Max Executions per Day</Label>
                  <Input type="number" defaultValue="1000" />
                </div>
                <div>
                  <Label>Retry Attempts</Label>
                  <Input type="number" defaultValue="3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Workflow Detail Dialog */}
      <Dialog open={!!selectedWorkflow} onOpenChange={() => setSelectedWorkflow(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedWorkflow && getCategoryIcon(selectedWorkflow.category)}
              {selectedWorkflow?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedWorkflow?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedWorkflow && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(selectedWorkflow.status)}>
                  {selectedWorkflow.status}
                </Badge>
                <Badge variant="outline">
                  {selectedWorkflow.actions.length} actions
                </Badge>
                <Badge variant="outline">
                  {selectedWorkflow.stats.executions} executions
                </Badge>
              </div>

              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="trigger">Trigger</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                  <TabsTrigger value="conditions">Conditions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Statistics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Executions:</span>
                          <span className="font-semibold">{selectedWorkflow.stats.executions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Success Rate:</span>
                          <span className="font-semibold">{selectedWorkflow.stats.successRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Run:</span>
                          <span className="font-semibold">
                            {new Date(selectedWorkflow.stats.lastRun).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Timeline</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span className="font-semibold">{selectedWorkflow.createdAt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Updated:</span>
                          <span className="font-semibold">{selectedWorkflow.updatedAt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Run:</span>
                          <span className="font-semibold">
                            {selectedWorkflow.stats.nextRun ? 
                              new Date(selectedWorkflow.stats.nextRun).toLocaleString() : 
                              'Not scheduled'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="trigger" className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      {getTriggerIcon(selectedWorkflow.trigger.type)}
                      <h4 className="font-semibold">Trigger: {selectedWorkflow.trigger.type}</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Condition:</span>
                        <span className="font-semibold">{selectedWorkflow.trigger.condition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Value:</span>
                        <span className="font-semibold">{JSON.stringify(selectedWorkflow.trigger.value)}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                  <div className="space-y-3">
                    {selectedWorkflow.actions.map((action, index) => (
                      <div key={action.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getActionIcon(action.type)}
                            <span className="font-semibold">{action.type.replace('-', ' ')}</span>
                            {action.delay && (
                              <Badge variant="outline" className="text-xs">
                                +{action.delay}s delay
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {JSON.stringify(action.config, null, 2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="conditions" className="space-y-4">
                  <div className="space-y-3">
                    {selectedWorkflow.conditions.map((condition, index) => (
                      <div key={condition.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{condition.field}</span>
                            <Badge variant="outline">{condition.operator}</Badge>
                            <span className="font-semibold">{JSON.stringify(condition.value)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Template Detail Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTemplate && <selectedTemplate.icon className="w-5 h-5" />}
              {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Badge className={getComplexityColor(selectedTemplate.complexity)}>
                  {selectedTemplate.complexity}
                </Badge>
                <Badge variant="outline">
                  {selectedTemplate.estimatedTime}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Features</h4>
                <ul className="space-y-2">
                  {selectedTemplate.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Setup Steps</h4>
                <ol className="space-y-2">
                  {selectedTemplate.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Use This Template
                </Button>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
