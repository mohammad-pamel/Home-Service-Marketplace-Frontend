
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";

// import Header from "@/components/layout/Header";
import { usePublicServiceDetails } from "@/hooks/public.hook";

interface Provider {
  userId: string;
  bio?: string | null;
  experienceYears: number;
  isVerified: boolean;
  rating?: number | null;
  totalReviews: number;
  totalJobs: number;
  serviceArea?: string | null;
}

interface ServiceProvider {
  provider: Provider;
}

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  basePrice: number | string;
  durationMinutes: number;
  isActive: boolean;
  category: Category;
  providers?: ServiceProvider[];
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const serviceId = params.id as string;

  const { data, isLoading, isError } =
    usePublicServiceDetails(serviceId);

  // API response: { data: service }
  const service = data?.data as Service | undefined;

  const providers = service?.providers ?? [];

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes
      ? `${hours} hr ${remainingMinutes} min`
      : `${hours} hour${hours > 1 ? "s" : ""}`;
  };

  if (isLoading) {
    return (
      <>
        {/* <Header /> */}
        <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-gray-200" />
            <div className="h-64 rounded-2xl bg-gray-200" />
            <div className="h-8 w-2/3 rounded bg-gray-200" />
            <div className="h-5 w-full rounded bg-gray-200" />
            <div className="h-5 w-3/4 rounded bg-gray-200" />
          </div>
        </main>
      </>
    );
  }

  if (isError || !service) {
    return (
      <>
        {/* <Header /> */}
        <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <Wrench className="mb-4 h-14 w-14 text-gray-300" />

          <h1 className="text-2xl font-bold text-gray-900">
            Service Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            This service may have been removed or is unavailable.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            <ArrowLeft size={18} />
            Browse Services
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      {/* <Header /> */}

      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <section className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-green-600">
                Home
              </Link>

              <span>/</span>

              <Link href="/services" className="hover:text-green-600">
                Services
              </Link>

              <span>/</span>

              <span className="font-medium text-green-700">
                {service.name}
              </span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-green-600"
          >
            <ArrowLeft size={18} />
            Back to Services
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Details */}
            <div className="space-y-8 lg:col-span-2">
              {/* Service Header */}
              <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
                  <Wrench className="h-8 w-8 text-green-600" />
                </div>

                <span className="inline-block rounded-full bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700">
                  {service.category?.name ?? "General Service"}
                </span>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {service.name}
                </h1>

                <p className="mt-4 leading-7 text-gray-600">
                  {service.description ||
                    "Professional home service provided by experienced service providers."}
                </p>

                <div className="mt-7 grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-green-50 p-3">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Estimated Duration
                      </p>
                      <p className="font-semibold text-gray-900">
                        {formatDuration(service.durationMinutes)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-green-50 p-3">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Service Availability
                      </p>
                      <p className="font-semibold text-green-700">
                        {service.isActive ? "Available" : "Unavailable"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* About Service */}
              <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-gray-900">
                  About This Service
                </h2>

                <p className="mt-4 leading-8 text-gray-600">
                  {service.description ||
                    `${service.name} is one of our home services. You can request this service through our marketplace and get connected with an available service provider.`}
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    "Professional service providers",
                    "Convenient service request process",
                    "Transparent starting price",
                    "Customer support",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                      <span className="text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Providers */}
              <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Service Providers
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Professionals associated with this service
                    </p>
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                    {providers.length} Provider
                    {providers.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {providers.length > 0 ? (
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {providers.map(({ provider }) => (
                      <div
                        key={provider.userId}
                        className="rounded-xl border border-gray-100 p-5 transition hover:border-green-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700">
                            P
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900">
                              Service Provider
                            </h3>

                            {provider.isVerified && (
                              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                                <ShieldCheck size={13} />
                                Verified Provider
                              </span>
                            )}
                          </div>
                        </div>

                        {provider.bio && (
                          <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                            {provider.bio}
                          </p>
                        )}

                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                          <p>
                            <strong>Experience:</strong>{" "}
                            {provider.experienceYears} years
                          </p>

                          <p className="flex items-center gap-1">
                            <Star
                              size={15}
                              className="fill-yellow-400 text-yellow-400"
                            />
                            <strong>
                              {Number(provider.rating ?? 0).toFixed(1)}
                            </strong>
                            <span>
                              ({provider.totalReviews} reviews)
                            </span>
                          </p>

                          <p>
                            <strong>Completed Jobs:</strong>{" "}
                            {provider.totalJobs}
                          </p>

                          {provider.serviceArea && (
                            <p className="flex items-center gap-1">
                              <MapPin size={15} />
                              {provider.serviceArea}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-xl bg-gray-50 px-5 py-8 text-center">
                    <Wrench className="mx-auto h-9 w-9 text-gray-300" />

                    <p className="mt-3 font-medium text-gray-700">
                      No providers are listed yet
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      You can still submit a service request.
                    </p>
                  </div>
                )}
              </section>
            </div>

            {/* Price & Request Card */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  Starting Price
                </p>

                <p className="mt-2 text-3xl font-bold text-green-700">
                  ৳{Number(service.basePrice).toLocaleString("en-BD")}
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Final cost may vary depending on your service requirements.
                </p>

                <div className="my-6 border-t" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-500">Category</span>
                    <span className="text-right text-sm font-semibold text-gray-900">
                      {service.category?.name ?? "General"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-500">Duration</span>
                    <span className="text-right text-sm font-semibold text-gray-900">
                      {formatDuration(service.durationMinutes)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-500">Providers</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {providers.length}
                    </span>
                  </div>
                </div>

                {service.isActive ? (
                  <Link
                    // href={`/customer/service-requests/new?serviceId=${service.id}`}
                    href={`/customer/create-request`}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3.5 font-semibold text-white transition hover:bg-green-700"
                  >
                    Request This Service
                    <ArrowRight size={18} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-7 w-full cursor-not-allowed rounded-lg bg-gray-300 px-5 py-3.5 font-semibold text-gray-600"
                  >
                    Currently Unavailable
                  </button>
                )}

                <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                  You can review your service requirements before confirming
                  your request.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
