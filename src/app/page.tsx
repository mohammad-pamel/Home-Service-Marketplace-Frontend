
"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Search,
  Wrench,
  Star,
} from "lucide-react";

// import Header from "@/components/layout/Header";
import {
  usePublicCategories,
  usePublicServices,
} from "@/hooks/public.hook";
import Header from "@/components/layout/public/Header";
import Footer from "@/components/layout/public/Footer";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number | string;
  durationMinutes: number | null;
  isActive: boolean;
  category?: {
    id: string;
    name: string;
  };
}

interface ApiResponse<T> {
  data: T;
}

interface PaginatedData<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function getResponseData<T>(response: unknown): T | null {
  if (!response || typeof response !== "object") return null;

  const result = response as { data?: unknown };

  if (result.data === undefined) return null;

  return result.data as T;
}

export default function HomePage() {
  const categoriesQuery = usePublicCategories();

  const servicesQuery = usePublicServices({
    page: 1,
    limit: 8,
    status: "active",
  });

  const categories =
    getResponseData<Category[]>(categoriesQuery.data) ?? [];

  const serviceResult =
    getResponseData<PaginatedData<Service>>(servicesQuery.data);

  const services = serviceResult?.data ?? [];

  const activeCategories = categories.filter(
    (category) => category.isActive !== false,
  );

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Hero */}
      <section className="bg-green-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              <CheckCircle2 size={16} />
              Your Trusted Home Service Partner
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
              Professional Home Services,
              <span className="text-green-600">
                {" "}Just a Click Away.
              </span>
            </h1>

            <p className="mt-6 max-w-xl leading-8 text-gray-600">
              Find trusted professionals for your home.
              Explore available services, request assistance,
              and manage your bookings in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3.5 font-semibold text-white transition hover:bg-green-700"
              >
                Explore Services
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/about-us"
                className="rounded-lg border border-green-600 px-6 py-3.5 font-semibold text-green-700 hover:bg-green-100"
              >
                Learn More
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <ShieldCheck className="text-green-600" size={18} />
                Trusted Professionals
              </span>

              <span className="flex items-center gap-2">
                <Clock className="text-green-600" size={18} />
                Easy Booking
              </span>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&q=85"
              alt="Home service professional"
              className="h-[350px] w-full rounded-3xl object-cover shadow-xl md:h-[470px]"
            />
            <div className="absolute -bottom-5 left-5 rounded-xl bg-white p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <Star
                  size={25}
                  className="text-green-600"
                  fill="currentColor"
                />
                <div>
                  <p className="font-bold">Quality Service</p>
                  <p className="text-xs text-gray-500">
                    Professionals you can trust
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Categories */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="text-center">
          <p className="font-semibold text-green-600">OUR CATEGORIES</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            Explore Service Categories
          </h2>
          <p className="mt-3 text-gray-500">
            Find the right service for your home.
          </p>
        </div>

        {categoriesQuery.isLoading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                className="h-36 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        ) : categoriesQuery.isError ? (
          <p className="mt-10 text-center text-red-500">
            Unable to load categories.
          </p>
        ) : activeCategories.length === 0 ? (
          <p className="mt-10 text-center text-gray-500">
            No categories are available right now.
          </p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activeCategories.map((category) => (
              <Link
                key={category.id}
                href={`/services?category=${encodeURIComponent(category.id)}`}
                className="group rounded-2xl border border-gray-100 p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-green-50 text-green-600">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Wrench size={27} />
                  )}
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {category.name}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                  {category.description || "Explore available services."}
                </p>

                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-600">
                  Explore
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Dynamic Services */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-semibold text-green-600">
                FEATURED SERVICES
              </p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                Popular Home Services
              </h2>
              <p className="mt-3 text-gray-500">
                Discover services available on our platform.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-semibold text-green-600 hover:underline"
            >
              View All Services
              <ArrowRight size={17} />
            </Link>
          </div>

          {servicesQuery.isLoading ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  className="h-64 animate-pulse rounded-xl bg-gray-200"
                />
              ))}
            </div>
          ) : servicesQuery.isError ? (
            <p className="mt-10 text-center text-red-500">
              Unable to load services.
            </p>
          ) : services.length === 0 ? (
            <p className="mt-10 text-center text-gray-500">
              No services are available right now.
            </p>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-36 items-center justify-center bg-green-50">
                    <Wrench size={40} className="text-green-600" />
                  </div>

                  <div className="p-5">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      {service.category?.name ?? "Home Service"}
                    </span>

                    <h3 className="mt-4 text-lg font-bold">
                      {service.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm text-gray-500">
                      {service.description || "Professional home service."}
                    </p>

                    <p className="mt-4 text-xs text-gray-500">
                      Starting from
                    </p>

                    <p className="text-xl font-bold text-green-700">
                      ৳{Number(service.basePrice).toLocaleString("en-BD")}
                    </p>

                    <Link
                      href={`/services/${service.id}`}
                      className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      View Details
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="font-semibold text-green-600">WHY CHOOSE US</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Making Home Services Easier and More Reliable
            </h2>
            <p className="mt-5 leading-7 text-gray-600">
              Connect with service professionals and manage your
              home service requests through one convenient platform.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Verified service professionals",
                "Transparent service pricing",
                "Easy online booking",
                "Convenient payment process",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-green-600"
                  />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1000&q=85"
            alt="Comfortable home interior"
            className="h-[360px] w-full rounded-3xl object-cover shadow-lg"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-green-50 py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="text-center">
            <p className="font-semibold text-green-600">SIMPLE PROCESS</p>
            <h2 className="mt-2 text-3xl font-bold">
              How It Works
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Choose a Service",
                description: "Explore services and select what you need.",
              },
              {
                number: "02",
                title: "Submit a Request",
                description: "Send your service request to our platform.",
              },
              {
                number: "03",
                title: "Get the Job Done",
                description: "Connect with a provider and track your booking.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-2xl bg-white p-8 text-center shadow-sm"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-2xl font-bold text-green-700">
                  {step.number}
                </div>
                <h3 className="mt-6 text-xl font-bold">
                  {step.title}
                </h3>
                <p className="mt-3 leading-7 text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-green-600 px-6 py-14 text-center text-white md:px-16">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to Take Care of Your Home?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-green-50">
            Explore our available services and find the right
            professional for your needs.
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 font-bold text-green-700 hover:bg-green-50"
          >
            Browse Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer></Footer>
    </main>
  );
}
