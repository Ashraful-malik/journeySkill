import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = () => {
  const effectiveDate = "1 March 2025";
  return (
    <>
      <NavBar />
      <div className="bg-gray-100 text-gray-800 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-3xl p-8 rounded-lg">
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Effective Date:</strong> {effectiveDate}
          </p>

          <p className="mt-6">
            Welcome to JourneySkill. These Terms of Service (&quot;Terms&quot;)
            govern your access and use of JourneySkill (&quot;Platform&quot;),
            including all features, content, and services. By using
            JourneySkill, you agree to these Terms.
          </p>

          <hr className="my-6 border-gray-300" />

          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using JourneySkill, you confirm that you are at
              least 13 years old and have the legal authority to accept these
              Terms. If you do not agree, do not use the Platform.
            </p>
          </Section>

          <Section title="2. Account Registration & Security">
            <ul className="list-disc ml-5 space-y-1">
              <li>
                You must provide accurate information when creating an account.
              </li>
              <li>
                You are responsible for maintaining the security of your
                account.
              </li>
              <li>
                JourneySkill is not responsible for unauthorized account access.
              </li>
            </ul>
          </Section>

          <Section title="3. Use of the Platform">
            <ul className="list-disc ml-5 space-y-1">
              <li>
                You may create custom coding challenges, track progress, and
                interact with other users.
              </li>
              <li>
                You must not use the Platform for any illegal, abusive, or
                harmful activities.
              </li>
              <li>
                We reserve the right to suspend or terminate accounts that
                violate these Terms.
              </li>
            </ul>
          </Section>

          <Section title="4. User-Generated Content">
            <ul className="list-disc ml-5 space-y-1">
              <li>
                You retain ownership of the content you create on JourneySkill.
              </li>
              <li>
                By posting content, you grant JourneySkill a non-exclusive,
                royalty-free license to use, display, and distribute your
                content within the Platform.
              </li>
              <li>
                Content that is harmful, offensive, or infringes on others&apos;
                rights may be removed.
              </li>
            </ul>
          </Section>

          <Section title="5. Privacy">
            <p>
              Your use of the Platform is subject to our{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
            <p>We do not sell or share personal data without your consent.</p>
          </Section>

          <Section title="6. Intellectual Property">
            <ul className="list-disc ml-5 space-y-1">
              <li>
                All JourneySkill branding, logos, and original content are the
                property of JourneySkill.
              </li>
              <li>
                You may not copy, distribute, or modify JourneySkill&apos;s
                materials without permission.
              </li>
            </ul>
          </Section>

          <Section title="7. Third-Party Services">
            <ul className="list-disc ml-5 space-y-1">
              <li>
                JourneySkill may integrate with third-party tools and services.
              </li>
              <li>
                We are not responsible for third-party content, availability, or
                security practices.
              </li>
            </ul>
          </Section>

          <Section title="8. Termination">
            <ul className="list-disc ml-5 space-y-1">
              <li>
                We may suspend or terminate access to JourneySkill at our
                discretion if users violate these Terms.
              </li>
              <li>You may delete your account at any time.</li>
            </ul>
          </Section>

          <Section title="9. Disclaimers & Limitation of Liability">
            <ul className="list-disc ml-5 space-y-1">
              <li>
                JourneySkill is provided &quot;as is&quot; without warranties of
                any kind.
              </li>
              <li>
                We are not liable for any damages resulting from your use of the
                Platform.
              </li>
            </ul>
          </Section>

          <Section title="10. Changes to Terms">
            <ul className="list-disc ml-5 space-y-1">
              <li>We may update these Terms from time to time.</li>
              <li>
                Continued use of the Platform after changes indicates acceptance
                of the new Terms.
              </li>
            </ul>
          </Section>

          <Section title="11. Contact Information">
            <p>
              If you have any questions, contact us at{" "}
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

// NavBar Component
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

export default Page;
