"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Trophy, 
  Star, 
  Target, 
  Users, 
  Heart, 
  Building2, 
  Sparkles,
  CheckCircle,
  Lock,
  X
} from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: 'onboarding' | 'content' | 'engagement' | 'growth'
  points: number
  unlocked: boolean
  progress: number
  maxProgress: number
  unlockedAt?: Date
}

interface UserProgress {
  totalPoints: number
  level: number
  achievements: Achievement[]
  nextLevelPoints: number
  currentLevelPoints: number
}

const defaultAchievements: Achievement[] = [
  {
    id: 'first-login',
    title: 'Welcome Aboard!',
    description: 'Successfully logged into your account',
    icon: <Star className="w-6 h-6" />,
    category: 'onboarding',
    points: 10,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'tour-completed',
    title: 'Tour Guide',
    description: 'Completed the onboarding tour',
    icon: <Sparkles className="w-6 h-6" />,
    category: 'onboarding',
    points: 25,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'first-story',
    title: 'Storyteller',
    description: 'Created your first impact story',
    icon: <Target className="w-6 h-6" />,
    category: 'content',
    points: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'first-subscriber',
    title: 'Community Builder',
    description: 'Gained your first subscriber',
    icon: <Users className="w-6 h-6" />,
    category: 'engagement',
    points: 30,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'first-donation',
    title: 'Fundraiser',
    description: 'Received your first donation',
    icon: <Heart className="w-6 h-6" />,
    category: 'growth',
    points: 75,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'multi-org',
    title: 'Multi-Org Master',
    description: 'Managing multiple organizations',
    icon: <Building2 className="w-6 h-6" />,
    category: 'growth',
    points: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'brand-customized',
    title: 'Brand Designer',
    description: 'Customized your organization branding',
    icon: <Sparkles className="w-6 h-6" />,
    category: 'onboarding',
    points: 40,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'five-stories',
    title: 'Content Creator',
    description: 'Created 5 impact stories',
    icon: <Target className="w-6 h-6" />,
    category: 'content',
    points: 150,
    unlocked: false,
    progress: 0,
    maxProgress: 5
  }
]

export function AchievementSystem() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [showAchievements, setShowAchievements] = useState(false)
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([])

  useEffect(() => {
    loadUserProgress()
  }, [])

  const loadUserProgress = () => {
    // Load from localStorage or API
    const saved = localStorage.getItem('userProgress')
    if (saved) {
      setUserProgress(JSON.parse(saved))
    } else {
      // Initialize with default progress
      const initialProgress: UserProgress = {
        totalPoints: 0,
        level: 1,
        achievements: defaultAchievements,
        nextLevelPoints: 100,
        currentLevelPoints: 0
      }
      setUserProgress(initialProgress)
      saveUserProgress(initialProgress)
    }
  }

  const saveUserProgress = (progress: UserProgress) => {
    localStorage.setItem('userProgress', JSON.stringify(progress))
  }

  const unlockAchievement = (achievementId: string) => {
    if (!userProgress) return

    const updatedAchievements = userProgress.achievements.map(achievement => {
      if (achievement.id === achievementId && !achievement.unlocked) {
        const unlockedAchievement = {
          ...achievement,
          unlocked: true,
          progress: achievement.maxProgress,
          unlockedAt: new Date()
        }
        setNewlyUnlocked(prev => [...prev, unlockedAchievement])
        return unlockedAchievement
      }
      return achievement
    })

    const totalPoints = updatedAchievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0)

    const level = Math.floor(totalPoints / 100) + 1
    const currentLevelPoints = totalPoints % 100
    const nextLevelPoints = level * 100

    const updatedProgress: UserProgress = {
      ...userProgress,
      totalPoints,
      level,
      achievements: updatedAchievements,
      nextLevelPoints,
      currentLevelPoints
    }

    setUserProgress(updatedProgress)
    saveUserProgress(updatedProgress)
  }

  const updateAchievementProgress = (achievementId: string, progress: number) => {
    if (!userProgress) return

    const updatedAchievements = userProgress.achievements.map(achievement => {
      if (achievement.id === achievementId) {
        const newProgress = Math.min(progress, achievement.maxProgress)
        const shouldUnlock = newProgress >= achievement.maxProgress && !achievement.unlocked
        
        if (shouldUnlock) {
          setTimeout(() => unlockAchievement(achievementId), 500)
        }

        return {
          ...achievement,
          progress: newProgress
        }
      }
      return achievement
    })

    const updatedProgress = {
      ...userProgress,
      achievements: updatedAchievements
    }

    setUserProgress(updatedProgress)
    saveUserProgress(updatedProgress)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'onboarding': return 'bg-blue-100 text-blue-800'
      case 'content': return 'bg-green-100 text-green-800'
      case 'engagement': return 'bg-purple-100 text-purple-800'
      case 'growth': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelColor = (level: number) => {
    if (level >= 5) return 'text-purple-600'
    if (level >= 3) return 'text-blue-600'
    if (level >= 2) return 'text-green-600'
    return 'text-gray-600'
  }

  if (!userProgress) return null

  return (
    <>
      {/* Achievement Button */}
      <Button
        variant="outline"
        onClick={() => setShowAchievements(true)}
        className="relative flex items-center space-x-2"
      >
        <Trophy className="w-4 h-4" />
        <span>Achievements</span>
        {userProgress.achievements.filter(a => a.unlocked).length > 0 && (
          <Badge className="ml-1 bg-green-500 text-white">
            {userProgress.achievements.filter(a => a.unlocked).length}
          </Badge>
        )}
      </Button>

      {/* Achievement Modal */}
      {showAchievements && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-2xl font-bold">Achievements</CardTitle>
                <p className="text-muted-foreground">
                  Level {userProgress.level} • {userProgress.totalPoints} points
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAchievements(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="overflow-y-auto max-h-[70vh]">
              {/* Level Progress */}
              <div className="mb-6 p-4 bg-gradient-to-r from-cyan-50 to-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Level {userProgress.level}</span>
                  <span className="text-sm text-muted-foreground">
                    {userProgress.currentLevelPoints}/{userProgress.nextLevelPoints} points
                  </span>
                </div>
                <Progress 
                  value={(userProgress.currentLevelPoints / userProgress.nextLevelPoints) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {userProgress.nextLevelPoints - userProgress.currentLevelPoints} points to next level
                </p>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProgress.achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          achievement.unlocked ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {achievement.unlocked ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <Lock className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-semibold ${
                              achievement.unlocked ? 'text-green-800' : 'text-gray-600'
                            }`}>
                              {achievement.title}
                            </h3>
                            <Badge className={getCategoryColor(achievement.category)}>
                              {achievement.points} pts
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          {achievement.maxProgress > 1 && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{achievement.progress}/{achievement.maxProgress}</span>
                              </div>
                              <Progress 
                                value={(achievement.progress / achievement.maxProgress) * 100} 
                                className="h-1"
                              />
                            </div>
                          )}
                          {achievement.unlocked && achievement.unlockedAt && (
                            <p className="text-xs text-green-600 mt-1">
                              Unlocked {achievement.unlockedAt.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Achievement Notifications */}
      {newlyUnlocked.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {newlyUnlocked.map((achievement) => (
            <Card
              key={achievement.id}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg animate-pulse"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-6 h-6" />
                  <div>
                    <h4 className="font-semibold">Achievement Unlocked!</h4>
                    <p className="text-sm">{achievement.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

// Hook for updating achievements from other components
export function useAchievements() {
  const updateAchievement = (achievementId: string, progress: number) => {
    const saved = localStorage.getItem('userProgress')
    if (saved) {
      const userProgress = JSON.parse(saved)
      const achievement = userProgress.achievements.find((a: Achievement) => a.id === achievementId)
      
      if (achievement) {
        const newProgress = Math.min(progress, achievement.maxProgress)
        const shouldUnlock = newProgress >= achievement.maxProgress && !achievement.unlocked
        
        if (shouldUnlock) {
          // Unlock achievement
          const updatedAchievements = userProgress.achievements.map((a: Achievement) => 
            a.id === achievementId 
              ? { ...a, unlocked: true, progress: newProgress, unlockedAt: new Date() }
              : a
          )
          
          const totalPoints = updatedAchievements
            .filter((a: Achievement) => a.unlocked)
            .reduce((sum: number, a: Achievement) => sum + a.points, 0)
          
          const level = Math.floor(totalPoints / 100) + 1
          const currentLevelPoints = totalPoints % 100
          const nextLevelPoints = level * 100
          
          const updatedProgress = {
            ...userProgress,
            totalPoints,
            level,
            achievements: updatedAchievements,
            nextLevelPoints,
            currentLevelPoints
          }
          
          localStorage.setItem('userProgress', JSON.stringify(updatedProgress))
        } else {
          // Update progress
          const updatedAchievements = userProgress.achievements.map((a: Achievement) => 
            a.id === achievementId ? { ...a, progress: newProgress } : a
          )
          
          const updatedProgress = {
            ...userProgress,
            achievements: updatedAchievements
          }
          
          localStorage.setItem('userProgress', JSON.stringify(updatedProgress))
        }
      }
    }
  }

  return { updateAchievement }
}
