
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

// Replace these with your actual contact information
const CONTACT_EMAIL = "your-email@example.com";
const CONTACT_PHONE = "+8801XXXXXXXXX";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email anytime.",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Talk to our support team.",
    value: CONTACT_PHONE,
    href: `tel:${CONTACT_PHONE}`,
  },
];

const faqs = [
  {
    question: "How can I request a home service?",
    answer:
      "Browse our services, select the service you need and submit a service request from your customer account.",
  },
  {
    question: "How can I become a service provider?",
    answer:
      "Create an account and select the provider role during registration. You can then complete your provider profile.",
  },
  {
    question: "How can I get help with my booking?",
    answer:
      "You can contact our support team through the email or phone information provided on this page.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center md:px-8 md:py-24">
          <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            Contact Us
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            We’re Here to <span className="text-green-600">Help You</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-600">
            Have a question about our services, bookings or your account?
            Get in touch with us. We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact information */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-semibold uppercase tracking-wider text-green-600">
              Get in Touch
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Let’s Talk About Your Needs
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Whether you need help finding a service, managing a booking or
              joining our platform as a provider, our team is ready to assist.
            </p>

            <div className="mt-9 space-y-5">
              {contactMethods.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.title}
                    href={item.href}
                    className="group flex items-center gap-5 rounded-2xl border border-gray-100 p-5 transition hover:border-green-200 hover:bg-green-50"
                  >
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                      <Icon size={25} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.description}
                      </p>
                      <p className="mt-2 break-all font-semibold text-green-700">
                        {item.value}
                      </p>
                    </div>

                    <ArrowRight
                      size={19}
                      className="ml-auto shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-600"
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Support card */}
          <div className="rounded-3xl bg-green-700 p-8 text-white md:p-12">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-white/15">
              <MessageCircle size={32} />
            </div>

            <h2 className="mt-7 text-3xl font-bold">
              How Can We Help You?
            </h2>

            <p className="mt-5 leading-8 text-green-50">
              We want your experience with Home Service Marketplace to be
              simple and convenient. Reach out to us whenever you need
              assistance.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <Clock className="mt-1 shrink-0" size={22} />
                <div>
                  <h3 className="font-semibold">Support Information</h3>
                  <p className="mt-1 text-sm leading-6 text-green-100">
                    Contact us through email or phone for assistance.
                    Response times may vary.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="mt-1 shrink-0" size={22} />
                <div>
                  <h3 className="font-semibold">Our Location</h3>
                  <p className="mt-1 text-sm leading-6 text-green-100">
                    Serving customers through our online marketplace.
                  </p>
                </div>
              </div>
            </div>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-10 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50"
            >
              Send an Email
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-wider text-green-600">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <h3 className="font-bold text-gray-900">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Looking for a Home Service?
        </h2>
        <p className="mt-3 text-gray-600">
          Explore our available services and find the help you need.
        </p>
        <Link
          href="/services"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          Browse Services
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
