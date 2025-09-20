"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { useOrganization } from './OrganizationContext'

export interface Notification {
  id: string
  type: 'donor_signup' | 'donation' | 'story_performance' | 'engagement' | 'trial' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
  metadata?: Record<string, any>
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  loading: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, org } = useAuth()
  const { orgType } = useOrganization()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  // Mock notifications based on organization type
  useEffect(() => {
    if (!user || !org) {
      setNotifications([])
      setLoading(false)
      return
    }

    // Generate mock notifications for nonprofits only
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'donor_signup',
        title: 'New donor signed up',
        message: 'Sarah Johnson just subscribed to your Education Impact story',
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        read: false,
        priority: 'medium',
        actionUrl: '/dashboard/subscribers'
      },
      {
        id: '2',
        type: 'story_performance',
        title: 'Story published',
        message: 'Your "Education Impact" story is now live and has been viewed 15 times',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        read: false,
        priority: 'low',
        actionUrl: '/dashboard/stories'
      },
      {
        id: '3',
        type: 'engagement',
        title: 'Weekly report ready',
        message: 'Your weekly impact analytics show 23% growth in donor engagement',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        read: false,
        priority: 'low',
        actionUrl: '/dashboard/analytics'
      },
      {
        id: '4',
        type: 'trial',
        title: 'Trial reminder',
        message: 'Your free trial ends in 5 days. Upgrade to continue using NMBR',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: false,
        priority: 'high',
        actionUrl: '/dashboard/upgrade'
      }
    ]

    setNotifications(mockNotifications)
    setLoading(false)
  }, [user, org, orgType])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    loading
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
