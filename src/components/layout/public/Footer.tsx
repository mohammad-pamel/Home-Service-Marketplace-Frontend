import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 md:flex-row md:items-center md:px-8">
          <div>
            <h3 className="text-xl font-bold text-green-700">
              Home Service Marketplace
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Making home services simple and reliable.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <Link href="/services" className="hover:text-green-600">Services</Link>
            {/* <Link href="/about-us" className="hover:text-green-600">About Us</Link> */}
            <Link href="/login" className="hover:text-green-600">Login</Link>
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Home Service Marketplace.
          </p>
        </div>
      </footer>
  )
}
