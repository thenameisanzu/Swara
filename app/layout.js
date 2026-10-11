import './globals.css'
import { Gabarito, Instrument_Sans } from 'next/font/google'
const display = Gabarito({ subsets: ['latin'], variable: '--font-display' })
const body = Instrument_Sans({ subsets: ['latin'], variable: '--font-body' })
export const metadata = { title: 'Swara Music Academy', description: 'Piano, guitar, violin, vocals and drums in Kochi.' }
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#1D4DFF' }
export default function RootLayout({ children }) {
  return (<html lang="en" className={`${display.variable} ${body.variable}`}><body>{children}</body></html>)
}
