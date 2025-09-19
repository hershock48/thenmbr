"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Lightbulb, 
  MessageSquare, 
  RefreshCw,
  Copy,
  Check,
  X,
  Wand2,
  Zap,
  Target
} from "lucide-react"

interface AIWritingAssistantProps {
  currentText: string
  onTextChange: (text: string) => void
  context?: 'story' | 'newsletter' | 'general'
  placeholder?: string
  className?: string
}

export function AIWritingAssistant({ 
  currentText, 
  onTextChange, 
  context = 'general',
  placeholder = "Start writing...",
  className = ""
}: AIWritingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('')
  const [improvedText, setImprovedText] = useState('')
  const [isImproving, setIsImproving] = useState(false)
  const [chatMode, setChatMode] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', message: string}>>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const getContextualPrompts = () => {
    switch (context) {
      case 'story':
        return [
          "Make this more emotionally compelling",
          "Add specific details and numbers",
          "Strengthen the call-to-action",
          "Improve the opening hook",
          "Add a personal anecdote"
        ]
      case 'newsletter':
        return [
          "Make this more engaging for subscribers",
          "Add a compelling subject line",
          "Include a clear call-to-action",
          "Make it more conversational",
          "Add urgency or excitement"
        ]
      default:
        return [
          "Improve clarity and flow",
          "Make it more engaging",
          "Add specific details",
          "Strengthen the message",
          "Fix grammar and style"
        ]
    }
  }

  const handleAnalyze = async () => {
    if (!currentText.trim()) return
    
    setIsAnalyzing(true)
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuggestions(getContextualPrompts())
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleImprove = async (suggestion: string) => {
    if (!currentText.trim()) return
    
    setIsImproving(true)
    setSelectedSuggestion(suggestion)
    
    try {
      // Simulate AI improvement
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // This would be real AI improvement
      const improved = `[AI SUGGESTION: ${suggestion}]\n\n${currentText}\n\n[This is how your text could look with this improvement applied]`
      setImprovedText(improved)
    } catch (error) {
      console.error('Improvement failed:', error)
    } finally {
      setIsImproving(false)
    }
  }

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return
    
    const userMessage = chatInput
    setChatInput('')
    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }])
    
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const aiResponse = `Based on your text, here are some suggestions: ${getContextualPrompts()[0]}. Would you like me to help you implement this?`
    setChatHistory(prev => [...prev, { type: 'ai', message: aiResponse }])
  }

  const applyImprovement = () => {
    if (improvedText) {
      onTextChange(improvedText.split('\n\n')[2] || currentText) // Extract the improved version
      setImprovedText('')
      setSelectedSuggestion('')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentText)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Writing Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Your Content</h3>
            <Badge variant="outline" className="text-xs">
              {context === 'story' ? 'Story' : context === 'newsletter' ? 'Newsletter' : 'Text'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              disabled={!currentText.trim()}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              AI Assistant
            </Button>
          </div>
        </div>
        
        <Textarea
          ref={textareaRef}
          value={currentText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={placeholder}
          rows={8}
          className="resize-none"
        />
      </div>

      {/* AI Assistant Panel */}
      {isOpen && (
        <Card className="mt-4 border-2 border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                AI Writing Assistant
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={chatMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChatMode(!chatMode)}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Chat
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <CardDescription>
              {chatMode 
                ? "Chat with AI about your content" 
                : "Get suggestions and improvements for your writing"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {chatMode ? (
              /* Chat Mode */
              <div className="space-y-4">
                <div className="h-48 overflow-y-auto border rounded-lg p-3 bg-muted/50">
                  {chatHistory.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Start a conversation about your content...
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                            msg.type === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-background border'
                          }`}>
                            {msg.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AI about your content..."
                    rows={2}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleChatSubmit()
                      }
                    }}
                  />
                  <Button onClick={handleChatSubmit} disabled={!chatInput.trim()}>
                    <Zap className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              /* Suggestions Mode */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Quick Suggestions</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAnalyze}
                    disabled={!currentText.trim() || isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Lightbulb className="h-3 w-3 mr-1" />
                    )}
                    {isAnalyzing ? 'Analyzing...' : 'Get Suggestions'}
                  </Button>
                </div>

                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                        <span className="text-sm text-muted-foreground flex-1">{suggestion}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleImprove(suggestion)}
                          disabled={isImproving}
                        >
                          {isImproving && selectedSuggestion === suggestion ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            'Improve'
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {improvedText && (
                  <div className="space-y-3 p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-green-800 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        AI Improved Version
                      </h3>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setImprovedText('')}>
                          <X className="h-3 w-3" />
                        </Button>
                        <Button size="sm" onClick={applyImprovement} className="bg-green-600 hover:bg-green-700">
                          <Check className="h-3 w-3 mr-1" />
                          Use This Version
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-green-200 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800">
                        {improvedText}
                      </pre>
                    </div>
                    <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                      💡 Click "Use This Version" to replace your current text with the AI improvement
                    </div>
                  </div>
                )}

                {currentText.trim() && suggestions.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <Wand2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Click "Get Suggestions" to see how AI can help improve your content</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
