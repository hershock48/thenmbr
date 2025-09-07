import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  org_id: string
  role: 'admin' | 'editor'
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signUp(email: string, password: string, orgName: string) {
  // First create the organization
  const { data: org, error: orgError } = await supabase
    .from('nonprofits')
    .insert({
      name: orgName,
      brand_color: '#3B82F6'
    })
    .select()
    .single()

  if (orgError) throw orgError

  // Then create the user account
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        org_id: org.id,
        role: 'admin'
      }
    }
  })

  if (error) throw error
  return { user: data.user, org }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getCurrentOrg(userId: string) {
  const { data, error } = await supabase
    .from('nonprofits')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}
