import { notFound } from 'next/navigation'

import { getMessages, resolveLocale } from '@/lib/i18n/messages'

import { DashboardClient } from './client'

export default async function DashboardPage({
  params,
}: {
  params: { locale: string; id: string }
}) {
  const locale = resolveLocale(params.locale)
  if (locale !== params.locale) {
    notFound()
  }

  const messages = getMessages(locale)
  const labels = {
    title: messages.dashboard.title,
    description: messages.common.description,
    untitled: messages.dashboard.untitled,
    editMode: messages.dashboard.editMode,
    viewMode: messages.dashboard.viewMode,
    addChart: messages.dashboard.addChart,
    save: messages.dashboard.save,
    saved: messages.dashboard.save,
    saving: messages.common.loading,
    export: messages.dashboard.export,
    import: messages.dashboard.import,
    sharedFilters: messages.dashboard.sharedFilters,
    maxChartsReached: messages.dashboard.maxChartsReached,
    empty: messages.dashboard.empty,
    addFirstChart: messages.dashboard.addFirstChart,
    loadingChart: messages.dashboard.loadingChart,
    errorLoading: messages.dashboard.errorLoading,
    removeChart: messages.dashboard.removeChart,
    editChart: messages.dashboard.editChart,
    configure: messages.dashboard.configure,
    loading: messages.common.loading,
    noData: messages.dashboard.empty,
    charts: 'charts',
    lastSaved: 'Last saved',
    exportJson: messages.dashboard.export,
    importJson: messages.dashboard.import,
    newDashboard: messages.dashboard.actions.newDashboard,
  }

  return <DashboardClient dashboardId={params.id} locale={locale} labels={labels} />
}
