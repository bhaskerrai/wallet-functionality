import Image from 'next/image'
import SendETH from '@/components/SendETH';
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SendETH />
      <div>Hello</div>
    </main>
  )
}
