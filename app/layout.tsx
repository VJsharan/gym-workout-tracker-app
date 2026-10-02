import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { displayFont, exerciseSans } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: "Sharan's Gym Buddy - Daily Workout Tracker",
  description: 'Daily Workout Tracker',
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💪</text></svg>",
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fbfbf8',
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${exerciseSans.variable} ${displayFont.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful');
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
