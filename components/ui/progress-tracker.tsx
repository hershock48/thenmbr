"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star, Target, Users } from 'lucide-react'

interface UserProgress {
  totalPoints: number
  level: number
  achievements: Array<{
    id: string
    name: string
    unlocked: boolean
    points: number
  }>
  pointsToNextLevel: number
  points: number
}

export function ProgressTracker() {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = () => {
    const saved = localStorage.getItem('userProgress')
    if (saved) {
      setProgress(JSON.parse(saved))
    }
  }

  if (!progress) return null

  const getLevelIcon = (level: number) => {
    if (level >= 5) return <Trophy className="w-6 h-6 text-purple-600" />
    if (level >= 3) return <Star className="w-6 h-6 text-blue-600" />
    if (level >= 2) return <Target className="w-6 h-6 text-green-600" />
    return <Users className="w-6 h-6 text-gray-600" />
  }

  const getLevelTitle = (level: number) => {
    if (level >= 5) return 'Impact Master'
    if (level >= 3) return 'Story Champion'
    if (level >= 2) return 'Community Builder'
    return 'Getting Started'
  }

  const unlockedAchievements = progress.achievements.filter(a => a.unlocked)
  const recentAchievements = unlockedAchievements.slice(-3) // Show last 3 achievements

  return (
    <Card className="bg-gradient-to-r from-cyan-50 via-purple-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left side - Progress info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {getLevelIcon(progress.level)}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  Your Progress
                  <Badge variant="secondary" className="text-xs">
                    Level {progress.level}
                  </Badge>
                </h3>
                <p className="text-sm text-muted-foreground">{getLevelTitle(progress.level)}</p>
              </div>
            </div>
          </div>

          {/* Right side - Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{progress.points}</div>
              <div className="text-xs text-muted-foreground">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{unlockedAchievements.length}</div>
              <div className="text-xs text-muted-foreground">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{progress.pointsToNextLevel}</div>
              <div className="text-xs text-muted-foreground">To Next Level</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Level Progress</span>
            <span className="text-muted-foreground">
              {progress.points}/{progress.pointsToNextLevel + progress.points} points
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min((progress.points / (progress.pointsToNextLevel + progress.points)) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Recent achievements */}
        {recentAchievements.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Recent Achievements</span>
              <span className="text-xs text-muted-foreground">{unlockedAchievements.length} total</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white/60 rounded-lg px-3 py-2 text-xs">
                  <span className="text-yellow-500">🏆</span>
                  <span className="font-medium">{achievement.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}