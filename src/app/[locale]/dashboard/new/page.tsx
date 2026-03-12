import { notFound } from 'next/navigation'

import { getMessages, resolveLocale } from '@/lib/i18n/messages'

import { NewDashboardClient } from './client'

export default async function NewDashboardPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = resolveLocale(params.locale)
  if (locale !== params.locale) {
    notFound()
  }

  const messages = getMessages(locale)
  const labels = {
    title: messages.dashboard.templates.title,
    selectTemplate: messages.dashboard.templates.selectTemplate,
    skipForNow: messages.dashboard.templates.skipForNow,
    single: messages.dashboard.templates.single,
    singleDesc: messages.dashboard.templates.single_desc,
    sideBySide: messages.dashboard.templates.side_by_side,
    sideBySideDesc: messages.dashboard.templates.side_by_side_desc,
    grid2x2: messages.dashboard.templates.grid_2x2,
    grid2x2Desc: messages.dashboard.templates.grid_2x2_desc,
    heroPlusTwo: messages.dashboard.templates.hero_plus_two,
    heroPlusTwoDesc: messages.dashboard.templates.hero_plus_two_desc,
    empty: messages.dashboard.empty,
    newDashboard: messages.dashboard.actions.newDashboard,
    orStartFromScratch: messages.dashboard.templates.skipForNow,
    blankDashboard: messages.dashboard.actions.newDashboard,
    blankDashboardDesc: messages.dashboard.empty,
  }

  return <NewDashboardClient locale={locale} labels={labels} />
}
