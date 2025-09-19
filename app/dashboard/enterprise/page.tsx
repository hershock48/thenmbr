"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Shield,
  Lock,
  Eye,
  FileText,
  CheckCircle,
  AlertTriangle,
  Settings,
  Users,
  Globe,
  Database,
  Key,
  Clock,
  Download,
  Upload,
  BarChart3,
  Zap,
  Heart,
  Building2,
  Target,
  TrendingUp,
  Activity,
  Server,
  Wifi,
  Smartphone,
  Laptop,
  Monitor
} from "lucide-react"

export default function EnterprisePage() {
  const [complianceStatus, setComplianceStatus] = useState({
    gdpr: { enabled: true, score: 95, lastAudit: '2024-01-15' },
    ccpa: { enabled: true, score: 92, lastAudit: '2024-01-10' },
    hipaa: { enabled: false, score: 0, lastAudit: null },
    soc2: { enabled: true, score: 98, lastAudit: '2024-01-20' },
    pci: { enabled: true, score: 100, lastAudit: '2024-01-25' }
  })

  const [securityFeatures, setSecurityFeatures] = useState({
    sso: true,
    mfa: true,
    encryption: true,
    auditLogs: true,
    dataRetention: true,
    backup: true,
    monitoring: true,
    threatDetection: true
  })

  const [globalSettings, setGlobalSettings] = useState({
    multiLanguage: true,
    multiCurrency: true,
    timezoneSupport: true,
    regionalCompliance: true,
    cdnEnabled: true,
    edgeLocations: 12
  })

  const complianceFrameworks = [
    {
      name: 'GDPR',
      description: 'General Data Protection Regulation (EU)',
      status: complianceStatus.gdpr.enabled ? 'compliant' : 'not-applicable',
      score: complianceStatus.gdpr.score,
      requirements: [
        'Data minimization',
        'Right to be forgotten',
        'Consent management',
        'Data portability',
        'Privacy by design'
      ]
    },
    {
      name: 'CCPA',
      description: 'California Consumer Privacy Act',
      status: complianceStatus.ccpa.enabled ? 'compliant' : 'not-applicable',
      score: complianceStatus.ccpa.score,
      requirements: [
        'Consumer rights disclosure',
        'Opt-out mechanisms',
        'Data collection transparency',
        'Third-party sharing controls'
      ]
    },
    {
      name: 'SOC 2 Type II',
      description: 'Security and availability controls',
      status: complianceStatus.soc2.enabled ? 'compliant' : 'not-applicable',
      score: complianceStatus.soc2.score,
      requirements: [
        'Security controls',
        'Availability monitoring',
        'Processing integrity',
        'Confidentiality protection',
        'Privacy safeguards'
      ]
    },
    {
      name: 'PCI DSS',
      description: 'Payment Card Industry Data Security',
      status: complianceStatus.pci.enabled ? 'compliant' : 'not-applicable',
      score: complianceStatus.pci.score,
      requirements: [
        'Secure network architecture',
        'Cardholder data protection',
        'Vulnerability management',
        'Access control measures',
        'Regular security testing'
      ]
    }
  ]

  const securityMetrics = [
    { label: 'Security Score', value: 98, max: 100, color: 'text-green-600' },
    { label: 'Compliance Score', value: 96, max: 100, color: 'text-blue-600' },
    { label: 'Uptime', value: 99.9, max: 100, color: 'text-purple-600' },
    { label: 'Data Encryption', value: 100, max: 100, color: 'text-green-600' }
  ]

  const globalMetrics = [
    { label: 'Active Regions', value: 12, icon: 'Globe' },
    { label: 'Languages Supported', value: 25, icon: 'FileText' },
    { label: 'Currencies', value: 15, icon: 'TrendingUp' },
    { label: 'Edge Locations', value: 45, icon: 'Server' }
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Enterprise Security & Compliance</h1>
          <p className="text-muted-foreground mt-2">
            Advanced security, compliance, and global scaling for enterprise organizations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Enterprise Ready
          </Badge>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                <Shield className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value}%
                  </span>
                  <span className="text-sm text-muted-foreground">/ {metric.max}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="global">Global Scaling</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Features
                </CardTitle>
                <CardDescription>
                  Configure advanced security measures for your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(securityFeatures).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {feature === 'sso' && <Key className="w-4 h-4 text-primary" />}
                        {feature === 'mfa' && <Shield className="w-4 h-4 text-primary" />}
                        {feature === 'encryption' && <Lock className="w-4 h-4 text-primary" />}
                        {feature === 'auditLogs' && <FileText className="w-4 h-4 text-primary" />}
                        {feature === 'dataRetention' && <Database className="w-4 h-4 text-primary" />}
                        {feature === 'backup' && <Upload className="w-4 h-4 text-primary" />}
                        {feature === 'monitoring' && <Activity className="w-4 h-4 text-primary" />}
                        {feature === 'threatDetection' && <AlertTriangle className="w-4 h-4 text-primary" />}
                      </div>
                      <div>
                        <div className="font-medium capitalize">
                          {feature.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {feature === 'sso' && 'Single Sign-On integration'}
                          {feature === 'mfa' && 'Multi-factor authentication'}
                          {feature === 'encryption' && 'End-to-end encryption'}
                          {feature === 'auditLogs' && 'Comprehensive audit logging'}
                          {feature === 'dataRetention' && 'Automated data retention policies'}
                          {feature === 'backup' && 'Automated backups and recovery'}
                          {feature === 'monitoring' && 'Real-time security monitoring'}
                          {feature === 'threatDetection' && 'AI-powered threat detection'}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => 
                        setSecurityFeatures(prev => ({ ...prev, [feature]: checked }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Access Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Access Control
                </CardTitle>
                <CardDescription>
                  Manage user permissions and access levels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Admin Users</div>
                      <div className="text-sm text-muted-foreground">Full system access</div>
                    </div>
                    <Badge variant="secondary">3 users</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Manager Users</div>
                      <div className="text-sm text-muted-foreground">Limited admin access</div>
                    </div>
                    <Badge variant="secondary">12 users</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Standard Users</div>
                      <div className="text-sm text-muted-foreground">Basic platform access</div>
                    </div>
                    <Badge variant="secondary">156 users</Badge>
                  </div>
                </div>
                <Button className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Security Incidents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Recent Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <div className="font-medium">Successful login from new device</div>
                    <div className="text-sm text-muted-foreground">2 minutes ago • IP: 192.168.1.100</div>
                  </div>
                  <Badge variant="secondary">Low Risk</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <div className="flex-1">
                    <div className="font-medium">Multiple failed login attempts</div>
                    <div className="text-sm text-muted-foreground">1 hour ago • IP: 10.0.0.50</div>
                  </div>
                  <Badge variant="outline" className="text-yellow-600">Medium Risk</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <div className="font-medium">Data backup completed successfully</div>
                    <div className="text-sm text-muted-foreground">3 hours ago • Automated</div>
                  </div>
                  <Badge variant="secondary">Info</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {complianceFrameworks.map((framework, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {framework.status === 'compliant' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        )}
                        {framework.name}
                      </CardTitle>
                      <CardDescription>{framework.description}</CardDescription>
                    </div>
                    <Badge 
                      variant={framework.status === 'compliant' ? 'default' : 'secondary'}
                      className={framework.status === 'compliant' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {framework.status === 'compliant' ? 'Compliant' : 'Not Applicable'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Compliance Score</span>
                      <span className="text-lg font-bold text-primary">{framework.score}%</span>
                    </div>
                    <Progress value={framework.score} className="h-2" />
                    <div>
                      <div className="text-sm font-medium mb-2">Key Requirements:</div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {framework.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      View Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Compliance Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Compliance Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">SOC 2 Type II Audit</div>
                    <div className="text-sm text-muted-foreground">Annual compliance review</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">March 15, 2024</div>
                    <Badge variant="outline" className="text-blue-600">30 days</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">GDPR Data Review</div>
                    <div className="text-sm text-muted-foreground">Quarterly data processing review</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">April 1, 2024</div>
                    <Badge variant="outline" className="text-green-600">45 days</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">PCI DSS Assessment</div>
                    <div className="text-sm text-muted-foreground">Payment security compliance</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">June 30, 2024</div>
                    <Badge variant="outline" className="text-purple-600">120 days</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Global Scaling Tab */}
        <TabsContent value="global" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {globalMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    {metric.icon === 'Globe' && <Globe className="w-5 h-5 text-primary" />}
                    {metric.icon === 'FileText' && <FileText className="w-5 h-5 text-primary" />}
                    {metric.icon === 'TrendingUp' && <TrendingUp className="w-5 h-5 text-primary" />}
                    {metric.icon === 'Server' && <Server className="w-5 h-5 text-primary" />}
                    <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Global Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Global Configuration
                </CardTitle>
                <CardDescription>
                  Configure global scaling and localization features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(globalSettings).map(([setting, enabled]) => (
                  <div key={setting} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {setting === 'multiLanguage' && <FileText className="w-4 h-4 text-primary" />}
                        {setting === 'multiCurrency' && <TrendingUp className="w-4 h-4 text-primary" />}
                        {setting === 'timezoneSupport' && <Clock className="w-4 h-4 text-primary" />}
                        {setting === 'regionalCompliance' && <Shield className="w-4 h-4 text-primary" />}
                        {setting === 'cdnEnabled' && <Server className="w-4 h-4 text-primary" />}
                        {setting === 'edgeLocations' && <Globe className="w-4 h-4 text-primary" />}
                      </div>
                      <div>
                        <div className="font-medium capitalize">
                          {setting.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {setting === 'multiLanguage' && 'Support for 25+ languages'}
                          {setting === 'multiCurrency' && '15+ currencies supported'}
                          {setting === 'timezoneSupport' && 'Automatic timezone detection'}
                          {setting === 'regionalCompliance' && 'Regional compliance rules'}
                          {setting === 'cdnEnabled' && 'Global CDN distribution'}
                          {setting === 'edgeLocations' && `${globalSettings.edgeLocations} edge locations`}
                        </div>
                      </div>
                    </div>
                    {setting === 'edgeLocations' ? (
                      <Badge variant="secondary">{enabled}</Badge>
                    ) : (
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => 
                          setGlobalSettings(prev => ({ ...prev, [setting]: checked }))
                        }
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Regional Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Regional Performance
                </CardTitle>
                <CardDescription>
                  Performance metrics across global regions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { region: 'North America', latency: '45ms', uptime: '99.9%', users: '12,450' },
                    { region: 'Europe', latency: '52ms', uptime: '99.8%', users: '8,920' },
                    { region: 'Asia Pacific', latency: '38ms', uptime: '99.9%', users: '15,230' },
                    { region: 'South America', latency: '67ms', uptime: '99.7%', users: '3,180' }
                  ].map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{region.region}</div>
                        <div className="text-sm text-muted-foreground">
                          {region.latency} latency • {region.uptime} uptime
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{region.users} users</div>
                        <div className="text-xs text-muted-foreground">Active</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  System Health
                </CardTitle>
                <CardDescription>
                  Real-time system performance and health metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { service: 'API Gateway', status: 'healthy', response: '45ms', uptime: '99.9%' },
                    { service: 'Database', status: 'healthy', response: '12ms', uptime: '99.8%' },
                    { service: 'CDN', status: 'healthy', response: '23ms', uptime: '99.9%' },
                    { service: 'Authentication', status: 'healthy', response: '8ms', uptime: '99.9%' },
                    { service: 'File Storage', status: 'healthy', response: '67ms', uptime: '99.7%' }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          service.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <div className="font-medium">{service.service}</div>
                          <div className="text-sm text-muted-foreground">
                            {service.response} response time
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{service.uptime}</div>
                        <div className="text-xs text-muted-foreground">Uptime</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Monitoring
                </CardTitle>
                <CardDescription>
                  Real-time security event monitoring and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-muted-foreground">Active Threats</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">1,247</div>
                      <div className="text-sm text-muted-foreground">Blocked Attempts</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">98.7%</div>
                      <div className="text-sm text-muted-foreground">Detection Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">2.3s</div>
                      <div className="text-sm text-muted-foreground">Response Time</div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Security Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Key performance indicators and system metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm text-muted-foreground">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Storage Usage</span>
                    <span className="text-sm text-muted-foreground">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
