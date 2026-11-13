
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  Clock,
  HeartHandshake,
  Target,
  Eye,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Trusted Professionals",
    description:
      "Find skilled service providers and make informed decisions with confidence.",
  },
  {
    icon: Clock,
    title: "Save Your Time",
    description:
      "Discover and request home services without spending hours searching.",
  },
  {
    icon: Users,
    title: "Easy Booking",
    description:
      "Manage service requests, bookings and communication from one platform.",
  },
  {
    icon: HeartHandshake,
    title: "Customer First",
    description:
      "We aim to make every step of your home service experience simple and convenient.",
  },
];

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-8 lg:py-28">
          <div>
            <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              About Home Service Marketplace
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl">
              Making Your Home
              <span className="text-green-600"> Service Experience </span>
              Easier
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-600">
              We connect customers with skilled home service professionals
              through one convenient platform. From finding the right provider
              to managing your bookings, we make home services easier to access.
            </p>

            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Explore Services
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="relative">
            <div className="rounded-3xl bg-green-100 p-4 md:p-6">
              <img
                src="/registration.jpg"
                alt="Home service professionals"
                className="h-[320px] w-full rounded-2xl object-cover md:h-[420px]"
              />
            </div>
            <div className="absolute -bottom-5 -left-2 rounded-xl bg-white p-5 shadow-lg md:-left-5">
              <p className="text-sm font-medium text-gray-500">
                Our commitment
              </p>
              <p className="mt-1 text-lg font-bold text-green-700">
                Quality & Trust
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-wider text-green-600">
            Who We Are
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            One Platform for Your Home Service Needs
          </h2>
          <p className="mt-6 leading-8 text-gray-600">
            Home Service Marketplace is designed to simplify the way people
            discover and manage home services. We bring customers and service
            providers together, helping both sides connect through a convenient
            and organized digital experience.
          </p>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-2 md:px-8">
          <div className="rounded-2xl border border-green-100 bg-white p-8 shadow-sm">
            <div className="flex size-14 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <Target size={28} />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-900">
              Our Mission
            </h3>
            <p className="mt-4 leading-8 text-gray-600">
              To make home services accessible, convenient and transparent by
              connecting customers with suitable service professionals through
              a reliable digital platform.
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-8 shadow-sm">
            <div className="flex size-14 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <Eye size={28} />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-900">
              Our Vision
            </h3>
            <p className="mt-4 leading-8 text-gray-600">
              To build a trusted marketplace where customers can confidently
              find home services and professionals can grow their service
              businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="text-center">
          <p className="font-semibold uppercase tracking-wider text-green-600">
            Why Choose Us
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            A Better Way to Manage Home Services
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex size-14 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Icon size={27} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-green-700 px-6 py-14 text-center text-white md:px-12">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to Make Home Services Easier?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-green-50">
            Explore available services and find the right professional for
            your needs.
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
