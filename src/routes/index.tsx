import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
  head: () => ({
    meta: [
      { title: 'HTTYD Egg Tracker' },
      { name: 'description', content: 'Track How to Train Your Dragon eggs, pins, and spiral timers.' },
    ],
  }),
})

function Index() {
  return (
    <iframe
      src="/tracker.html"
      title="HTTYD Egg Tracker"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
      }}
    />
  )
}
