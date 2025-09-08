import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export function useSignOut() {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [signOutError, setSignOutError] = useState('')
  const { signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      setSignOutError('')
      
      // Check for unsaved changes
      const hasUnsavedChanges = checkForUnsavedChanges()
      if (hasUnsavedChanges) {
        setShowConfirmDialog(true)
        setIsSigningOut(false)
        return
      }
      
      // Proceed with sign out
      await performSignOut()
    } catch (error) {
      console.error('Sign out error:', error)
      setSignOutError('Failed to sign out. Please try again.')
      setIsSigningOut(false)
    }
  }

  const performSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      throw error
    }
  }

  const confirmSignOut = async () => {
    try {
      setIsSigningOut(true)
      setShowConfirmDialog(false)
      await performSignOut()
    } catch (error) {
      console.error('Sign out error:', error)
      setSignOutError('Failed to sign out. Please try again.')
      setIsSigningOut(false)
    }
  }

  const cancelSignOut = () => {
    setShowConfirmDialog(false)
    setIsSigningOut(false)
  }

  const checkForUnsavedChanges = (): boolean => {
    // Check for form elements with unsaved changes
    const forms = document.querySelectorAll('form')
    for (const form of forms) {
      if (form.querySelector('[data-unsaved="true"]')) {
        return true
      }
    }
    
    // Check for text inputs with changes
    const textInputs = document.querySelectorAll('input[type="text"], textarea')
    for (const input of textInputs) {
      if (input.value && input.value !== input.defaultValue) {
        return true
      }
    }
    
    return false
  }

  return {
    isSigningOut,
    showConfirmDialog,
    signOutError,
    handleSignOut,
    confirmSignOut,
    cancelSignOut,
    setSignOutError
  }
}
