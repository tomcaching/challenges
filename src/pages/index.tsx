import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Tomcaching challenges server</title>
      </Head>
      <main className="flex flex-col items-center justify-center w-screen h-screen bg-black">
        <h1 className="text-white font-mono font-black text-4xl">Tomcaching challenges server</h1>
        <h2 className="text-4xl mt-8 font-mono font-black text-neutral-800">🍰 = 🤥</h2>
      </main>
    </>
  )
}
