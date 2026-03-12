import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { notFound } from 'next/navigation'
import { LoginClient } from './client'

interface LoginPageProps {
  params: Promise<{ locale: string }>
}

export default async function LoginPage({ params }: LoginPageProps) {
  const resolvedParams = await params
  const locale = resolveLocale(resolvedParams.locale)

  if (locale !== resolvedParams.locale) {
    notFound()
  }

  const messages = getMessages(locale)

  // Extract auth labels with fallbacks
  const authLabels = messages.auth ?? {}
  const labels = {
    title: authLabels.login_title ?? 'Sign In',
    subtitle: authLabels.login_subtitle ?? 'Sign in to save and manage your visualizations',
    signInWithGitHub: authLabels.sign_in_with_github ?? 'Sign in with GitHub',
    signInWithGoogle: authLabels.sign_in_with_google ?? 'Sign in with Google',
    signInWithEmail: authLabels.sign_in_with_email ?? 'Sign in with Email',
    email: authLabels.email ?? 'Email',
    password: authLabels.password ?? 'Password',
    signIn: authLabels.sign_in ?? 'Sign In',
    or: authLabels.or ?? 'or',
    noAccount: authLabels.no_account ?? "Don't have an account?",
    register: authLabels.register ?? 'Register',
  }

  return <LoginClient labels={labels} locale={locale} />
}
