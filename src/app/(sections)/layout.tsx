import Header from "@/components/Header"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function Layout ({ children }: {children: React.ReactNode}) {
    return (
        <div className='flex min-h-screen flex-col'>
            <Navbar />
            <Header />
            <main className='mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
                {children}
            </main>
            <Footer />
        </div>
    )
}