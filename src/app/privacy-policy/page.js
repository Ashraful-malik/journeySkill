import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  const effectiveDate = "1 March 2025";
  return (
    <>
      <NavBar />
      <div className="bg-gray-100 text-gray-800 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl p-8  rounded-lg">
          <h1 className="text-3xl font-bold  text-gray-900">Privacy Policy</h1>
          <p className="text-sm text-gray-600  mt-2">
            <strong>Effective Date:</strong> {effectiveDate}
          </p>

          <p className="mt-6">
            Welcome to <strong>JourneySkill</strong>! Your privacy is important
            to us. This Privacy Policy explains how we collect, use, and protect
            your information when you use our platform.
          </p>

          <hr className="my-6 border-gray-300" />

          <Section title="1. Information We Collect">
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <strong>Account Information:</strong> Name, email address, and
                other details you provide when signing up.
              </li>
              <li>
                <strong>User-Generated Content:</strong> Challenges you create,
                posts, comments, and other contributions.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact
                with JourneySkill, such as time spent on challenges and
                analytics.
              </li>
              <li>
                <strong>Cookies & Tracking Technologies:</strong> We may use
                cookies and similar technologies to enhance your experience.
              </li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc ml-5 space-y-1">
              <li>Provide and improve the JourneySkill platform.</li>
              <li>Personalize your experience.</li>
              <li>Track challenge progress and analytics.</li>
              <li>
                Communicate with you (e.g., updates, notifications, and support
                responses).
              </li>
              <li>Ensure the security and integrity of our platform.</li>
            </ul>
          </Section>

          <Section title="3. Sharing Your Information">
            <p>
              We do <strong>not</strong> sell or rent your personal data.
              However, we may share information:
            </p>
            <ul className="list-disc ml-5 space-y-1 mt-2">
              <li>
                <strong>With service providers:</strong> Who help us operate our
                platform (e.g., hosting, analytics, customer support).
              </li>
              <li>
                <strong>If required by law:</strong> Legal obligations, fraud
                prevention, or protecting users.
              </li>
              <li>
                <strong>In case of business transfer:</strong> Such as merger,
                acquisition, or sale of assets.
              </li>
            </ul>
          </Section>

          <Section title="4. Data Security">
            <p>
              We implement security measures to protect your data, but no method
              is 100% secure. You are responsible for keeping your account
              credentials safe.
            </p>
          </Section>

          <Section title="5. Your Rights & Choices">
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <strong>Access & Correction:</strong> You can view and edit your
                personal data in your account settings.
              </li>
              <li>
                <strong>Deletion Request:</strong> You can request account
                deletion by contacting us.
              </li>
              <li>
                <strong>Opt-Out of Communications:</strong> You can unsubscribe
                from emails and notifications at any time.
              </li>
            </ul>
          </Section>

          <Section title="6. Cookies & Tracking Technologies">
            <p>JourneySkill uses cookies and similar technologies to:</p>
            <ul className="list-disc ml-5 space-y-1 mt-2">
              <li>Improve platform functionality.</li>
              <li>Analyze user behavior.</li>
              <li>Store user preferences.</li>
            </ul>
            <p className="mt-2">
              You can adjust your browser settings to disable cookies, but this
              may affect platform functionality.
            </p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>
              JourneySkill is not intended for users under 13 years old. If we
              learn that we have collected data from a child under 13, we will
              delete it immediately.
            </p>
          </Section>

          <Section title="8. Changes to This Privacy Policy">
            <p>
              We may update this policy from time to time. If there are
              significant changes, we will notify you via email or within the
              platform.
            </p>
          </Section>

          <Section title="9. Contact Us">
            <p>
              If you have any questions about this Privacy Policy, contact us at{" "}
              <a
                href="mailto:support@journeyskill.com"
                className="text-blue-500 hover:underline"
              >
                ashraful.inbox@gmail.com
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
    </>
  );
};

// Reusable Section Component
const Section = ({ title, children }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mt-6">{title}</h2>
    <div className="mt-2">{children}</div>
    <hr className="my-6 border-gray-300" />
  </div>
);

// nav bar
const NavBar = () => {
  return (
    <nav className="bg-indigo-600 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="logo"
            width={20}
            height={20}
            style={{ width: "auto", height: "auto" }}
          />
          <p className="text-2xl font-bold text-white pl-2">JourneySkill</p>
        </Link>
      </div>
    </nav>
  );
};

export default page;
