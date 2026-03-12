import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { notFound } from 'next/navigation'
import { ProfileClient } from './client'

interface ProfilePageProps {
  params: Promise<{ locale: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params
  const locale = resolveLocale(resolvedParams.locale)

  if (locale !== resolvedParams.locale) {
    notFound()
  }

  const messages = getMessages(locale)

  // Extract profile labels with fallbacks
  const profileLabels = messages.profile ?? {}
  const labels = {
    title: profileLabels.title ?? 'My Profile',
    subtitle: profileLabels.subtitle ?? 'Manage your saved visualizations',
    myCharts: profileLabels.my_charts ?? 'All Charts',
    drafts: profileLabels.drafts ?? 'Drafts',
    published: profileLabels.published ?? 'Published',
    noCharts: profileLabels.no_charts ?? "You haven't created any charts yet",
    createFirst: profileLabels.create_first ?? 'Create your first chart',
    views: profileLabels.views ?? 'views',
    edit: profileLabels.edit ?? 'Edit',
    delete: profileLabels.delete ?? 'Delete',
    deleteConfirm: profileLabels.delete_confirm ?? 'Are you sure you want to delete this chart?',
    view: profileLabels.view ?? 'View',
    draft: profileLabels.draft ?? 'Draft',
    published_label: profileLabels.published_label ?? 'Published',
  }

  return <ProfileClient locale={locale} labels={labels} />
}
