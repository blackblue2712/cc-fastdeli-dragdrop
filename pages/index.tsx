import { Inter } from 'next/font/google'
import { Controller } from '../src/components/Controller/Controller'
import { PageLayout } from '../src/components/PageLayout/PageLayout'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <PageLayout>
      <div className="h-full p-4">
        <Controller />
      </div>
    </PageLayout>
  )
}
