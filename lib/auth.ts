import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  plan: 'Kickstart' | 'Scale Up' | 'Mastery'
  xp_points: number
  level: number
  daily_goal_minutes: number
  onboarding_completed: boolean
  welcome_questions_completed: boolean
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User | null
  error: string | null
}

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, fullName?: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        return { user: null, error: error.message }
      }

      if (data.user) {
        // Get the user profile after signup
        const profile = await this.getUserProfile(data.user.id)
        return { user: profile.user, error: null }
      }

      return { user: null, error: 'Signup failed' }
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' }
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { user: null, error: error.message }
      }

      if (data.user) {
        // Get the user profile
        const profile = await this.getUserProfile(data.user.id)
        return { user: profile.user, error: null }
      }

      return { user: null, error: 'Sign in failed' }
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' }
    }
  },

  // Sign out
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      return { error: error?.message || null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  },

  // Get current user
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        return { user: null, error: error.message }
      }

      if (!user) {
        return { user: null, error: null }
      }

      // Get the user profile
      const profile = await this.getUserProfile(user.id)
      return { user: profile.user, error: null }
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' }
    }
  },

  // Get user profile from profiles table
  async getUserProfile(userId: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        return { user: null, error: error.message }
      }

      return { user: data as User, error: null }
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' }
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return { user: null, error: error.message }
      }

      return { user: data as User, error: null }
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' }
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error: error?.message || null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  },

  // Update password
  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      return { error: error?.message || null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.getUserProfile(session.user.id)
        callback(profile.user)
      } else {
        callback(null)
      }
    })
  },
}
