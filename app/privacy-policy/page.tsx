import Navbar from "@/components/Navbar";

// export const runtime = "edge";

function Page() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-screen-lg flex-col items-start justify-start space-y-4 px-4 text-left">
      <Navbar />
      <div className="mx-auto max-w-screen-md space-y-4 pb-10 pt-6 text-sm text-muted-foreground">
        <h2 className="text-lg text-foreground">Privacy Policy</h2>
        <p>Effective Date: September 1, 2024</p>

        <h3 className="text-base text-foreground">1. Information We Collect</h3>
        <p>
          a. <strong>User-Provided Information</strong>: We collect information
          that you provide directly to us when you use our services, such as
          chat messages. These messages are stored locally in your browser.
        </p>
        <p>
          b. <strong>Google Login Information</strong>: If you use Google login
          to access our services, we collect your name, email address, and
          potentially your profile photo from your Google account.
        </p>

        <h3 className="text-base text-foreground">2. Subscription Payments</h3>
        <p>
          a. <strong>Payment Processing</strong>: We use Stripe to process
          subscription payments. When you subscribe, we collect payment details
          such as your credit card information, billing address, and other
          necessary information to process your payment.
        </p>
        <p>
          b. <strong>Payment Information Security</strong>: All payment
          information is securely transmitted to Stripe using encryption and is
          not stored on our servers. Stripe&apos;s privacy policy can be found
          on their website for more details about how they handle your data.
        </p>
        <p>
          c. <strong>Data Sharing with Stripe</strong>: By subscribing to our
          services, you consent to the sharing of your payment information with
          Stripe for the purpose of processing your payments.
        </p>

        <h3 className="text-base text-foreground">3. How We Use Information</h3>
        <p>
          a. <strong>Service Provision</strong>: We use your information to
          provide, maintain, and improve our services.
        </p>
        <p>
          b. <strong>Abuse Prevention</strong>: Messages are transiently
          classified on our servers to prevent abuse but are not stored
          permanently.
        </p>
        <p>
          c. <strong>Personalization</strong>: Information collected through
          Google login is used to personalize your experience and facilitate
          access to our services.
        </p>
        <p>
          d. <strong>Payment Processing</strong>: Information collected for
          subscription payments is used solely for processing payments and
          managing your subscription.
        </p>

        <h3 className="text-base text-foreground">4. Data Storage</h3>
        <p>
          a. <strong>Local Storage</strong>: Chat messages are stored locally in
          your browser and can be cleared at any time through your browser
          settings.
        </p>
        <p>
          b. <strong>Google Login Data</strong>: Information collected through
          Google login is stored securely on our servers and is protected by
          encryption.
        </p>
        <p>
          c. <strong>Payment Information</strong>: Payment information is
          securely handled by Stripe and is not stored on our servers.
        </p>

        <h3 className="text-base text-foreground">5. Data Security</h3>
        <p>
          a. <strong>Security Measures</strong>: We implement reasonable
          security measures to protect your information from unauthorized
          access, disclosure, alteration, or destruction.
        </p>
        <p>
          b. <strong>No Absolute Security Guarantee</strong>: While we strive to
          protect your data, we cannot guarantee absolute security for
          information transmitted over the internet.
        </p>

        <h3 className="text-base text-foreground">6. User Rights</h3>
        <p>
          a. <strong>Access, Modification, Deletion</strong>: You have the right
          to access, modify, or delete your data.
        </p>
        <p>
          b. <strong>Local Data Management</strong>: As data is stored locally,
          you can manage your data directly through your browser settings.
        </p>
        <p>
          c. <strong>Google Login Data</strong>: For information collected
          through Google login, you may access, modify, or delete your data by
          contacting us at the email address provided below.
        </p>
        <p>
          d. <strong>Payment Information</strong>: For any payment-related data,
          please refer to Stripe&apos;s privacy policy for managing your payment
          information.
        </p>

        <h3 className="text-base text-foreground">
          7. Changes to Privacy Policy
        </h3>
        <p>
          We reserve the right to update this Privacy Policy at any time. Any
          changes will be effective immediately upon posting the revised policy
          on the Website. Continued use of the service constitutes acceptance of
          the revised policy.
        </p>

        <h3 className="text-base text-foreground">8. Contact Information</h3>
        <p>
          If you have any questions or concerns about this Privacy Policy,
          please contact us at{" "}
          <a
            href="mailto:info@aitherapistfree.com"
            className="text-foreground hover:text-primary hover:underline"
          >
            info@aitherapistfree.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}

export default Page;
