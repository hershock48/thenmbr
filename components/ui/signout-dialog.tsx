import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, LogOut } from "lucide-react"

interface SignOutDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  isSigningOut: boolean
}

export function SignOutDialog({ open, onConfirm, onCancel, isSigningOut }: SignOutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="w-5 h-5 text-red-600" />
            Sign Out
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out? You have unsaved changes that will be lost.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Unsaved Changes Detected</p>
            <p>You have unsaved changes in your current session. These changes will be lost if you sign out now.</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isSigningOut}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing Out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out Anyway
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
