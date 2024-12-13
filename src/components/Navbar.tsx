import {
    ArrowRightStartOnRectangleIcon,
    ShoppingCartIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import NavbarButton from '@/components/Navbarbutton';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import NavbarSignOutButton from './NavbarSignOutbutton';

export default async function Navbar() {
    const session = await getSession();

    return (
        <nav className="fixed top-0 z-50 w-full bg-gray-800 bg-opacity-90 backdrop-blur-lg backdrop-filter">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Left side of the navbar (logo and name) */}
                    <div className="flex flex-1 items-stretch justify-start">
                        <Link
                            href="/"
                            className="flex flex-shrink-0 items-center space-x-4 text-gray-300 hover:text-gray-100"
                        >
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/3313/3313341.png"
                                alt="GameShop logo"
                                className="block h-8 w-auto"
                            />
                            <div className="inline-block w-auto text-xl font-semibold">
                                GameShop
                            </div>
                        </Link>
                    </div>

                    {/* Right side of the navbar (buttons or links based on session) */}
                    <div className="absolute inset-y-0 right-0 flex items-center space-x-4">
                        {session ? (
                            <>
                                <NavbarButton href="/cart">
                                    <span className="sr-only">Cart</span>
                                    <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                                </NavbarButton>

                                <NavbarButton href="/profile">
                                    <span className="sr-only">User profile</span>
                                    <UserIcon className="h-6 w-6" aria-hidden="true" />
                                </NavbarButton>

                                <NavbarSignOutButton>
                                    <span className="sr-only">Sign out</span>
                                    <ArrowRightStartOnRectangleIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </NavbarSignOutButton>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/signup"
                                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                                >
                                    Sign up
                                </Link>
                                <Link
                                    href="/auth/signin"
                                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                                >
                                    Sign in
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}